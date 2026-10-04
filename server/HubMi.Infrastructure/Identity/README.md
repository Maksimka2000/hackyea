# Identity

Account storage (ASP.NET Core Identity tables in the HubMI database) and password checks for the `IAccountDirectory` port.
Roles: `Resident`, `Ngo`, `Jst` (public portal) and `Admin` (ROPS staff panel); one role per account.

There is no registration. `DemoAccountSeeder` creates the roles and the demo accounts listed in
`Imports/SampleData/demo-accounts.json` when `Persistence:SeedIdentity` is on. The access token is issued by the API host.
