
Many grassroots initiatives (NGOs, local government units (JST), Social Services Centres, residents) solve local problems.
They have no shared place to diagnose problems, develop ideas, test innovations, spread proven solutions and build partnerships.
So good micro-solutions don't scale, and the same problems get solved again and again.




1. matches reported social problems to existing innovations,
2. lets people submit new ideas,
3. manages ROPS knowledge,
4. connects residents, local governments, NGOs and experts.


Domain: social policy and social innovation. The Social Challenges Map (PRESENTATION.MD) covers 8 areas:
foster care and family
homelessness
disability
poverty
integration of foreigners
health
mental health
seniors



Residents and NGOs	Report a problem or idea through a simple interface with clear status and communication

JST (local governments)	A catalogue of ready solutions they can implement, plus a way to report local challenges

ROPS staff (admins)	An admin panel to publish knowledge, monitor submissions and talk to users


find similar cases and information,
propose ready solutions and innovations.
It is judged on keyword-based relevance










SOCIAL MATCHMAKING MODULE

- Free-text input. The user describes the problem in their own words, not by picking a category.
- Ready solutions. The system returns matching innovation cards from the Social Innovation Library.


The jury tests it this way (§6): "Czy narzędzie skutecznie sugeruje istniejące innowacje na podstawie słów kluczowych wpisanych w opisie potrzeb użytkownika?" That is, do the right innovations come up from the keywords in the description. Relevance is judged on the quality of the top results.



new REQUIRMETNS 
- This beats Google-style keyword matching on vague descriptions.
- Show why each card matched (KEYWORDS)
- HANDLE THE TYPOS. colloquial wording and short phrases.
- SHOW INOVATION CARD TO THE RETURN 
- IDENTIFY THE CATEGORY CORRECTLY : 9 categories: seniors, children/youth/family, limited mobility, sensory disability, health, labour market, foreigners, homelessness, intellectual disability
- ONLY POLISH SEARCH AND POLISH LANGUAGE ONLY . No other language support.
- UNDERSTAND THE PARAPHRASINGS AND SYNONIMS 
- WE CANT USE THE LLM 
- WE DONT WRITE THE SYNONIMS BY OUR OWN BECASUE CARDS ARE REGULARY ADDED.
- IT MUST UNDERSTAND THE POLISH SYMBOLS ("Ł" IS THE SAME AS TEH "L")
- algorithm must be relatively fast and not heavy. 
- some of the innovation cards can be added so the search must be adapted instatly even if the card is updated with different text 
- easy deploy on the azure. 
- scalable 
- minimum cost for the resources 
- minimum cost, 0$ 



- HOW EFFICIENT IS THAT FOR HTE SERVER SEARCH THIS ALGORITHM? 
- HOW IS THAT DEPLOYABLE FOR THE AZURE, IS THERE NO PROBELM FOR THE ONNX RUNTIME IN .NET FOR HTE 
- WHAT FUNCTIONALITY OF THE CURRENT ALGORITHM SHOULD BE REMOVED 
- WHAT THE CURRENT ALGORITHM SHOULD BE EXTENDED
- WOULD IT COVER ALL THE REQUIRMETNS ?
- 