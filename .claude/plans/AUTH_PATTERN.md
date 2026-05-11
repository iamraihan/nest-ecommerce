# AUTH_PATTERN.md

Save this file. Copy into every project.

---

## Auth Pattern: JWT + Refresh Family Rotation

### Tokens

| Token | Type | Lifetime | Storage (server) | Storage (client) |
|-------|------|----------|------------------|------------------|
| Access Token | JWT | 15 min | Not stored | Memory |
| Refresh Token | Random 40-byte hex | 7 days | DB (SHA-256 hashed) | httpOnly cookie |

### Access Token Payload
```json
{ "sub": "user_id", "role": "user|admin", "jti": "uuid", "iat": ..., "exp": ... }
```

### Cookie Settings (refresh token)
```
httpOnly: true, secure: true, sameSite: strict, maxAge: 7 days
```

---

### Database Schema

```sql
CREATE TABLE refresh_tokens (
  id          UUID PRIMARY KEY,
  user_id     UUID NOT NULL,
  family_id   UUID NOT NULL,
  token_hash  VARCHAR(64) UNIQUE NOT NULL,
  used        BOOLEAN DEFAULT FALSE,
  revoked     BOOLEAN DEFAULT FALSE,
  expires_at  TIMESTAMP NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW(),
  user_agent  TEXT,
  ip_address  VARCHAR(45)
);

CREATE INDEX ON refresh_tokens(token_hash);
CREATE INDEX ON refresh_tokens(user_id);
CREATE INDEX ON refresh_tokens(family_id);
CREATE INDEX ON refresh_tokens(expires_at);
```

### Redis (blocklist)
```
blocklist:jti:<jti>      → blocks specific access token
blocklist:user:<userId>  → blocks all access tokens for user
TTL: 15 min (matches access token lifetime)
```

---

### Endpoints

**POST /auth/login**
1. Verify email + password (bcrypt)
2. Generate new family_id (UUID)
3. Generate refresh token (40 random bytes)
4. Store in DB: { userId, familyId, tokenHash: sha256(token), expiresAt }
5. Set refresh token in httpOnly cookie
6. Return access token in JSON

**POST /auth/refresh**
1. Read refresh token from cookie
2. Look up by sha256(token) in DB
3. Reject if: not found / revoked / expired
4. If `used = true` → 🚨 REUSE DETECTED → revoke entire family → 401
5. Mark old token `used = true`
6. Create new refresh token, same family_id
7. Set new refresh token in cookie
8. Return new access token

**POST /auth/logout**
1. Revoke current family: `UPDATE refresh_tokens SET revoked=true WHERE family_id=X`
2. Clear cookie

**POST /auth/logout-all**
1. Revoke all user families: `UPDATE refresh_tokens SET revoked=true WHERE user_id=X`
2. Set `blocklist:user:<userId>` in Redis (15 min TTL)
3. Clear cookie

---

### Two-Tier Authentication

**Tier 1: `authenticate`** (public/normal routes)
- Verify JWT signature + expiry
- No Redis hit
- Used on: GET, profile, listings, cart, orders

**Tier 2: `authenticateStrict`** (sensitive routes)
- Verify JWT signature + expiry
- Check `blocklist:jti:<jti>` and `blocklist:user:<userId>` in Redis
- Used on: admin actions, DELETE, payments, account changes

**Rule:** Destructive / irreversible / sensitive → strict. Otherwise → light.

---

### Reuse Detection

When refresh token with `used = true` is presented:
1. Revoke entire family in DB
2. Add user to Redis blocklist (15 min TTL)
3. Clear cookie
4. Return 401
5. (Optional) Email user about security event

---

### Cleanup (Cron — nightly 3 AM, NOT a message queue)

```sql
DELETE FROM refresh_tokens
WHERE
  expires_at < NOW()
  OR (revoked = true AND created_at < NOW() - INTERVAL '30 days')
  OR (used = true AND created_at < NOW() - INTERVAL '8 days');
```

---

### Mass Revocation Triggers

Revoke all user families + set Redis user blocklist when:
- User clicks "Logout from all devices"
- Password changed
- Email changed
- 2FA enabled/disabled
- Suspicious activity detected
- Admin suspends/bans user

---

### Security Rules (Non-Negotiable)

1. SHA-256 hash refresh tokens before storing — never raw
2. httpOnly + secure + sameSite=strict on all auth cookies
3. HTTPS only in production
4. Access token in memory only — never localStorage
5. bcrypt or argon2 for passwords
6. Rotate refresh tokens on every refresh
7. Detect reuse via `used` flag — never delete used tokens immediately
8. Family-scoped revocation — kill the chain, not just one token
9. Minimal JWT payload — only userId, role, jti
10. Secrets in env vars only

---

### Client Behavior

```
On 401:
  → Try POST /auth/refresh once
  → If success: retry original request with new access token
  → If fail: clear state, redirect to login

Auto-refresh:
  → Refresh ~1 min before expiry, OR lazy on first 401

Storage:
  → Access token: in-memory only
  → Refresh token: httpOnly cookie (handled by browser)

On app load:
  → Call /auth/refresh
  → Success = logged in, Fail = logged out
```

---

### Implementation Checklist

- [ ] Access tokens are JWT with `jti`, 15 min expiry
- [ ] Refresh tokens are random bytes, NOT JWTs
- [ ] Refresh tokens stored hashed (SHA-256) in DB
- [ ] Each login creates a new `family_id`
- [ ] Each refresh inherits the existing `family_id`
- [ ] Old refresh tokens marked `used = true`, NOT deleted
- [ ] Refresh endpoint checks `used` for reuse detection
- [ ] Reuse detection revokes entire family
- [ ] Refresh tokens sent via httpOnly cookie
- [ ] Two middlewares: `authenticate` and `authenticateStrict`
- [ ] Sensitive routes use strict middleware
- [ ] Public/read routes use light middleware
- [ ] `/auth/logout` revokes single family
- [ ] `/auth/logout-all` revokes all families + Redis user blocklist
- [ ] Nightly cleanup cron in place
- [ ] HTTPS enforced in production
- [ ] Passwords hashed with bcrypt/argon2
- [ ] Secrets in environment variables
- [ ] DB indexes on `token_hash`, `user_id`, `family_id`, `expires_at`

---

### Pattern Reference

**Name:** OAuth 2.0 Refresh Token Rotation with Automatic Reuse Detection

**Specs:** RFC 6749, RFC 6819, OAuth 2.0 Security BCP

**Used by:** Auth0, AWS Cognito, Firebase Auth, Okta, Clerk, Supabase Auth, Stytch

---

### One-Sentence Summary

JWT access tokens (15 min, with `jti`) for stateless verification, paired with rotating refresh tokens (7 days, in DB with `family_id` and reuse detection) sent via httpOnly cookies, with a Redis blocklist checked only on sensitive routes, and a nightly cleanup cron — aligned with OAuth 2.0 best practices.