#!/usr/bin/env bun

/**
 * Builder Profile Migration Script
 *
 * Migrates all builder profile documents from a source drive (on one MCP endpoint)
 * to a new "BuildersV2" drive (on another MCP endpoint).
 *
 * Usage:
 *   bun migrate_builders.ts <source-mcp-url> <source-drive-id> <target-mcp-url>
 *
 * Example:
 *   bun migrate_builders.ts \
 *     https://switchboard.powerhouse.xyz/mcp \
 *     source-drive-id \
 *     http://localhost:4001/mcp
 */

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length !== 3) {
  console.error(
    "Usage: bun migrate_builders.ts <source-mcp-url> <source-drive-id> <target-mcp-url>",
  );
  console.error("");
  console.error("Example:");
  console.error("  bun migrate_builders.ts \\");
  console.error("    https://switchboard.powerhouse.xyz/mcp \\");
  console.error("    source-drive-id \\");
  console.error("    http://localhost:4001/mcp");
  process.exit(1);
}

const [SOURCE_MCP_URL, SOURCE_DRIVE_ID, TARGET_MCP_URL] = args;

const TARGET_DRIVE_NAME = "BuildersV2";
const BUILDER_PROFILE_DOC_TYPE = "powerhouse/builder-profile";

// Types
interface MCPRequest {
  jsonrpc: string;
  method: string;
  params: {
    name: string;
    arguments: Record<string, unknown>;
  };
  id: number;
}

interface MCPResponse {
  result?: {
    structuredContent?: unknown;
    content?: Array<{ text: string }>;
  };
  error?: {
    message: string;
    code?: number;
  };
}

interface BuilderProfileState {
  id?: string;
  code?: string;
  slug?: string;
  name?: string;
  icon?: string;
  description?: string;
  about?: string;
  lastModified?: string;
  isOperator: boolean;
  type: "INDIVIDUAL" | "TEAM";
  contributors: string[];
  status?: "ACTIVE" | "INACTIVE" | "ON_HOLD" | "COMPLETED" | "ARCHIVED";
  skills: string[];
  scopes: string[];
  links: Array<{ id: string; url: string; label?: string }>;
}

interface BuilderProfileDocument {
  header: {
    id: string;
    documentType: string;
    name?: string;
  };
  state: {
    global: BuilderProfileState;
  };
}

let requestId = 1;

