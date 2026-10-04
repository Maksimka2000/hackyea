# Admin Group

ROPS staff panel: overview, submissions inbox and detail (reply, status, moderation, links, publish as card),
knowledge editing (innovations, challenges, materials), Innovation Tester feedback and the trend dashboard.

`layout.tsx` renders `AdminShell` from `src/features/admin`, which has its own header and navigation and shows a sign-in
prompt unless the session belongs to an `Admin` account. Staff sign in at `/admin/login` (`(auth)` group).
