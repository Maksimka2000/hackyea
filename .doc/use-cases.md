# HubMI.pl — Use Cases (MVP, 6-hour build)

Goal: the smallest working product that covers **all 7 modules** from the ROPS criteria and passes the jury's tests.
Everything else is shown only in mockups or in the pitch.

Sources: ROPS criteria, contest rules, Mapa Wyzwań Społecznych, ROPS Innovation Library (`data/library_raw.json`).

---

## Ground rules (from the contest documents)

1. **Interface in Polish.** Pitch, PDF and video in Polish too.
2. **No real personal data.** All needs, ideas and users in the demo are made up. Innovation cards show the author **organisation** only; individual author names are replaced by a link to the original ROPS card.
3. **Trends are visible to the admin only.** No needs statistics on public pages.
4. **Accessible (WCAG 2.1 AA).** Large text, high contrast, works with keyboard only, labels on every field, plain language, voice input on the problem field, text description next to every video.
5. **No real login.** A role switcher at the top: *Mieszkaniec / Instytucja / ROPS / Ekspert*.
6. **Library content** is used with credit to ROPS (CC BY 4.0) and a link to the original card. Videos are embedded from YouTube, not copied.

---



## Users


| Role                                       | In the demo                                                          |
| ------------------------------------------ | -------------------------------------------------------------------- |
| **Mieszkaniec / NGO**                      | Reports problems and ideas, browses knowledge, rates solutions.      |
| **Instytucja** (gmina, OPS, CUS, DPS, NGO) | Looks for solutions, reports local challenges, adapts an innovation. |
| **ROPS** (admin)                           | Receives submissions, replies, edits cards, sees trends.             |
| **Ekspert**                                | Answers questions assigned by ROPS.                                  |


---



## Use cases


| #    | Use case                                | Role                    | Module                    |
| ---- | --------------------------------------- | ----------------------- | ------------------------- |
| UC1  | Describe a problem, get solutions       | Mieszkaniec, Instytucja | I Matchmaking (mandatory) |
| UC2  | Nothing fits → send the problem to ROPS | Mieszkaniec, Instytucja | I Matchmaking             |
| UC3  | Browse knowledge                        | Everyone                | II Knowledge base         |
| UC4  | Submit an idea card                     | Mieszkaniec             | III Idea creator          |
| UC5  | Rate a solution, sign up to test        | Mieszkaniec, Instytucja | IV Tester                 |
| UC6  | Ask a question, follow my submissions   | Mieszkaniec, Instytucja | V Communication           |
| UC7  | Admin inbox: see new submission, reply  | ROPS                    | VI Admin panel            |
| UC8  | Admin edits an innovation card          | ROPS                    | VI Admin panel            |
| UC9  | Admin sees trends                       | ROPS                    | II Knowledge base         |
| UC10 | Expert answers a question               | Ekspert                 | V Communication           |
| UC11 | Adapt an innovation to my institution   | Instytucja              | VII Middleman             |


---



### UC1. Describe a problem, get solutions

**Who:** resident or institution. **Module I (mandatory).**

1. User opens the home page and sees one field: *Opisz problem własnymi słowami*.
2. User types (or dictates) the problem. Short keywords also work, e.g. *samotność senior leki*.
3. User clicks **Znajdź rozwiązania**.
4. System shows:
  - **Co wiemy o tym problemie** — the matching Challenge Map area (e.g. *Seniorzy*): 2–3 sentences and key challenges.
  - **Proponowane rozwiązania** — 3–5 innovation cards. Each shows: name, one sentence, **Dlaczego pasuje**, and the official **Czy to działa?** summary.
5. User clicks a card to see the full card (UC3).
6. Under the results: **Żadne nie pasuje? Wyślij zgłoszenie do ROPS** → UC2.

**Result:** the user gets matching innovations and basic information about the problem.
**Rule:** always show results, never only a question back.

Example (official data): *„Mam 73 lata, mieszkam sama, czuję się samotna i biorę dużo leków”* → area *Seniorzy* → *Terapeuta przestrzeni*, *Inteligentny organizer do leków*, *Centrum antydepresyjne*.

---



### UC2. Nothing fits → send the problem to ROPS

**Who:** resident, or institution reporting a local challenge. **Module I.**

1. User clicks **Wyślij zgłoszenie do ROPS**.
2. The form is pre-filled with the text from UC1.
3. User fills in: **Kim jesteś?** (mieszkaniec / NGO / instytucja), **Gmina**, optional **e-mail** for the reply.
4. User ticks the consent box: *Zgadzam się na przetwarzanie danych w celu odpowiedzi*.
5. User clicks **Wyślij**.
6. System shows: *Dziękujemy. Numer zgłoszenia: HUB-0123. Odpowiedź zobaczysz w „Moje zgłoszenia”.*

**Result:** ROPS sees the new submission in the inbox (UC7). The user can follow it (UC6).

---



### UC3. Browse knowledge

**Who:** everyone. **Module II.**

1. User clicks **Wiedza**.
2. User picks one of three tabs:
  - **Mapa wyzwań** — 8 areas. Click an area → definition, key challenges, persona, report links.
  - **Biblioteka innowacji** — cards from the ROPS library. Filter by category (9). Search by word.
  - **Materiały** — list of educational materials and reports (links).
