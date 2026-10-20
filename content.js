/* =====================================================================
   CONTENT OF THE PORTFOLIO — this is the only file you need to edit.
   ---------------------------------------------------------------------
   • Every text has an English (en) and a French (fr) version.
   • Keep the quotes "..." and the commas at the end of lines.
   • To add a project: copy one whole block { ... }, from "id:" to its
     closing "},", paste it, then change the text. Full guide in
     HOW-TO-UPDATE.md.
   • After saving, open index.html to check. If the page looks empty,
     a quote or comma is missing near the line you just changed.
   ===================================================================== */

window.SITE = {

  /* ---------- 1. PROFILE (top of the page) ---------- */
  profile: {
    firstName: "Sarah",
    lastName:  "Al Ayass",
    role:      { en: "AI Engineer / Data Scientist", fr: "Ingénieure IA / Data Scientist" },
    badge:     { en: "Open to a 2-year alternance · from July 2027",
                 fr: "Ouverte à une alternance de 2 ans · dès juillet 2027" },
    intro:     { en: "AI & Data student at Aivancity (Paris). I build full-stack, AI-powered products — on-premise LLM assistants, RAG systems and data dashboards — and turn complex problems into tools people actually use.",
                 fr: "Étudiante en IA & Data à Aivancity (Paris). Je conçois des produits full-stack intégrant l’IA — assistants LLM on-premise, systèmes RAG et tableaux de bord data — pour transformer des problèmes complexes en outils réellement utilisés." },
    email:     "sarahayass1012@gmail.com",
    linkedin:  "https://www.linkedin.com/in/sarah-al-ayass/",
    github:    "",   // optional: paste your GitHub profile link to show a GitHub button
    cv:        { en: "cv/Sarah_Al_Ayass_CV_EN.pdf", fr: "cv/Sarah_Al_Ayass_CV_FR.pdf" },
    city:      "Paris",
  },

  /* ---------- 2. KEY FACTS (the 4 boxes under your name) ---------- */
  facts: [
    { big: { en: "RAG",  fr: "RAG" },  text: { en: "compliance engine checking AI-generated text against GDPR, the AI Act & CCPA", fr: "moteur de conformité vérifiant les textes générés par IA (RGPD, AI Act, CCPA)" } },
    { big: { en: "Full-stack", fr: "Full-stack" }, text: { en: "AI products built end to end, from data to interface", fr: "produits IA conçus de bout en bout, de la donnée à l’interface" } },
    { big: { en: "20+",  fr: "20+" },  text: { en: "colleagues I trained in generative AI at Touch", fr: "collaborateurs que j’ai formés à l’IA générative chez Touch" } },
    { big: { en: "3",    fr: "3" },    text: { en: "languages: Arabic, French, English", fr: "langues : arabe, français, anglais" } },
  ],

  /* ---------- 3. PROJECTS (shown in this order) ----------
     icon:   used only when a project has no image yet. Choose one of:
             screen, music, bus, shield, art, chart, ball, brain, code
     images: put the files in assets/projects/ and list them here.
             The first image is the card cover; the others appear in the pop-up.
     links:  leave "" to hide a button. screen = full-size screen,
             report = a PDF in reports/, code = a GitHub link.
     team:   leave "" for solo work. When filled, the pop-up says
             "What we built" instead of "What I did".              */
  projects: [
  {
    id: "touch",
    label: { en: "Touch · MTC Lebanon", fr: "Touch · MTC Liban" },
    icon: "screen",
    images: ["assets/projects/touch-1.png"],
    tools: ["React PWA", "FastAPI", "PostgreSQL", "Ollama (local LLM)", "Agile"],
    links: { screen: "mockups/touch-mtc.html", report: "", code: "" },
    en: {
      title:   "MTC Portal & On-Prem AI Assistant",
      date:    "Internship · Aug 2026 · Beirut",
      team:    "",
      summary: "Internal web portal for operations teams, plus an AI assistant kept fully inside the company network to meet strict telecom data-privacy rules.",
      context: "Touch (MTC Lebanon) is a telecom operator with strict data-privacy requirements: nothing sensitive can leave the company network. The IT department needed an internal portal for operations teams and a way to use AI without sending data to external services.",
      did: [
        "Built MTC Portal, a full-stack internal web app: React PWA frontend, FastAPI (Python) backend and PostgreSQL database.",
        "Developed an on-premise AI assistant that runs a local LLM through Ollama, so all data stays inside the network.",
        "Worked in Agile sprints; diagnosed and fixed deployment and PWA issues.",
        "Designed and delivered a generative AI training for 20+ IT staff.",
      ],
      result:  "Delivered the core modules and a handoff document so the IT team can complete server integration and run the portal internally.",
    },
    fr: {
      title:   "MTC Portal & assistant IA on-premise",
      date:    "Stage · août 2026 · Beyrouth",
      team:    "",
      summary: "Portail web interne pour les équipes opérationnelles, et assistant IA hébergé entièrement sur le réseau de l’entreprise pour respecter la confidentialité télécom.",
      context: "Touch (MTC Liban) est un opérateur télécom aux exigences de confidentialité strictes : aucune donnée sensible ne doit quitter le réseau. Le département IT avait besoin d’un portail interne pour les équipes opérationnelles et d’un moyen d’utiliser l’IA sans envoyer de données à des services externes.",
      did: [
        "Conception de MTC Portal, application web interne full-stack : front React PWA, back FastAPI (Python) et base PostgreSQL.",
        "Développement d’un assistant IA on-premise utilisant un LLM local via Ollama, pour que toutes les données restent sur le réseau.",
        "Travail en sprints Agile ; correction de bugs de déploiement et de PWA.",
        "Conception et animation d’une formation à l’IA générative pour plus de 20 collaborateurs IT.",
      ],
      result:  "Livraison des modules principaux et d’un document de passation pour permettre à l’équipe IT de finaliser l’intégration serveur et d’exploiter le portail en interne.",
    },
  },
  {
    id: "lyrflow",
    demo: "animated",   // "animated" = watch-only demo; leave out for clickable demos
    label: { en: "Alttrust", fr: "Alttrust" },
    icon: "music",
    images: ["assets/projects/lyrflow-1.png", "assets/projects/lyrflow-2.png"],
    tools: ["Supabase", "Railway", "UI/UX", "Testing"],
    links: { screen: "mockups/lyrflow.html", report: "", code: "" },
    en: {
      title:   "LyrFlow",
      date:    "Platform development · May – Jul 2026",
      team:    "",
      summary: "Karaoke and language-learning platform built on time-synced lyrics. Worked on UI/UX, core features, testing and performance.",
      context: "LyrFlow helps people learn languages through music: users sing along to time-synced lyrics with translation and pronunciation support.",
      did: [
        "Contributed to building the platform and its core features.",
        "Worked on UI/UX design, project organisation and user-experience optimisation.",
        "Debugged, tested and improved performance and functionality (Supabase, Railway).",
      ],
      result:  "A working web platform combining synced lyrics, translation and pronunciation into one learning experience.",
    },
    fr: {
      title:   "LyrFlow",
      date:    "Développement de plateforme · mai – juil. 2026",
      team:    "",
      summary: "Plateforme de karaoké et d’apprentissage des langues basée sur des paroles synchronisées. Travail sur l’UI/UX, les fonctionnalités, les tests et les performances.",
      context: "LyrFlow aide à apprendre les langues par la musique : l’utilisateur chante sur des paroles synchronisées, avec traduction et aide à la prononciation.",
      did: [
        "Participation à la création de la plateforme et de ses fonctionnalités clés.",
        "Travail sur le design UI/UX, l’organisation du projet et l’optimisation de l’expérience utilisateur.",
        "Débogage, tests et amélioration des performances et fonctionnalités (Supabase, Railway).",
      ],
      result:  "Une plateforme web fonctionnelle réunissant paroles synchronisées, traduction et prononciation dans une même expérience d’apprentissage.",
    },
  },
  {
    id: "sst",
    label: { en: "In progress", fr: "En cours" },
    icon: "bus",
    images: ["assets/projects/sst-1.png"],
    tools: ["Product design", "Role-based dashboards", "GPS tracking", "Payments", "Mobile-first"],
    links: { screen: "mockups/sst.html", report: "", code: "" },
    en: {
      title:   "SST SchoolRoute",
      date:    "Personal project · web & mobile · 2026 – present",
      team:    "",
      summary: "School-transport platform with role-based dashboards for parents, drivers and administrators, GPS tracking, messaging and cashless payments.",
      context: "School transport is often managed by phone calls and paper. SST SchoolRoute brings parents, drivers, school staff and administrators onto one platform, so everyone knows where the bus is and what is happening.",
      did: [
        "Designed the product as founder and solo developer: role-based dashboards for administrators, parents, drivers and school staff.",
        "Built a mobile-first interactive prototype covering all four role views.",
        "Planned GPS tracking, messaging and cashless payments.",
        "Produced the pitch deck and an animated, interactive product demo for school clients.",
      ],
      result:  "Prototype and client materials ready; next step is a pilot with a school.",
    },
    fr: {
      title:   "SST SchoolRoute",
      date:    "Projet personnel · web & mobile · 2026 – aujourd’hui",
      team:    "",
      summary: "Plateforme de transport scolaire avec tableaux de bord par rôle (parents, chauffeurs, administrateurs), suivi GPS, messagerie et paiements sans espèces.",
      context: "Le transport scolaire est souvent géré par téléphone et sur papier. SST SchoolRoute réunit parents, chauffeurs, personnel scolaire et administrateurs sur une seule plateforme, pour que chacun sache où est le bus et ce qui se passe.",
      did: [
        "Conception du produit en tant que fondatrice et développeuse : tableaux de bord par rôle pour administrateurs, parents, chauffeurs et personnel scolaire.",
        "Création d’un prototype interactif mobile-first couvrant les quatre rôles.",
        "Conception du suivi GPS, de la messagerie et des paiements sans espèces.",
        "Réalisation du pitch deck et d’une démo produit animée et interactive pour les écoles.",
      ],
      result:  "Prototype et supports clients prêts ; prochaine étape : un pilote avec une école.",
    },
  },
  {
    id: "compliance",
    label: { en: "Aivancity × Pangea Summit", fr: "Aivancity × Pangea Summit" },
    icon: "shield",
    images: ["assets/projects/compliance-1.png"],
    tools: ["RAG", "BGE-M3", "ChromaDB", "DeepSeek-R1", "Django", "GDPR / AI Act / CCPA"],
    links: { screen: "mockups/compliance.html", report: "", code: "" },
    en: {
      title:   "AI Compliance Platform",
      date:    "AI Clinic · school × company project · Sep 2025 – Jan 2026",
      team:    "Team of 4",
      summary: "Compliance checker for PangeaGTM, Pangea Summit’s generative-AI messaging tool: a RAG pipeline that checks AI-generated text against GDPR, the EU AI Act and CCPA, and explains each violation.",
      context: "Pangea Summit’s PangeaGTM app uses an LLM to write personalised B2B messages for clients in several markets. Generated text can break data-protection or AI rules without anyone noticing. In Aivancity’s AI Clinic, our team built a tool that checks content before it is sent, while keeping a human in charge of the final decision.",
      did: [
        "Split GDPR, the AI Act and CCPA into articles and paragraphs, embedded them with BGE-M3 and stored them in a persistent ChromaDB collection with legal metadata (regulation, article, paragraph).",
        "Built the RAG flow: the text is embedded, the closest rules are retrieved, and DeepSeek-R1 (through the Hugging Face router) assesses compliance against them.",
        "Prompt-engineered the model to act as a compliance expert, then parsed its answer into structured findings: rule, regulation, severity and justification.",
        "Kept rules the user excluded running in the background, so critical violations are still flagged, and computed an overall compliance score.",
        "Built the Django interface in two parts: rule search (to frame the generator) and AI analysis (to check its output).",
      ],
      result:  "A working prototype that retrieves relevant rules from all three regulations and returns graded, explained violations. Proposed next steps: smarter chunking, fine-tuning for classification, quality metrics and automatic regeneration.",
    },
    fr: {
      title:   "Plateforme de conformité IA",
      date:    "Clinique de l’IA · projet école × entreprise · sept. 2025 – janv. 2026",
      team:    "Équipe de 4",
      summary: "Contrôle de conformité pour PangeaGTM, l’outil de génération de messages par IA de Pangea Summit : un pipeline RAG qui vérifie les textes générés au regard du RGPD, de l’AI Act et du CCPA, et explique chaque infraction.",
      context: "L’application PangeaGTM de Pangea Summit utilise un LLM pour rédiger des messages B2B personnalisés pour des clients sur plusieurs marchés. Un texte généré peut enfreindre des règles de protection des données ou d’IA sans que personne ne s’en aperçoive. Dans le cadre de la Clinique de l’IA d’Aivancity, notre équipe a conçu un outil qui vérifie les contenus avant leur envoi, en laissant la décision finale à l’humain.",
      did: [
        "Découpage du RGPD, de l’AI Act et du CCPA par article et alinéa, vectorisation avec BGE-M3 et stockage dans une collection ChromaDB persistante avec métadonnées juridiques (réglementation, article, alinéa).",
        "Mise en place du flux RAG : le texte est vectorisé, les règles les plus proches sont récupérées, puis DeepSeek-R1 (via le routeur Hugging Face) évalue la conformité.",
        "Prompt engineering pour placer le modèle en posture d’expert conformité, puis structuration de sa réponse en infractions : règle, réglementation, gravité et justification.",
        "Conservation en arrière-plan des règles exclues par l’utilisateur, pour signaler quand même les infractions critiques, et calcul d’un score de conformité global.",
        "Interface Django en deux parties : recherche de règles (pour cadrer la génération) et analyse IA (pour vérifier le résultat).",
      ],
      result:  "Un prototype fonctionnel qui récupère les règles pertinentes des trois réglementations et renvoie des infractions graduées et expliquées. Pistes proposées : meilleur découpage, fine-tuning pour la classification, métriques de contrôle et régénération automatique.",
    },
  },
  {
    id: "art",
    label: { en: "Aivancity × Marchands d’Art", fr: "Aivancity × Marchands d’Art" },
    icon: "art",
    images: ["assets/projects/art-1.png"],
    tools: ["XGBoost", "scikit-learn", "LSTM", "Autoencoder", "Clustering", "SQLite", "NLP"],
    links: { screen: "mockups/artmarket.html", report: "", code: "" },
    en: {
      title:   "Art Market Decision Intelligence",
      date:    "School × company project · Jan – Apr 2026",
      team:    "Team of 5",
      summary: "Reproduced and beat a Nature study’s art-price model (R² 0.71 → 0.89 with XGBoost), then added trend detection and automated media monitoring for Marchands d’Art.",
      context: "A 2024 Nature study (Lee et al.) showed that social signals, such as artist reputation, sales history and institutional prestige, explain 73% of contemporary art price variation, against 5.5% for visual features. With Marchands d’Art, our team set out to reproduce that model and go beyond price prediction to spot emerging trends.",
      did: [
        "Prepared three CSV datasets: 34,200 auction sales with about 41 social, demographic and market variables, split into established and emerging markets.",
        "Rebuilt the XGBoost price model and tuned it with a two-phase RandomizedSearchCV (30 combinations with cv=3, then 25 with cv=5).",
        "Built SmartSearch, a fuzzy artist-name matcher using Levenshtein distance, n-grams, Unicode normalisation and aliases (“Baskiat” → Basquiat).",
        "Prototyped market-intelligence models: an autoencoder for weak signals, an LSTM for trends and clustering for market segments.",
        "Built a Google News monitoring system: 684 articles scored on relevance, source reliability, recency and sentiment, stored in SQLite, aggregated daily to detect hype signals and exported as model features.",
      ],
      result:  "R² of 0.8885 on the test set, against 0.71 in the original study, and RMSE down 4.75% to about $380, plus a media-attention pipeline that feeds new variables into the price model.",
    },
    fr: {
      title:   "Intelligence décisionnelle — marché de l’art",
      date:    "Projet école × entreprise · janv. – avr. 2026",
      team:    "Équipe de 5",
      summary: "Reproduction et amélioration du modèle de prix d’une étude publiée dans Nature (R² 0,71 → 0,89 avec XGBoost), complétées par la détection de tendances et une veille médiatique automatisée pour Marchands d’Art.",
      context: "Une étude publiée dans Nature en 2024 (Lee et al.) montre que les signaux sociaux (réputation de l’artiste, historique des ventes, prestige des institutions) expliquent 73 % de la variation des prix de l’art contemporain, contre 5,5 % pour les caractéristiques visuelles. Avec Marchands d’Art, notre équipe a voulu reproduire ce modèle et aller au-delà de la prédiction de prix pour repérer les tendances émergentes.",
      did: [
        "Préparation de trois jeux de données CSV : 34 200 ventes aux enchères et environ 41 variables sociales, démographiques et de marché, réparties entre marchés établis et émergents.",
        "Recréation du modèle de prix XGBoost et optimisation par RandomizedSearchCV en deux phases (30 combinaisons avec cv=3, puis 25 avec cv=5).",
        "Développement de SmartSearch, un moteur de reconnaissance des noms d’artistes (distance de Levenshtein, n-grammes, normalisation Unicode, alias : « Baskiat » → Basquiat).",
        "Prototypes d’intelligence de marché : autoencoder pour les signaux faibles, LSTM pour les tendances et clustering pour la segmentation.",
        "Système de veille Google Actualités : 684 articles notés selon la pertinence, la fiabilité de la source, la récence et le sentiment, stockés dans SQLite, agrégés par jour pour détecter les pics d’attention et exportés comme variables pour le modèle.",
      ],
      result:  "Un R² de 0,8885 sur le jeu de test, contre 0,71 dans l’étude de référence, et un RMSE en baisse de 4,75 % (environ 380 $), ainsi qu’un pipeline de veille médiatique qui alimente le modèle de prix en nouvelles variables.",
    },
  },
  {
    id: "egerine",
    label: { en: "Aivancity × Égérine", fr: "Aivancity × Égérine" },
    icon: "chart",
    images: ["assets/projects/egerine-1.png"],
    tools: ["Python", "Power BI", "Data analysis"],
    links: { screen: "mockups/egerine.html", report: "", code: "" },
    en: {
      title:   "AI Advertising Dashboard",
      date:    "School × company project · Jan – Apr 2025",
      team:    "",
      summary: "Data dashboard to optimise advertising spend, improving ROI visibility and supporting budget decisions.",
      context: "Égérine needed a clearer view of which advertising spend actually paid off.",
      did: [
        "Cleaned and analysed advertising data in Python.",
        "Built an interactive Power BI dashboard tracking spend and return on investment.",
      ],
      result:  "Better ROI visibility to support budget decisions.",
    },
    fr: {
      title:   "Dashboard Publicité IA",
      date:    "Projet école × entreprise · janv. – avr. 2025",
      team:    "",
      summary: "Tableau de bord pour optimiser les investissements publicitaires, améliorer le suivi du ROI et guider les décisions budgétaires.",
      context: "Égérine avait besoin d’une vision plus claire de la rentabilité de ses dépenses publicitaires.",
      did: [
        "Nettoyage et analyse des données publicitaires en Python.",
        "Création d’un tableau de bord Power BI interactif pour suivre les dépenses et le retour sur investissement.",
      ],
      result:  "Un meilleur suivi du ROI pour guider les décisions budgétaires.",
    },
  },
  {
    id: "sports",
    label: { en: "Aivancity", fr: "Aivancity" },
    icon: "ball",
    images: ["assets/projects/sports-1.png"],
    tools: ["Python", "Pandas", "Power BI", "Power Query", "Excel", "CRISP-DM"],
    links: { screen: "mockups/transfers.html", report: "", code: "" },
    en: {
      title:   "Football Transfer Analysis",
      date:    "School project · Sep – Dec 2024",
      team:    "Team of 4 · I led the goalkeeper analysis",
      summary: "Evaluated player transfers in the Premier League, La Liga, Serie A and Bundesliga (2017–2022) to find which indicators show whether a transfer worked. I led the goalkeeper analysis.",
      context: "Transfers are huge investments (the global market was worth about €6.5 billion in 2022), yet many fail. Simulating a mission for a sports-management consultancy, our team asked two questions: how should clubs evaluate a transfer, and which indicators matter most after a player moves?",
      did: [
        "Followed the CRISP-DM method, from business understanding to deployment.",
        "Cleaned and merged Kaggle and FBref datasets in Python (Pandas): duplicates, missing values, and filtering to the four leagues and the 2017–2022 seasons.",
        "Owned the goalkeeper position: chose the KPIs (goals conceded, penalties and free kicks saved, successful long clearances, crosses stopped) and built the goalkeeper page.",
        "Built an interactive Power BI dashboard (Power Query merges; slicers by league, club, position and player) covering team stats, transfer fees and before/after performance.",
        "Wrote case studies on Alisson Becker (€62.5m, Roma → Liverpool) and Timo Werner (€53m, Leipzig → Chelsea).",
      ],
      result:  "After Alisson arrived, Liverpool went from 38 to 22 goals conceded and from 75 to 97 points, a successful transfer, while Werner’s league goals fell from 28 to 6. We recommended judging transfers by position and by their impact on the team, while noting what data can’t capture: adaptation, the coach and the dressing room.",
    },
    fr: {
      title:   "Analyse des transferts de football",
      date:    "Projet école · sept. – déc. 2024",
      team:    "Équipe de 4 · responsable de l’analyse des gardiens",
      summary: "Évaluation des transferts de joueurs en Premier League, Liga, Serie A et Bundesliga (2017–2022) pour identifier les indicateurs qui montrent si un transfert a réussi. J’ai pris en charge l’analyse des gardiens.",
      context: "Les transferts représentent des investissements colossaux (environ 6,5 milliards d’euros sur le marché mondial en 2022), mais beaucoup échouent. Dans une simulation de mission pour un cabinet de conseil en gestion sportive, notre équipe s’est posé deux questions : comment évaluer un transfert, et quels indicateurs suivre en priorité après l’arrivée d’un joueur ?",
      did: [
        "Application de la méthode CRISP-DM, de la compréhension du domaine au déploiement.",
        "Nettoyage et fusion de données Kaggle et FBref en Python (Pandas) : doublons, valeurs manquantes, filtrage sur les quatre championnats et les saisons 2017–2022.",
        "Responsable du poste de gardien : choix des KPI (buts encaissés, penaltys et coups francs arrêtés, dégagements longs réussis, centres captés) et création de la page gardiens.",
        "Tableau de bord Power BI interactif (fusions Power Query ; filtres par ligue, club, poste et joueur) : statistiques d’équipe, frais de transfert et performances avant/après.",
        "Études de cas : Alisson Becker (62,5 M€, Roma → Liverpool) et Timo Werner (53 M€, Leipzig → Chelsea).",
      ],
      result:  "Après l’arrivée d’Alisson, Liverpool est passé de 38 à 22 buts encaissés et de 75 à 97 points : un transfert réussi. À l’inverse, Werner est passé de 28 à 6 buts en championnat. Nous avons recommandé d’évaluer les transferts par poste et selon leur impact sur l’équipe, en gardant en tête ce que les données ne mesurent pas : adaptation, entraîneur, vestiaire.",
    },
  },
  ],

  /* ---------- 4. EXPERIENCE & EDUCATION (newest first) ---------- */
  experience: [
    { when: { en: "2027 – 2029", fr: "2027 – 2029" },
      title: { en: "Master’s in AI & Data Science — work-study", fr: "Diplôme d’études supérieures en IA & Science des données (grade de Master) — en alternance" },
      place: { en: "Aivancity School of AI & Data for Business & Society · Paris-Villejuif", fr: "Aivancity School of AI & Data for Business & Society · Paris-Villejuif" },
      points: [] },
    { when: { en: "Aug 2026", fr: "août 2026" },
      title: { en: "AI & Full-Stack Developer Intern", fr: "Stagiaire Développeuse IA & Full-Stack" },
      place: { en: "Touch (MTC Lebanon) — IT Department, Beirut", fr: "Touch (MTC Liban) — Département IT, Beyrouth" },
      points: [
        { en: "Built MTC Portal (React PWA, FastAPI, PostgreSQL) and an on-premise AI assistant.", fr: "Conception de MTC Portal (React PWA, FastAPI, PostgreSQL) et d’un assistant IA on-premise." },
        { en: "Designed and delivered a generative AI training for 20+ IT staff.", fr: "Conception et animation d’une formation à l’IA générative pour plus de 20 collaborateurs IT." },
      ] },
    { when: { en: "2024 – 2027", fr: "2024 – 2027" },
      title: { en: "Bachelor in Artificial Intelligence & Data", fr: "Bachelor Intelligence Artificielle & Data" },
      place: { en: "Aivancity · Paris-Villejuif", fr: "Aivancity · Paris-Villejuif" },
      points: [
        { en: "Company projects with Pangea Summit, Marchands d’Art and Égérine.", fr: "Projets entreprise avec Pangea Summit, Marchands d’Art et Égérine." },
      ] },
    { when: { en: "2021 – 2024", fr: "2021 – 2024" },
      title: { en: "French Baccalaureate", fr: "Baccalauréat français" },
      place: { en: "Collège Carmel Saint-Joseph, Lebanon", fr: "Collège Carmel Saint-Joseph, Liban" },
      points: [] },
  ],

  /* ---------- 5. SKILLS (one box per group) ---------- */
  skills: [
    { group: { en: "AI & Data", fr: "IA & Data" },
      items: ["Machine Learning", "XGBoost", "LSTM / Autoencoders", "Clustering", "LLMs", "RAG", { en: "Semantic search", fr: "Recherche sémantique" }, { en: "Data analysis & visualisation", fr: "Analyse & visualisation de données" }] },
    { group: { en: "Development", fr: "Développement" },
      items: ["Python", "Pandas", "scikit-learn", "SQL", "JavaScript", "React", "FastAPI", "Django", "REST APIs"] },
    { group: { en: "Tools", fr: "Outils" },
      items: ["PostgreSQL", "Supabase", "ChromaDB", "Qdrant", "Ollama", "Hugging Face", "SQLite", "Jupyter", "Linux", "Power BI / Power Query", "Git"] },
    { group: { en: "Governance & Methods", fr: "Gouvernance & Méthodes" },
      items: [{ en: "GDPR", fr: "RGPD" }, "EU AI Act", "CCPA", "Agile / Scrum", "CRISP-DM"] },
    { group: { en: "Certifications", fr: "Certifications" },
      items: ["Microsoft PL-900"] },
    { group: { en: "Languages", fr: "Langues" },
      items: [{ en: "Arabic — native", fr: "Arabe — langue maternelle" }, { en: "French — fluent", fr: "Français — courant" }, { en: "English — fluent", fr: "Anglais — courant" }] },
  ],

  /* ---------- 6. QUOTE & CONTACT ---------- */
  quote: { text: { en: "“The best way to predict the future is to invent it.”", fr: "« La meilleure façon de prédire l’avenir, c’est de l’inventer. »" }, author: "Alan Kay" },
  contact: {
    title: { en: "Looking for an AI / Data alternant?", fr: "Vous cherchez une alternante IA / Data ?" },
    text:  { en: "Available from July 2027 (or September 2027) for a 2-year work-study contract alongside my Master’s in AI & Data Science at Aivancity. Based in Paris, open to remote-friendly roles.",
             fr: "Disponible dès juillet 2027 (ou septembre 2027) pour un contrat d’alternance de 2 ans, en parallèle de mon Master IA & Science des données à Aivancity. Basée à Paris, ouverte aux postes en télétravail." },
  },

  /* ---------- 7. SMALL LABELS (you rarely need to change these) ---------- */
  labels: {
    en: { projects: "Projects", experience: "Experience", skills: "Skills", contact: "Contact",
          kProjects: "Selected work", kExperience: "Path", hExperience: "Experience & Education", kSkills: "Toolkit", kContact: "Let’s work together",
          cv: "Download CV", email: "Email me", more: "Read more", context: "Context", didSolo: "What I did", didTeam: "What we built", result: "Result",
          screen: "Try the interactive demo", screenAnim: "Watch the animated demo", badge: "Interactive demo", badgeAnim: "Animated demo",
          demoNote: "Opens in a new tab: click, type and filter as if you were using it. A short guide shows what to try.", demoNoteAnim: "Opens in a new tab: an animated walkthrough of the app’s main screen.",
          projectsLead: "Every project comes with a live demo: open a card, then try it yourself.", report: "Read the report (PDF)", code: "View the code", close: "Close" },
    fr: { projects: "Projets", experience: "Parcours", skills: "Compétences", contact: "Contact",
          kProjects: "Réalisations", kExperience: "Parcours", hExperience: "Expériences & Formation", kSkills: "Boîte à outils", kContact: "Travaillons ensemble",
          cv: "Télécharger mon CV", email: "M’écrire", more: "En savoir plus", context: "Contexte", didSolo: "Ce que j’ai fait", didTeam: "Ce que nous avons réalisé", result: "Résultat",
          screen: "Tester la démo interactive", screenAnim: "Voir la démo animée", badge: "Démo interactive", badgeAnim: "Démo animée",
          demoNote: "S’ouvre dans un nouvel onglet : cliquez, tapez, filtrez comme si vous l’utilisiez. Un petit guide indique quoi essayer.", demoNoteAnim: "S’ouvre dans un nouvel onglet : une démonstration animée de l’écran principal.",
          projectsLead: "Chaque projet a sa démo en ligne : ouvrez une carte, puis essayez par vous-même.", report: "Lire le rapport (PDF)", code: "Voir le code", close: "Fermer" },
  },
};
