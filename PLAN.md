# ToolFlip — Masterplan NL ZZP-Rekentools

> **Status: FASE 0 — wacht op toolflip.nl domeinaankoop (Jasper, gestart 13 juni 2026)**
> Laatste update: 13 juni 2026, door Claude na twee deep-research-rondes.
> Lees dit document volledig voordat je verder bouwt. Alles wat besloten is staat hier, inclusief waarom.

---

## 1. TL;DR voor wie dit later leest

We pivoteren van Engelse dev-tools (toolflip.dev, live, blijft bestaan) naar **Nederlandstalige ZZP/geld-rekentools op toolflip.nl**, gemonetiseerd via **affiliate (€25–100 per lead)** in plaats van AdSense. Budget: **€200**. De stack blijft identiek: Astro + React + Tailwind 4 op Vercel.

Eerste mijlpaal: 8 kern-calculators + 50 programmatic "uurtarief per beroep"-pagina's, daarna Bing Ads-validatietest van de affiliate-funnel vóórdat we maanden in SEO investeren.

---

## 2. Waarom deze pivot (beslissingslog)

### 2.1 Wat er al ligt (niet weggooien)
- **toolflip.dev** is live op Vercel met 14 werkende Engelse dev-tools (CSV→JSON, JSON formatter, Base64, YAML→JSON, CSS gradient, box shadow, color contrast, SVG optimizer, SVG→PNG, favicon generator, character counter, text case, slug generator, line sorter).
- Volledige SEO-setup: JSON-LD (WebSite, WebApplication, BreadcrumbList, FAQPage), og:image, sitemap, interne links, centrale tooldata in `src/data/tools.ts`.
- Playwright-smoketests: `test-tools.mjs`, `test-thorough.mjs`, `test-new-tools.mjs`.
- **Beslissing: laten staan, kost niks, dient als portfolio. Geen tijd meer in investeren.**

### 2.2 Waarom EN dev-tools kansloos zijn als geldmaker (research 12-13 juni 2026)
1. Top-10 voor "csv to json" etc. = convertcsv.com, csvjson.com, jsonformatter.org, GeeksforGeeks, jam.dev (gratis én ad-vrij, VC-gefinancierd). Decennium aan autoriteit.
2. Gartner: traditioneel zoekverkeer −25% in 2026 door AI-antwoorden. Developers zijn de zwaarste AI-gebruikers; die plakken hun CSV in ChatGPT, niet in een website.
3. AdSense-model voor utility-sites kalft af; CPM's dalen.

### 2.3 Alternatieven onderzocht en afgewezen (research 13 juni 2026)
| Optie | Oordeel | Reden |
|---|---|---|
| AI-wrapper SaaS | ❌ NIET DOEN | 90% faalt eind 2026, 60–70% nul omzet, marges 25–35% |
| Notion-templates/themes | ❌ | Crowded, marketingspel, mediaan ≈ €0 |
| Nieuwsbrief | ❌ | 1.000 subs → $20–160/mnd; audience-opbouw duurt jaren |
| Generieke micro-SaaS | ❌ als eerste project | 70% < $1k/mnd; 12–18 mnd tot signaal; distributie-bottleneck |
| AI token-calculators | ❌ | Al tientallen spelers (artificialanalysis.ai etc.) |
| CV/sollicitatiebrief AI NL | ❌ | Enhancv, LiveCareer, cv.nl, cvster.nl al gelokaliseerd |
| Lokale lead-gen (dakdekkers) | ⏸️ later misschien | Leads waardevol maar broker-markt vol, lange lokale SEO-grind |
| Roblox creator-tools | ⏸️ hobby later | Jaspers expertise + 2026 API-expansie, maar platformrisico + RoMonitor/RoWatcher/BloxMetrics bestaan al |
| NL B2B-directory | ⏸️ fase 4 | Goede uitbreiding ZODRA de rekentools-site traffic heeft (dubbele monetisatie: listings + leads) |
| Chrome-extensie | ✅ parallel experiment | Enige optie met ingebouwde distributie (Web Store); $5 fee; weekend werk; asymmetrische kans |
| **NL ZZP-rekentools** | ✅✅ **HOOFDPROJECT** | Zie 2.4 |

