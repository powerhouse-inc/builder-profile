# Builder Profile Migration Script

Migrates all builder profile documents from a source drive (on one MCP endpoint) to a new "BuildersV2" drive (on another MCP endpoint).

## Prerequisites

- [Bun](https://bun.sh/) installed
- Source MCP server accessible (remote or local)
- Target MCP server running (e.g., via `ph vetra`)

## Usage

```bash
bun scripts/builder-migration/migrate_builders.ts <source-mcp-url> <source-drive-id> <target-mcp-url>
```

### Parameters

| Parameter | Description |
|-----------|-------------|
| `source-mcp-url` | The source MCP server URL where existing builder profiles live |
| `source-drive-id` | The ID of the drive containing the builder profiles to migrate |
| `target-mcp-url` | The target MCP server URL where the new "BuildersV2" drive will be created |

### Example

```bash
bun scripts/builder-migration/migrate_builders.ts \
  https://switchboard-staging.powerhouse.xyz/mcp \
  builders \
  https://switchboard-staging.powerhouse.xyz/mcp
```

This will:
1. Fetch builder profiles from `https://switchboard.powerhouse.xyz/mcp` in the drive `source-drive-id`
2. Create a "BuildersV2" drive on `http://localhost:4001/mcp` (if it doesn't exist)
3. Migrate all builder profiles to the new drive

## What it does

1. **Checks for BuildersV2 drive** - Creates it if it doesn't exist
2. **Fetches all documents** from the source drive
3. **Filters builder profiles** - Only migrates documents of type `powerhouse/builder-profile`
4. **For each builder profile**:
   - Creates a new empty document
   - Adds it to the BuildersV2 drive
   - Copies all state data:
     - Profile info (name, code, slug, icon, description, about, status, type)
     - `isOperator` flag
     - Skills
     - Scopes
     - Links
     - Contributors

## Output

The script provides detailed progress output:

```
======================================================================
Builder Profile Migration Script
======================================================================

Configuration:
  Source MCP URL: https://switchboard.powerhouse.xyz/mcp
  Source Drive ID: my-source-drive-id
  Target MCP URL: http://localhost:4001/mcp
  Target Drive Name: BuildersV2

Checking for existing drives on target MCP...
✓ Found 3 drives on target
✓ Drive "BuildersV2" already exists (ID: abc123)

Fetching documents from source drive "my-source-drive-id" on source MCP...
✓ Found 5 documents in source drive
✓ Found 3 builder profile documents

----------------------------------------------------------------------
Starting migration...
----------------------------------------------------------------------

[1/3] Migrating: John Doe
  - Name: John Doe
  - Type: INDIVIDUAL
  - Status: ACTIVE
  - Is Operator: false
  - Skills: 3
  - Scopes: 2
  - Links: 1
  - Contributors: 0
  ✓ Created new document on target: xyz789
  ✓ Added to drive "BuildersV2"
  - Generated 8 actions
  ✓ Applied all migration actions
  ✓ Migration complete for "John Doe"

...

======================================================================
Migration Summary
======================================================================
  Total documents found: 3
  Successfully migrated: 3
  Errors: 0
  Target drive: BuildersV2 (abc123)
======================================================================

✓ Migration completed successfully!
```

## Troubleshooting

### Target MCP server not running

If you see connection errors to the target, make sure the target MCP server is running:

```bash
ph vetra
```

### Source MCP server not accessible

If you can't connect to the source MCP server, verify:
- The URL is correct and includes the `/mcp` path
- The server is accessible from your network
- Any required authentication is configured

### Drive not found

Ensure the source drive ID is correct. You can list available drives using the MCP tools.

### Permission errors

Make sure you have:
- Read access to the source drive
- Write access to create new drives and documents on the target
