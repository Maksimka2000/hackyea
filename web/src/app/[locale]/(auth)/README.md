# Auth Group

Sign-in for ROPS staff (`/admin/login`). Residents, NGOs and local governments sign in at `/login` (public group) through
the simulated Profil Zaufany screen. Accounts are seeded; there is no registration.

Auth feature code lives in `src/features/auth`; the session store and guards live in `src/shared/account` and `src/shared/lib/auth-session.ts`.
