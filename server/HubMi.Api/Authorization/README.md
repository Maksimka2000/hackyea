# Authorization

JWT bearer authentication for the four account roles (`Resident`, `Ngo`, `Jst`, `Admin`). Endpoints declare access with
`[Authorize(Roles = AccountRoles.Admin)]` or `AccountRoles.Submitters`; public matching and catalogue routes stay anonymous.

The token carries `sub`, `email`, `jti` and `role` only, signed with `Auth:Jwt:SecretKey` (HMAC-SHA256, 32+ bytes).
There are no refresh tokens and no server-side permission cache: roles are coarse and change only through seeding.
