# Innovations feature

This capability owns the public catalogue and admin workflows for innovation records.

Implemented:

- `GET /api/innovations/{id}` returns one published card with all its data (the official ROPS sections, category, links and licence). Unknown, unpublished or non-GUID ids give 404.
- `GET /api/innovations/featured` returns 3 short cards for the home page (cards with a dissemination badge first, then alphabetical).
- `GET /api/innovations/{id}/related` returns up to 3 other cards from the same category; an unknown id gives an empty list.
- `GET /api/innovations?categoryId=…` returns the catalogue as short cards (with the dissemination badge and the `hasVideo` / `hasEvidence` flags), ordered by category then title; without `categoryId` it returns all cards, with an unknown one it gives 404.
- `GET /api/categories` returns the categories in display order with their number of published cards.

Admin editing (create, update, publish) belongs here too; add writer ports separately from the reader.

The `Innovation` entity and its invariant-preserving methods live in `HubMi.Domain/Innovations`. EF mappings and source import code live in `HubMi.Infrastructure`.
