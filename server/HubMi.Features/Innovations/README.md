# Innovations feature example

This capability owns the public catalogue and admin workflows for innovation records.

When implementation begins, place a thin `InnovationsController` in `Controllers/`. Put HTTP request and response types in `Contracts/`, request validators in `Validators/`, workflow code in `Services/`, and feature-specific ports (for example, a catalogue reader or writer) in `Ports/`.

The `Innovation` entity and its invariant-preserving methods belong in `HubMi.Domain/Innovations`. EF mappings and source import code belong in `HubMi.Infrastructure`.