### 2.4 Bewijs dat NL ZZP-rekentools werkt
1. **Kleine nieuwe sites ranken er al**: tooliq.nl, rekenbuddy.nl, mijnzzptools.nl staan in de top-10 voor "uurtarief zzp berekenen". Geen onneembare autoriteit zoals bij EN-tools.
2. **mijnzzptools.nl als bewijs van het model**: 15 tools + 33 "uurtarief per beroep"-pagina's (programmatic SEO), claimt ~12.800 berekeningen/maand — en heeft GEEN zichtbare monetisatie. Er ligt geld op tafel.
3. **Affiliate betaalt serieus**:
   - e-Boekhouden.nl: tot **€60 per goedgekeurde lead** (eigen programma, gratis aanmelden via e-boekhouden.nl/affiliate)
   - Daisycon: finance-leads €25–100, zorgverzekering ~€22,50/overstap, gratis white-label vergelijkers (energie/telecom) om te embedden
   - TradeTracker: 2.300+ NL-campagnes, lage drempel — MAAR: betalingsproblemen gemeld sept 2025, eerst status checken
4. **Commercial intent**: wie z'n uurtarief berekent heeft boekhoudsoftware, AOV en pensioen nodig. Adverteerders (Knab, Jortt, Rompslomp, Moneybird) bieden volop op deze keywords = geld in de niche.
5. **AI-bestendig**: interactieve calculators met actuele 2026-belastingregels vervangt een chatbot-antwoord niet. Jaarlijkse updates = moat (verlaten sites vallen weg).

### 2.5 Waarom toolflip.nl en niet toolflip.dev voor dit project
- SEO-technisch is .dev oké (generieke TLD), maar Google's handmatige geo-targeting is afgeschaft (2023), dus signalen moeten uit content/TLD komen.
- Doelgroep = tegelzetters en schilders, geen developers. Die vertrouwen .nl. Alle concurrenten zitten op .nl. ".dev" mondeling doorvertellen werkt niet.
- Tweede domein lost ook het taalmix-probleem op (EN en NL op één domein is SEO-rommelig).
- **toolflip.dev blijft EN dev-tools; toolflip.nl wordt de NL-site. Jasper koopt toolflip.nl bij Strato (~€10/jr).**

---

## 3. Budget: €200

| Post | Bedrag | Status | Notitie |
|---|---|---|---|
| toolflip.nl domein (Strato) | ~€10/jr | 🔄 Jasper koopt nu | DNS straks: A `@` → 76.76.21.21, CNAME `www` → cname.vercel-dns.com (zelfde als .dev) |
| Keywords Everywhere credits | ~€14 ($15, 100k credits) | ⬜ | Echte NL-zoekvolumes + CPC. Pay-once, geen abo. keywordseverywhere.com |
| Mangools KWFinder, 1 maand | ~€30 | ⬜ | SERP-moeilijkheid NL-keywords. Eén maand volstaat voor de hele keyword-map, daarna OPZEGGEN |
| Chrome Web Store dev-fee | ~€5 ($5) | ⬜ optioneel | Voor het parallel-experiment (zie §8) |
| Bing/Microsoft Ads validatietest | ~€75 | ⬜ na fase 2 | CPC fractie van Google (NL Google CPC op boekhoud-keywords is €2–8 — daar verdampt €75 in 15 klikken) |
| Reserve | ~€66 | ⬜ | Maand 2: opschalen wat werkt. NIET vooraf uitgeven |