3. User opens an innovation card and sees the official sections: *Na czym polega · Jaki problem · Grupa docelowa · Kto może skorzystać · Czy to działa · Autor (organizacja)*, plus video (if any, with its text description), materials link, link to the ROPS original.

**Result:** the user finds clear information about a social issue and what already works.

---



### UC4. Submit an idea card

**Who:** resident or NGO. **Module III.**

1. User clicks **Zgłoś pomysł**.
2. User fills a short card:
  - **Na czym polega pomysł?**
  - **Dla kogo?**
  - **Jaki problem rozwiązuje?**
  - **Etap:** pomysł / przetestowany w małej skali / działa
3. Optional: user clicks **Popraw z AI** — the assistant suggests a clearer description and 2–3 ideas to develop it. User accepts or ignores.
4. System shows **Podobne innowacje** from the library (so the user can check it is new).
5. User clicks **Wyślij**.
6. System shows a confirmation and a submission number.

**Result:** ROPS gets the idea in the inbox (UC7).

---



### UC5. Rate a solution, sign up to test

**Who:** resident or institution. **Module IV.**

1. On any innovation card the user clicks **Oceń rozwiązanie**.
2. User gives 1–5 stars and optionally writes **Co poprawić?**
3. User clicks **Wyślij** → sees *Dziękujemy za opinię*.
4. Or the user clicks **Chcę przetestować**, leaves a name/e-mail and a short note why.
5. System confirms. ROPS sees the rating or test request in the inbox (UC7).

**Result:** the card shows the average rating; ROPS gets feedback and testers.

---



### UC6. Ask a question, follow my submissions

**Who:** resident or institution. **Module V.**

1. On any page the user clicks **Zapytaj ROPS** and writes a question.
2. User clicks **Wyślij** → gets a submission number.
3. User opens **Moje zgłoszenia** and sees all their needs, ideas and questions.
4. Each item shows a simple status: **Wysłane → W trakcie → Odpowiedź**.
5. When ROPS or an expert replies, the item shows a **Nowa odpowiedź** badge. User opens it and can write back.

**Result:** a direct conversation between the user and ROPS, with a visible status.

---



### UC7. Admin inbox: see new submission, reply

**Who:** ROPS. **Module VI.**

1. Admin switches to **ROPS**. The menu shows **Skrzynka** with a counter of new items (this is the notification).
2. Admin sees a list: type (potrzeba / pomysł / pytanie / ocena / test), short summary, suggested area, gmina, date.
3. Admin opens an item. The system shows matching innovations next to it.
4. Admin chooses one action:
  - **Odpowiedz** — writes a reply (can start from **Szkic AI**), clicks **Wyślij**.
  - **Przekaż ekspertowi** — picks an expert (UC10).
  - **Zamknij**.
5. The status changes for the user (UC6).

**Result:** every submission gets an answer and the user sees it. *(This is the "admin notification → answer to the author" path the jury tests.)*

---



### UC8. Admin edits an innovation card

**Who:** ROPS. **Module VI.**

1. Admin opens a card in the library and clicks **Edytuj**.
2. Admin changes text, category, video link or materials link.
3. Admin clicks **Zapisz i opublikuj**. The change is visible at once.
4. Admin can also click **Dodaj innowację** — e.g. to publish an idea from UC4 as a new card.

**Result:** knowledge is updated quickly without a developer.

---



### UC9. Admin sees trends

**Who:** ROPS only. **Module II.**

1. Admin opens **Trendy**.
2. Admin sees simple charts:
  - number of submissions per Challenge Map area,
  - number of submissions per gmina/powiat,
  - submissions over time,
  - top-rated innovations.
3. Admin clicks an area → sees the list of submissions in it.

**Result:** ROPS sees which problems people report most. Not visible to other roles.

---



### UC10. Expert answers a question

**Who:** expert. **Module V.**

1. Expert switches to **Ekspert** and sees **Przypisane do mnie** with a counter.
2. Expert opens an item: the question or idea, and matching innovations.
3. Expert writes feedback or an answer and clicks **Wyślij**.
4. The user sees the answer in **Moje zgłoszenia** (UC6). ROPS sees it in the inbox.

**Result:** innovators and institutions get expert feedback.

---



### UC11. Adapt an innovation to my institution

**Who:** any institution (gmina, OPS, CUS, DPS, NGO). **Module VII.**

1. On an innovation card the user clicks **Dostosuj do mojej instytucji**.
2. User answers 4 short questions:
  - **Typ instytucji** (gmina, OPS, CUS, DPS, NGO…)
  - **Wielkość** (np. liczba mieszkańców / podopiecznych)
  - **Ilu pracowników możesz zaangażować?**
  - **Budżet:** mały / średni / duży
3. User clicks **Przygotuj propozycję**.
4. AI shows a one-page plan: how the service would work here, first steps, people needed, risks (taken from the card's *Czy to działa?*).
5. User can **Pobierz** (print/PDF) or **Zapytaj eksperta** (UC6).

**Result:** an institution gets a ready concept for turning the innovation into its own service.

---

