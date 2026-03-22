# GraphQL Client Migration Guide

The Reactor API no longer exposes auto-generated document-model-specific queries/mutations (e.g. `BuilderProfile_findDocuments`). All projects must migrate to the **generic Reactor API**.

## Query Changes

### Find Documents

```diff
- query FindBuilderProfiles {
-   BuilderProfile_findDocuments(search: {}) {
-     items { id name state { global { name slug } } }
+ query FindBuilderProfiles {
+   findDocuments(search: { type: "powerhouse/builder-profile" }) {
+     items { id name state }
      totalCount
    }
  }
```

**Key differences:**
- Use `findDocuments` with `search: { type: "<your-document-type>" }` instead of `<ModelName>_findDocuments`
- `state` is now a `JSONObject` (untyped), not a typed nested object
- Filter by document type via the `type` field in `SearchFilterInput`

### Get Single Document

```diff
- query GetBuilderProfile($identifier: String!) {
-   BuilderProfile_document(identifier: $identifier) {
-     document { id name state { global { name slug } } }
+ query GetBuilderProfile($identifier: String!) {
+   document(identifier: $identifier) {
+     document { id name state }
    }
  }
```

**Key differences:**
- Use `document(identifier: ...)` instead of `<ModelName>_document`
- `state` is `JSONObject` — extract the `global` scope at runtime

### Mutations (dispatching actions)

```diff
- mutation BuilderProfile_setOpHubMember($docId: PHID!, $input: BuilderProfile_SetOpHubMemberInput!) {
-   BuilderProfile_setOpHubMember(docId: $docId, input: $input)
- }
+ mutation SetOpHubMember($documentIdentifier: String!, $actions: [JSONObject!]!) {
+   mutateDocument(documentIdentifier: $documentIdentifier, actions: $actions) {
+     id
+     name
+   }
+ }
```

**Key differences:**
- Use `mutateDocument(documentIdentifier, actions)` instead of `<ModelName>_<operationName>`
- Actions are plain JSON objects: `{ type: "SET_OP_HUB_MEMBER", input: {...}, scope: "global" }`
- The response returns the updated `PHDocument`, not a boolean

## Handling the `state` Field

The `state` field is now `JSONObject`. Extract the global scope at runtime:

```typescript
function getGlobalState(state: Record<string, unknown>): Record<string, unknown> {
  if (state && typeof state === "object" && "global" in state) {
    return (state as { global: Record<string, unknown> }).global;
  }
  return state;
}

// Usage
const global = getGlobalState(item.state);
const name = (global.name as string) ?? null;
```

## Response Interface Changes

```diff
- interface FindResponse {
-   BuilderProfile_findDocuments: { items: Item[]; totalCount: number };
- }
+ interface FindResponse {
+   findDocuments: { items: Item[]; totalCount: number };
+ }

- interface SingleResponse {
-   BuilderProfile_document: { document: Item } | null;
- }
+ interface SingleResponse {
+   document: { document: Item } | null;
+ }

- interface MutationResponse {
-   BuilderProfile_setOpHubMember: boolean;
- }
+ interface MutationResponse {
+   mutateDocument: { id: string; name: string } | null;
+ }
```

## Available Generic API

| Operation | Old (removed) | New (generic) |
|-----------|--------------|---------------|
| Find documents | `<Model>_findDocuments(search)` | `findDocuments(search: { type: "powerhouse/<model>" })` |
| Get document | `<Model>_document(identifier)` | `document(identifier)` |
| Mutate document | `<Model>_<operation>(docId, input)` | `mutateDocument(documentIdentifier, actions)` |

See the full schema at `node_modules/@powerhousedao/reactor-api/dist/src/graphql/reactor/schema.graphql` for all available queries, mutations, and input types.
