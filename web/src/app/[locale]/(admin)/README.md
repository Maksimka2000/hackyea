# Admin Group

Staff-only area of the product (submissions inbox, content editing). Requires an authenticated admin.

Routes live here under `[locale]`, for example `src/app/[locale]/(admin)/admin/page.tsx`. Feature code lives in `src/features/admin`, not here.

This group gets its own layout (admin chrome), separate from the public site header and footer.