// Helper function to make MCP requests
async function mcpRequest(
  mcpUrl: string,
  payload: MCPRequest,
): Promise<MCPResponse> {
  const response = await fetch(mcpUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text();

  // Handle SSE format (event: message\ndata: {...})
  if (text.includes("event: message")) {
    const lines = text.split("\n");
    const dataLine = lines.find((line) => line.startsWith("data: "));
    if (dataLine) {
      const jsonData = dataLine.substring(6);
      return JSON.parse(jsonData) as MCPResponse;
    }
    throw new Error("No data line found in SSE response");
  }

  return JSON.parse(text) as MCPResponse;
}

// Get all drive IDs from target MCP
async function getTargetDriveIds(): Promise<string[]> {
  const payload: MCPRequest = {
    jsonrpc: "2.0",
    method: "tools/call",
    params: {
      name: "getDrives",
      arguments: {},
    },
    id: requestId++,
  };

  const response = await mcpRequest(TARGET_MCP_URL, payload);
  if (response.error) {
    throw new Error(`Failed to get drives: ${JSON.stringify(response.error)}`);
  }

  const result = response.result?.structuredContent as { driveIds?: string[] };
  return result?.driveIds || [];
}

// Create a new drive on target MCP
async function createTargetDrive(name: string): Promise<string> {
  const payload: MCPRequest = {
    jsonrpc: "2.0",
    method: "tools/call",
    params: {
      name: "addDrive",
      arguments: {
        driveInput: {
          id: name,
          slug: name,
          global: {
            name,
            icon: null,
          },
          local: {
            availableOffline: false,
            sharingType: null,
          },
        },
      },
    },
    id: requestId++,
  };

  const response = await mcpRequest(TARGET_MCP_URL, payload);
  if (response.error) {
    throw new Error(
      `Failed to create drive: ${JSON.stringify(response.error)}`,
    );
  }

  // The drive ID will be the name we provided
  const result = response.result?.structuredContent as {
    id?: string;
    drive?: { id?: string };
  };
  const driveId = result?.id || result?.drive?.id || name;

  return driveId;
}

// Get document IDs from source drive
async function getSourceDocumentIds(driveId: string): Promise<string[]> {
  const payload: MCPRequest = {
    jsonrpc: "2.0",
    method: "tools/call",
    params: {
      name: "getDocuments",
      arguments: { parentId: driveId },
    },
    id: requestId++,
  };

  const response = await mcpRequest(SOURCE_MCP_URL, payload);
  if (response.error) {
    throw new Error(
      `Failed to get documents: ${JSON.stringify(response.error)}`,
    );
  }

  const result = response.result?.structuredContent as {
    documentIds?: string[];
  };
  return result?.documentIds || [];
}

// Get a specific document from source MCP
async function getSourceDocument(
  docId: string,
): Promise<BuilderProfileDocument> {
  const payload: MCPRequest = {
    jsonrpc: "2.0",
    method: "tools/call",
    params: {
      name: "getDocument",
      arguments: { id: docId },
    },
    id: requestId++,
  };

  const response = await mcpRequest(SOURCE_MCP_URL, payload);
  if (response.error) {
    throw new Error(
      `Failed to get document: ${JSON.stringify(response.error)}`,
    );
  }

  const result = response.result?.structuredContent as {
    document?: BuilderProfileDocument;
  };
  if (!result?.document) {
    throw new Error(`No document returned for ID: ${docId}`);
  }

  return result.document;
}

// Create a new document on target MCP
async function createTargetDocument(documentType: string): Promise<string> {
  const payload: MCPRequest = {
    jsonrpc: "2.0",
    method: "tools/call",
    params: {
      name: "createDocument",
      arguments: { documentType },
    },
    id: requestId++,
  };

  const response = await mcpRequest(TARGET_MCP_URL, payload);
  if (response.error) {
    throw new Error(
      `Failed to create document: ${JSON.stringify(response.error)}`,
    );
  }

  // Try multiple possible response formats
  const structured = response.result?.structuredContent as Record<
    string,
    unknown
  >;
  const docId =
    structured?.id ||
    structured?.documentId ||
    (structured?.document as Record<string, unknown>)?.id ||
    (structured?.header as Record<string, unknown>)?.id;

  if (!docId || typeof docId !== "string") {
    throw new Error("No document ID returned from createDocument");
  }

  return docId;
}

// Add actions to a document on target MCP
async function addTargetActions(
  documentId: string,
  actions: Array<{ type: string; scope: string; input: unknown }>,
): Promise<void> {
  const payload: MCPRequest = {
    jsonrpc: "2.0",
    method: "tools/call",
    params: {
      name: "addActions",
      arguments: { documentId, actions },
    },
    id: requestId++,
  };

  const response = await mcpRequest(TARGET_MCP_URL, payload);
  if (response.error) {
    throw new Error(`Failed to add actions: ${JSON.stringify(response.error)}`);
  }
}

// Generate actions to populate a builder profile from source state
function generateMigrationActions(
  sourceState: BuilderProfileState,
): Array<{ type: string; scope: string; input: unknown }> {
  const actions: Array<{ type: string; scope: string; input: unknown }> = [];

  // 1. Update basic profile information - always include this with all available data
  const profileInput: Record<string, unknown> = {};

  // Set defaults for required fields if missing from source
  profileInput.type = sourceState.type || "INDIVIDUAL";

  // Copy optional fields if they exist
  if (sourceState.id) profileInput.id = sourceState.id;
  if (sourceState.code) profileInput.code = sourceState.code;
  if (sourceState.slug) profileInput.slug = sourceState.slug;
  if (sourceState.name) profileInput.name = sourceState.name;
  if (sourceState.icon) profileInput.icon = sourceState.icon;
  if (sourceState.description)
    profileInput.description = sourceState.description;
  if (sourceState.about) profileInput.about = sourceState.about;
  if (sourceState.status) profileInput.status = sourceState.status;

  // Always push UPDATE_PROFILE to set the basic data
  actions.push({
    type: "UPDATE_PROFILE",
    scope: "global",
    input: profileInput,
  });

  // 2. Set operator flag - default to false if undefined in source
  const isOperator =
    sourceState.isOperator !== undefined && sourceState.isOperator !== null
      ? sourceState.isOperator
      : false;

  actions.push({
    type: "SET_OPERATOR",
    scope: "global",
    input: { isOperator },
  });

  // 3. Add skills
  if (sourceState.skills && sourceState.skills.length > 0) {
    sourceState.skills.forEach((skill) => {
      actions.push({
        type: "ADD_SKILL",
        scope: "global",
        input: { skill },
      });
    });
  }

  // 4. Add scopes
  if (sourceState.scopes && sourceState.scopes.length > 0) {
    sourceState.scopes.forEach((scope) => {
      actions.push({
        type: "ADD_SCOPE",
        scope: "global",
        input: { scope },
      });
    });
  }

  // 5. Add links
  if (sourceState.links && sourceState.links.length > 0) {
    sourceState.links.forEach((link) => {
      actions.push({
        type: "ADD_LINK",
        scope: "global",
        input: {
          id: link.id,
          url: link.url,
          label: link.label || undefined,
        },
      });
    });
  }

  // 6. Add contributors
  if (sourceState.contributors && sourceState.contributors.length > 0) {
    sourceState.contributors.forEach((contributorPHID) => {
      actions.push({
        type: "ADD_CONTRIBUTOR",
        scope: "global",
        input: { contributorPHID },
      });
    });
  }

  return actions;
}

// Main function
async function main() {
  try {
    console.log("=".repeat(70));
    console.log("Builder Profile Migration Script");
    console.log("=".repeat(70));
    console.log("\nConfiguration:");
    console.log(`  Source MCP URL: ${SOURCE_MCP_URL}`);
    console.log(`  Source Drive ID: ${SOURCE_DRIVE_ID}`);
    console.log(`  Target MCP URL: ${TARGET_MCP_URL}`);
    console.log(`  Target Drive Name: ${TARGET_DRIVE_NAME}`);
    console.log("");

    // Step 1: Check if BuildersV2 drive exists on target MCP
    console.log("Checking for existing drives on target MCP...");
    const driveIds = await getTargetDriveIds();
    console.log(`✓ Found ${driveIds.length} drives on target`);

    let targetDriveId: string;
    const existingDriveId = driveIds.find((id) => id === TARGET_DRIVE_NAME);

    if (existingDriveId) {
      console.log(`✓ Drive "${TARGET_DRIVE_NAME}" already exists`);
      targetDriveId = existingDriveId;
    } else {
      console.log(`Creating new drive "${TARGET_DRIVE_NAME}" on target MCP...`);
      targetDriveId = await createTargetDrive(TARGET_DRIVE_NAME);
      console.log(
        `✓ Created drive "${TARGET_DRIVE_NAME}" (ID: ${targetDriveId})`,
      );
    }

    // Step 2: Get all document IDs from source drive
    console.log(
      `\nFetching documents from source drive "${SOURCE_DRIVE_ID}" on source MCP...`,
    );
    const sourceDocIds = await getSourceDocumentIds(SOURCE_DRIVE_ID);
    console.log(`✓ Found ${sourceDocIds.length} documents in source drive`);

    if (sourceDocIds.length === 0) {
      console.log("\n⚠ No documents found in source drive");
      return;
    }

    // Step 3: Fetch each document and filter for builder profiles
    console.log(
      "\nFetching document details and filtering builder profiles...",
    );
    const builderProfileDocs: Array<{
      id: string;
      doc: BuilderProfileDocument;
    }> = [];

    for (const docId of sourceDocIds) {
      try {
        const doc = await getSourceDocument(docId);
        if (doc.header.documentType === BUILDER_PROFILE_DOC_TYPE) {
          builderProfileDocs.push({ id: docId, doc });
        }
      } catch (error) {
        console.log(`  - Skipping ${docId}: ${error}`);
      }
    }

    console.log(
      `✓ Found ${builderProfileDocs.length} builder profile documents`,
    );

    if (builderProfileDocs.length === 0) {
      console.log("\n⚠ No builder profile documents found to migrate");
      return;
    }

    // Step 4: Migrate each builder profile
    console.log("\n" + "-".repeat(70));
    console.log("Starting migration...");
    console.log("-".repeat(70));

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < builderProfileDocs.length; i++) {
      const { id: sourceDocId, doc: sourceDoc } = builderProfileDocs[i];
      const sourceState = sourceDoc.state.global;

      console.log(
        `\n[${i + 1}/${builderProfileDocs.length}] Migrating: ${sourceState.name || sourceDocId}`,
      );

      try {
        console.log(`  - Name: ${sourceState.name || "(unnamed)"}`);
        console.log(`  - Type: ${sourceState.type}`);
        console.log(`  - Status: ${sourceState.status || "(no status)"}`);
        console.log(`  - Is Operator: ${sourceState.isOperator}`);
        console.log(`  - Skills: ${sourceState.skills?.length || 0}`);
        console.log(`  - Scopes: ${sourceState.scopes?.length || 0}`);
        console.log(`  - Links: ${sourceState.links?.length || 0}`);
        console.log(
          `  - Contributors: ${sourceState.contributors?.length || 0}`,
        );

        // Create new document on target MCP
        const newDocId = await createTargetDocument(BUILDER_PROFILE_DOC_TYPE);
        console.log(`  ✓ Created new document on target: ${newDocId}`);

        // Add document to target drive
        await addTargetActions(targetDriveId, [
          {
            type: "ADD_FILE",
            scope: "global",
            input: {
              id: newDocId,
              name: sourceState.name || "Untitled Builder",
              documentType: BUILDER_PROFILE_DOC_TYPE,
            },
          },
        ]);
        console.log(`  ✓ Added to drive "${TARGET_DRIVE_NAME}"`);

        // Generate and apply migration actions to target document
        const migrationActions = generateMigrationActions(sourceState);
        console.log(`  - Generated ${migrationActions.length} actions`);

        if (migrationActions.length > 0) {
          // Send actions in batches of 20
          const BATCH_SIZE = 20;
          for (let j = 0; j < migrationActions.length; j += BATCH_SIZE) {
            const batch = migrationActions.slice(j, j + BATCH_SIZE);
            await addTargetActions(newDocId, batch);
          }
          console.log(`  ✓ Applied all migration actions`);
        }

        successCount++;
        console.log(
          `  ✓ Migration complete for "${sourceState.name || sourceDocId}"`,
        );
      } catch (error) {
        errorCount++;
        console.error(`  ✗ Error migrating document: ${error}`);
      }
    }

    // Summary
    console.log("\n" + "=".repeat(70));
    console.log("Migration Summary");
    console.log("=".repeat(70));
    console.log(`  Total documents found: ${builderProfileDocs.length}`);
    console.log(`  Successfully migrated: ${successCount}`);
    console.log(`  Errors: ${errorCount}`);
    console.log(`  Target drive: ${TARGET_DRIVE_NAME} (${targetDriveId})`);
    console.log("=".repeat(70));

    if (errorCount === 0) {
      console.log("\n✓ Migration completed successfully!");
    } else {
      console.log(`\n⚠ Migration completed with ${errorCount} error(s)`);
    }
  } catch (error) {
    console.error("\n✗ Fatal error:", error);
    process.exit(1);
  }
}

// Run the script
main();
