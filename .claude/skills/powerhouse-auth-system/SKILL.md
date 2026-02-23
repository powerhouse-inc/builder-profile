---
name: powerhouse-auth-system
description: Reference for the Powerhouse Reactor API two-layer authorization system. Use this skill when configuring authentication, managing roles and permissions, troubleshooting access issues, or implementing auth-related features in a Powerhouse project.
---

This skill provides comprehensive reference for the Powerhouse Reactor API authorization system, covering global role-based access control, document-level permissions, authentication flows, and configuration. Use it when setting up auth, debugging access issues, or implementing permission logic.

The user may ask about configuring authentication, assigning roles, setting up document permissions, troubleshooting 401/403 errors, or understanding the auth architecture.

## Architecture Overview

The Powerhouse Reactor API implements a two-layer authorization system that controls access to both the API itself and specific documents within the system:

- **Layer 1**: Global role-based authorization (controls API access)
- **Layer 2**: Document permission system (controls per-document access)

## Configuration

### Environment Variables

Authentication is configured via environment variables or `powerhouse.config.json`:

```bash
# Core authentication
AUTH_ENABLED=true                    # Enable/disable auth system
SKIP_CREDENTIAL_VERIFICATION=true    # Skip Renown API verification (testing)

# Global roles
ADMINS="0x123...,0x456..."          # Admin wallet addresses
USERS="0x789...,0xabc..."           # User wallet addresses
GUESTS="0xdef...,0xghi..."          # Guest wallet addresses
FREE_ENTRY=true                      # Allow any authenticated user

# Document permissions
DOCUMENT_PERMISSIONS_ENABLED=true    # Enable fine-grained document permissions
```

### Configuration Loading

The server loads configuration in this priority order:

1. Environment variables (highest priority)
2. `powerhouse.config.json` file
3. Default values

## AuthService Implementation

### Core Class

The `AuthService` class handles authentication middleware and WebSocket authentication:

```typescript
export class AuthService {
  private readonly config: AuthConfig;

  constructor(config: AuthConfig) {
    this.config = config;
  }
}
```

### HTTP Request Authentication

The `authenticate` middleware processes incoming requests:

1. Skip auth for disabled auth, OPTIONS, or GET requests
2. Extract bearer token from Authorization header
3. Verify token using `verifyAuthBearerToken` from Renown SDK
4. Optionally verify credential exists on Renown API (skipped if `SKIP_CREDENTIAL_VERIFICATION=true`)
5. Extract user information (address, chainId, networkId)
6. Set user on request object for downstream authorization

### WebSocket Authentication

WebSocket connections use `authenticateWebSocketConnection` with a similar flow.

### Skip Credential Verification

When `SKIP_CREDENTIAL_VERIFICATION=true`, the system skips the Renown API check:

```typescript
if (!this.config.skipCredentialVerification) {
  const credentialExists = await this.verifyCredentialExists(
    user.address,
    user.chainId,
    verified.issuer,
  );
  if (!credentialExists) {
    res.status(401).json({ error: "Credentials no longer valid" });
    return;
  }
}
```

## Global Role-Based Authorization

### Role Definitions

| Role    | Access Level | Capabilities                                        |
|---------|-------------|-----------------------------------------------------|
| GUEST   | Read-only   | View public data, read permitted documents          |
| USER    | Standard    | Create/edit documents, regular operations            |
| ADMIN   | Full access | Manage drives, configure reactor, grant permissions  |

### Role Resolution

The system provides helper methods for role checking:

```typescript
getAdditionalContextFields() {
  return {
    isGuest: (address: string) => /* ... */,
    isUser: (address: string) => /* ... */,
    isAdmin: (address: string) => /* ... */
  };
}
```

## Document Permission System

### Permission Levels

| Level | Description | Capabilities                        |
|-------|------------|-------------------------------------|
| NONE  | No access  | Cannot view or modify               |
| READ  | View access| Can fetch and read documents        |
| WRITE | Edit access| Can modify and update documents     |
| ADMIN | Full access| Can manage permissions and settings |

### Permission Inheritance

Permissions flow down from parent documents:

```
Drive (ADMIN for Alice)
  └── Folder A (inherits ADMIN)
       └── Document 1 (inherits ADMIN)
  └── Folder B (READ for Alice)
       └── Document 2 (inherits READ)
```

### Database Schema

Document permissions are stored in six tables:

- **DocumentPermission** - Direct user-document permissions
- **Group** - Group definitions
- **UserGroup** - User-group memberships
- **DocumentGroupPermission** - Group-document permissions
- **OperationUserPermission** - User-operation permissions
- **OperationGroupPermission** - Group-operation permissions

## Integration Points

### Server Initialization

The `AuthService` is instantiated during server setup:

```typescript
const authService = new AuthService({
  enabled: authEnabled,
  guests,
  users,
  admins,
  freeEntry,
  skipCredentialVerification,
});

app.use((req, res, next) => {
  authService.authenticate(req as AuthenticatedRequest, res, next);
});
```

### GraphQL Integration

When `DOCUMENT_PERMISSIONS_ENABLED=true`, an Auth subgraph is registered that adds permission-related queries and mutations to the GraphQL API.

### Ren Authentication Flow

1. User authenticates via `ph login` (Ethereum wallet + DID)
2. User generates bearer token via `ph access-token`
3. Token included in API requests via `Authorization: Bearer <token>`
4. Reactor API validates JWT and extracts Ethereum address
5. Permission checks performed using the address

Tokens are verified using `verifyAuthBearerToken` from the Renown SDK.

## Best Practices

- Use **groups** for team access instead of individual permissions
- Grant **ADMIN sparingly** - only to users who need to manage permissions
- Use **permission inheritance** - grant at drive/folder level when possible
- **Regular audits** - review and remove stale access permissions
- **Principle of least privilege** - start users with minimal required access

## Troubleshooting

### Common Issues

| Symptom | Check |
|---------|-------|
| 403 Forbidden | User's address in role lists, or `FREE_ENTRY=true` |
| 401 Unauthorized | Valid bearer token and authentication |
| Configuration not taking effect | Restart reactor after changes |
| Permission denied | Both global roles AND document permissions |

### Debugging Commands

```bash
# Check authentication status
ph login --status

# Generate new access token
ph access-token --expiry 7d

# Test authenticated request
curl -X POST http://localhost:4001/graphql \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"query":"{ userDocumentPermissions { documentId permission } }"}'
```

## Security Considerations

- **Never** use `AUTH_ENABLED=false` in production
- Use **HTTPS** in production - never expose API over plain HTTP
- Secure admin addresses - keep admin wallet private keys secure
- `SKIP_CREDENTIAL_VERIFICATION` - only for testing, not production
- Regular access audits - review role assignments periodically

## Migration Notes

The authorization system evolved from an earlier implementation. The `SKIP_CREDENTIAL_VERIFICATION` flag was introduced alongside the removal of `isUserAllowedCheck`.
