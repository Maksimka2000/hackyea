<div align="center">

# HubMI.pl

**The digital heart of the Małopolski Hub Innowacji Społecznych**

*Describe a social problem in plain Polish — get proven social innovations that fit.*

[![Watch the HubMI.pl demo](https://img.youtube.com/vi/V54dFWzSASo/maxresdefault.jpg)](https://youtu.be/V54dFWzSASo)

[▶ Watch the demo video](https://youtu.be/V54dFWzSASo)

</div>

---

## General idea

HubMI.pl is a web platform where a person describes a social problem in plain Polish and gets matching, ready-made social innovations from the ROPS Library of Social Innovations. The same platform lets users send needs, ideas and good practices, rate innovations, and prepare grant ideas on a canvas. ROPS staff manage the knowledge, answer submissions and watch needs trends in an admin panel.

Built as a prototype for the **HackYeah 2026** challenge set by **ROPS Kraków** (the regional social policy centre).

### Who it is for

Residents, NGOs and local governments (JST) of Małopolska, and the ROPS Kraków staff who run the hub.

### The problem

Many grassroots initiatives solve local problems, but there is no shared place to diagnose problems, develop ideas, test innovations and spread proven solutions. Good micro-solutions do not scale, and the same problems are solved again and again.

### What HubMI.pl solves

- A resident or a JST finds an existing innovation from a free-text description, with a visible reason why it matches.
- ROPS gets a structured channel for needs and ideas, with status, conversation, notifications and aggregated trends.

### Headline ideas

- **Meaning-based search, not keyword search.** Two local neural models (BGE-M3 embeddings and a bge-reranker-v2-m3 cross-encoder) run inside the .NET API through ONNX Runtime. No LLM, no external AI service, no GPU, no per-request cost.
- **"An empty result is a valid answer."** A wrong card is worse than no card, so the engine has a tuned relevance threshold.
- **Explainable matches.** The search shows why a card matched, using only the card's own stored text with the user's words highlighted. Nothing is generated.
- **Instant updates.** Vectors live in PostgreSQL (pgvector, HNSW index). A card edit is searchable on every API instance within seconds, with no redeploy.
- **Accessibility as a product feature.** Three text sizes, a high-contrast mode, keyboard focus rings and a skip link, built for seniors and people with disabilities (WCAG 2.1 AA target).
- **Wide coverage.** One codebase covers 6 of the 7 challenge modules, with a thin but working version of each.
