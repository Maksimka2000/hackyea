# Innovations feature

This capability owns the public catalogue and admin workflows for innovation records.

Implemented:

- `GET /api/innovations/{id}` returns one published card with all its data (the official ROPS sections, category, links and licence). Unknown, unpublished or non-GUID ids give 404.
- `GET /api/innovations/featured` returns 3 short cards for the home page (cards with a dissemination badge first, then alphabetical).
- `GET /api/innovations/{id}/related` returns up to 3 other cards from the same category; an unknown id gives an empty list.

Admin editing (create, update, publish) belongs here too; add writer ports separately from the reader.

The `Innovation` entity and its invariant-preserving methods live in `HubMi.Domain/Innovations`. EF mappings and source import code live in `HubMi.Infrastructure`.
