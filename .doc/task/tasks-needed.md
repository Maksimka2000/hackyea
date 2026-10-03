I read all three PDFs. I had to extract their text with a temporary pypdf install in the scratchpad, because the Read tool needs pdftoppm and it isn't installed here. The material is in Polish, and the rules also include an English copy. Here's what matters.

The task
Build HubMI.pl, an AI-supported prototype platform and "digital heart" for the Małopolski Hub Innowacji Społecznych (ROPS Kraków). It should connect social problems to existing innovations and to the people who can help. The task is open-ended, with no single correct solution.

Modules
#	Module	Status
I	Social matchmaking: the user describes a problem, and the system finds similar cases and proposes ready innovations	Mandatory
II	Knowledge store (Zasobnik wiedzy): Małopolska challenges (from the Map and reports), the Library of Social Innovations (ideally with video), and educational materials. It must be easy to update. It also aggregates needs into trends, visible to admins only.	Optional
III	Idea creator: an always-available idea card (essence, target group, stage). During grant calls there is also a time-limited application generator, tailored to each call. It also offers the Social Innovation Canvases. An AI assistant that helps develop the idea and visualises it is nice to have.	Optional
IV	Innovation tester: sign up for tests, rate solutions, give feedback, suggest improvements	Optional
V	Active communication platform: dialogue between ROPS and users, mentor support, cross-sector partnerships	Optional
VI	Admin panel: edit, verify and publish knowledge	Optional
VII	Innovation Middleman (AI assistant): adapts an innovation into a service form for the submitting institution	Optional
Users
Residents and NGOs
Local governments (JST), who treat it as a catalogue of solutions
ROPS staff, as admins and coordinators
Industry experts and mentors
Scoring
Each criterion is scored 1–10, and the final score is the weighted average. A team needs at least 50% of the maximum to become a laureate.

Weight	Criterion
40%	Challenge fulfilment. Matchmaking is worth 10%, and each extra module adds 5%.
20%	Implementation potential: scalable, cost-effective, easy to maintain
20%	Accessibility and intuitiveness: WCAG 2.1 AA, usable by seniors and people with disabilities
10%	Interface appeal and creativity
10%	Quality of the submitted materials and MVP
The organizers will specifically test:

whether a non-technical resident can use the modules
how fast the admin is notified of a new idea and how the reply path to the author works
how accurate the keyword matching is
whether the tool creates a new quality or only re-integrates existing features
Deliverables
These go on the HackTribe platform (hackyeah2026.hacktribe.co), in Polish:

Project title, team ID and description
PDF presentation of at most 10 slides
MP4 video of at most 3 minutes
Working demo link and UX/UI mockups (at minimum)
Estimated running and maintenance cost, with the resources needed
Optional: screenshots, code repository, graphics
Technical requirements
WCAG 2.1 AA
Scalable to region-wide data and many concurrent users
Integration-ready, for example with the grant database
Automated notifications about new ideas and changes to calls
Data security
No real personal or sensitive data from the ROPS materials
Logistics and rules
Deadline: 4 Oct 2026, 11:00 (it started 3 Oct at 11:00). Late submissions are not assessed.
On-site only, at Tauron Arena in Kraków. Teams of up to 6 people, who must be adults.
The jury presentation is in Polish. Results are announced around 17:45 on 4 Oct.
Prizes: 6,000 / 5,000 / 4,000 PLN for 1st / 2nd / 3rd, with 10% flat income tax withheld.
IP: winners must sign a copyright transfer agreement before any prize is paid.
Full economic rights go to Proidea, and the source code must be handed over.
A zip of the work is due within 24 hours of signing.
Winners waive their moral rights, so authorship credit may be dropped.
The work must be original and unencumbered by third-party rights, so be careful with third-party code and assets.
Any contract refusal forfeits the prize.
Challenge Map (44 pages)
It covers eight areas, each with a definition, data analysis, key challenges, a persona and report links:

Foster care and family
Homelessness
Disability
Poverty
Integration of foreigners
Health
Mental health
Seniors
The statistics are national, not Małopolska-specific. I skimmed the first areas and read the others only partly. These areas and personas make good seed data for the matchmaking demo.

Implications for the project
Matchmaking quality and accessibility carry the most weight.
Every extra module is worth +5%, so a thin but working version of several modules beats one deep module.
A visible admin notification and reply flow is explicitly tested.
Because the contract takes all source code and IP, avoid copyleft and unlicensed dependencies.
Do you want me to compare this against .doc/use-cases.md and the backend model, or turn the criteria into a prioritized build checklist?



Delivering all 7 modules gets you the full 40%.

The numbers add up that way. Matchmaking is 10%, and there are six other modules (II–VII) at 5% each:

10% + 6 × 5% = 40%

Module	Share of the 40%
I. Social matchmaking (mandatory)	10%
II. Knowledge store	5%
III. Idea creator	5%
IV. Innovation tester	5%
V. Active communication platform	5%
VI. Admin panel	5%
VII. Innovation Middleman (AI)	5%
The documents don't say exactly how this is scored, so this is my reading:

Quality counts, not just presence. The wording is "the quality of how the key elements work and the number of additional features delivered." A broken or mocked-up module probably earns only part of its 5%.
The 10% and 5% figures look like a guide. Each submission is scored 1–10 on this criterion, and the jury then applies the 40% weight. The exact conversion isn't spelled out, so the module count is an inference. I'm confident about the direction, but not about exact point values.
Matchmaking alone isn't enough. It has to be done very well, and a weak version would put the whole criterion at risk.
The module descriptions are the definition of "done." For example, the knowledge store needs the admin-only trend aggregation, and the idea creator needs the idea card. The time-limited grant application generator and the AI assistant are also described there, but the text frames the assistant as "nice to have."
Six hours or less of effort per module won't be realistic for all seven in 24 hours. A reasonable plan is a polished matchmaking module plus thin but working versions of the cheap modules. The admin panel, knowledge store and idea card are probably the cheapest. The AI-heavy ones, the Middleman and the creator's assistant, are the most expensive.

I can map the seven modules against your existing data model and use cases to show which are already covered, if you'd like.