**Niet aan uitgeven**: Ahrefs/Semrush (overkill), betaalde backlinks (penalty-risico; NL-linkbuilding kan gratis via ZZP-directories/startpagina's/gastblogs), premium templates (stack staat er al), Google Ads (te duur voor dit budget).

---

## 4. Fases

### FASE 0 — Setup (nu)
- [ ] Jasper: toolflip.nl kopen bij Strato
- [ ] DNS instellen (A-record + CNAME zoals bij .dev — zie §2.5)
- [ ] Nieuw Vercel-project of tweede domein aan bestaand project; **apart repo/project aangeraden**: `toolflip-nl`
- [ ] Jasper: e-Boekhouden affiliate aanmelden (e-boekhouden.nl/affiliate, gratis)
- [ ] Jasper: Daisycon publisher-account aanmelden (daisycon.com, gratis)
- [ ] Jasper: Google Search Console property voor toolflip.nl (TXT-record via Strato) — voor toolflip.dev staat dit ook nog open!
- [ ] Keywords Everywhere credits kopen + KWFinder maand starten

### FASE 1 — Kern-calculators (week 1–2)
Bouw 8 calculators, elk een eigen pagina met FAQ + JSON-LD (zelfde patroon als huidige ToolLayout):
1. **Uurtarief ZZP berekenen** — omgekeerd rekenen: gewenst netto/maand → benodigd uurtarief (declarabele uren, kosten, AOV, pensioen, belastingbuffer). Belangrijkste keyword van de niche.
2. **Bruto-netto ZZP** — winst → netto na zelfstandigenaftrek, MKB-winstvrijstelling, IB-schijven 2026, Zvw-bijdrage
3. **ZZP vs loondienst vergelijker** — zelfde bruto, wat houd je over
4. **BTW-calculator** — excl↔incl, 21%/9%, kwartaalreservering
5. **Belastingreserve-calculator** — hoeveel % van elke factuur opzij (meest gestelde ZZP-vraag)
6. **Zelfstandigenaftrek & aftrekposten 2026** — checklist + bedragen (LET OP: zelfstandigenaftrek wordt jaarlijks afgebouwd, cijfers verifiëren bij belastingdienst.nl)
7. **Vakantiegeld-calculator** (breder publiek, volume-trekker)
8. **Transitievergoeding-calculator** (breder publiek, volume-trekker)

Technische eisen:
- Astro + React islands, alles client-side (zelfde patroon als toolflip.dev)
- `lang="nl"`, hreflang, NL Schema.org
- **YMYL-discipline**: elke pagina onderaan bronvermelding (belastingdienst.nl, KVK) + disclaimer "geen belastingadvies" + "cijfers 2026" met datum laatst gecontroleerd
- Belastingcijfers 2026 in één centraal bestand (`src/data/belasting-2026.ts`) zodat jaarlijkse update één file is

### FASE 2 — Programmatic SEO (week 3–4)
- [ ] Keyword-map maken met Keywords Everywhere + KWFinder: alle "berekenen"-keywords scoren op volume × moeilijkheid × commerciële waarde
- [ ] 50+ "Uurtarief [beroep] 2026"-pagina's (zoals mijnzzptools maar dieper: marktconforme tariefrange per beroep, regiofactoren, voorbeeldberekening, gekoppeld aan de uurtarief-calculator met prefill)
- Data per beroep in `src/data/beroepen.ts`; één Astro-template genereert alles
- Interne linking: beroep-pagina's ↔ calculators ↔ gidsen

### FASE 3 — Monetisatie + validatie (week 5–6)
- [ ] Affiliate-integratie: e-Boekhouden + Moneybird/AOV via Daisycon. Plaatsing: contextueel ná de berekening ("Je moet €X opzij zetten — boekhoudsoftware doet dit automatisch → [vergelijking]")
- [ ] Eén "Beste boekhoudprogramma ZZP 2026"-vergelijkingspagina (het geld-keyword; concurrent: vergelijk-boekhoudprogramma.nl — bestaat en leeft ervan, dus model klopt)
- [ ] **Bing Ads-test: €75** op commerciële keywords richting de vergelijkingspagina. Meet: doorklik naar affiliates, leads. **Beslisregel: converteert het → reserve inzetten + vol op SEO. Converteert het niet → stoppen en heroverwegen, slechts €134 verloren i.p.v. 4 maanden werk.**

### FASE 4 — Groei (maand 2+, alleen na positieve validatie)
- Gratis linkbuilding: ZZP-directories, startpagina's met autoriteit, gastblog bij ZZP-blogs (linkbuildingexperts.nl heeft lijst met 200+ gratis plekken)
- Content-cluster: gidsen rond de calculators ("ZZP starten checklist 2026", "Kwartaalaangifte BTW stap voor stap")
- Directory-uitbreiding: "boekhouder per regio" of ZZP-leveranciers (listings + leads, zie §2.3)
- Energie/telecom white-label vergelijker van Daisycon embedden (zakelijke energie voor ZZP)
- Jaarlijkse update-routine: december = belastingcijfers nieuw jaar (moat!)

---

## 5. Verwachtingen (eerlijk)

- Maand 1–2: ~0 organisch verkeer. Normaal. Validatie komt uit Bing Ads, niet uit SEO.
- Maand 3–6: eerste rankings op long-tail ("uurtarief tegelzetter 2026"). Eerste affiliate-leads als de funnel klopt.
- Doel maand 6: €100+/mnd affiliate. Twee e-Boekhouden-leads per maand = €120.
- Dit is een marathon met een goedkope sprinttest ingebouwd. De €75-validatie is het belangrijkste moment van het hele plan.

---

## 6. Risico's

| Risico | Mitigatie |
|---|---|
| YMYL: Google streng op financiële content | Bronnen citeren, disclaimer, accuraat, geen advies-claims |
| Belastingcijfers verouderen | Centraal databestand, jaarlijkse update-routine december |
| TradeTracker betalingsproblemen (gemeld sept 2025) | Primair e-Boekhouden direct + Daisycon; TradeTracker eerst verifiëren |
| Concurrenten worden wakker | Snelheid + beter monetiseren dan mijnzzptools (die doet niets) |
| .nl DNS bij Strato traag | Bekend van .dev-setup: paar min tot uren, geen actie nodig |
| AI Overviews pakken ook NL-calculatorverkeer | Interactiviteit is de verdediging; monitoren in GSC |

---

## 7. Technische notities voor de volgende sessie

- Huidig repo = toolflip.dev (EN). **Nieuw project apart beginnen** (suggestie: `C:\Users\japja\projects\toolflip-nl`), zelfde stack: Astro 6 + React 19 + Tailwind 4 + @astrojs/sitemap. Herbruik patronen: `ToolLayout.astro` (JSON-LD + FAQ via props), `src/data/tools.ts`-structuur, `scripts/generate-og.mjs`.
- Vercel CLI is ingelogd op deze machine (account jasper1056722s-projects). `npx vercel link` + `npx vercel --prod` werkt.
- Strato DNS-flow is bekend: A `@` → 76.76.21.21, CNAME `www` → cname.vercel-dns.com, daarna `npx vercel domains add`.
- Playwright staat in devDependencies — zelfde smoketest-aanpak gebruiken.
- Belastingcijfers 2026 NIET uit het hoofd doen: verifiëren bij belastingdienst.nl (IB-schijven, zelfstandigenaftrek-afbouw, MKB-winstvrijstelling %, Zvw-percentage, AOW-franchise).

## 8. Parallel experiment: Chrome-extensie (optioneel, max 1 weekend)

- Idee nog te kiezen; criteria: single-feature, client-side, eenmalige aankoop €5–15, geen onderhoud, lost één concrete irritatie op.
- $5 dev-fee, Web Store heeft eigen zoekverkeer (distributie gratis).
- Asymmetrische inzet: klein verlies mogelijk, snelle feedback (weken, niet maanden).
- NIET starten vóór Fase 1 af is. Hoofdproject eerst.

---

## 9. Researchbronnen (13 juni 2026)

- ZZP-niche: zzp-nederland.nl, tooliq.nl, rekenbuddy.nl, mijnzzptools.nl, berekenhet.nl, KVK-rekentool
- Affiliate: e-boekhouden.nl/affiliate (€60/lead), writgo.nl/beste-affiliate-netwerk-nederland, Daisycon energievergelijker via affiliateblogger.nl
- Marktdata: Gartner −25% zoekverkeer 2026; thedigitalbloom.com gen-AI traffic report; mktclarity.com AI-wrapper-marges; chromegoldmine.com extensie-benchmarks; softwareseni.com micro-SaaS-tijdlijnen; beehiiv.com nieuwsbrief-omzet
- Validatiemethode: fatstacksblog.com/test-niche (Bing Ads pre-SEO-test)
