# The map — where the world stands

*Since 2026-11-01 (architect's decision, wording private; on the site `docs/design/2026-11-01-the-map.md`).*
A briefing used to ask what is new, and a state of affairs has no date: poverty, inequality, the concentration
of money and power, democracy and rights were no matter in its first two editions, while AI was three of ten.
Every briefing now opens with these thirteen fields, one line each, and takes its matters from them. A field
without news still has its line. Until 2026-11-02 there were eleven: read against the rankings below, they
gave the environment one field for four subjects and the economy none, and read none of the largest measured
harms, so nature, air and water and debt, work and cost of living joined, war took in the violence beyond it,
and the concentration of money and power reads control while inequality reads how the whole is shared
(architect's decision, wording private; on the site the same record, "Thirteen fields"). The rules are in
[README.md](README.md). The fields, their terms for the attention count and the machine's half of the check
are in the site's `src/lib/briefing/map.ts`.

## The first edition, 2026-11-01

It has the eleven fields of its day; the first briefing with thirteen lines is the one after cycle 012.
Written by one session and read against its sources by a second, which owed it nothing: 124 claims,
119 held, 5 corrected, 0 dropped. The data, with what each direction rests on:
[`map-2026-11-01.json`](map-2026-11-01.json).

| Field | Where it stands | As of | Direction | Signals |
|---|---|---|---|---:|
| War and armed conflict | UCDP counted about 244,600 people killed in organised violence in 2025, up from about 187,000 in 2024, and a record 65 state-based conflicts. SIPRI put world military spending at $2,887 billion in 2025, up 2.9% in real terms. [1](https://www.uu.se/en/press/press-releases/2026/2026-06-09-ucdp-record-number-of-conflicts-between-states) · [2](https://academic.oup.com/jpr/article/63/4/705/8703754) · [3](https://www.sipri.org/publications/2026/sipri-fact-sheets/trends-world-military-expenditure-2025) | 2025 | worse | 286 |
| Hunger | SOFI 2026 nowcasts 645 million people undernourished in 2025 (7.8%, range 608–696 million), about 14 million fewer than in 2024. Separately, 266 million people in 47 food-crisis countries and territories faced high acute food insecurity in 2025, 22.9% of those analysed. [1](https://openknowledge.fao.org/3/cd8306en/cd8306en.pdf) · [2](https://www.fao.org/newsroom/detail/sofi-2026--hunger-not-inevitable--fao-says-as-global-hunger-report-shows-progress/en) · [3](https://doi.org/10.4060/cd9424en) · [4](https://www.fao.org/newsroom/detail/acute-food-insecurity-and-malnutrition-remain-alarmingly-high-as-crises-deepen--un--eu-and-partners-warn-in-new-report/en) · [5](https://www.fightfoodcrises.net/articles/mid-year-update-2026-grfc-now-available) | 2025 | unclear | 1 |
| Poverty | The World Bank nowcasts about 811 million people, 1 in 10, below $3.00 a day (2021 PPP) in 2026; 2024, the latest year with sufficient data, stands at 824 million. UNDP and OPHI count 1.2 billion (18.9%) in acute multidimensional poverty in 108 countries, surveys of 2014–2025. [1](https://www.worldbank.org/en/publication/poverty-prosperity-and-planet) · [2](https://blogs.worldbank.org/en/opendata/september-2026-global-poverty-update-from-the-world-bank--one-in) · [3](https://pip.worldbank.org/home) · [4](https://hdr.undp.org/content/2026-global-multidimensional-poverty-index-mpi) | 2026 | steady | 4 |
| Inequality | World Inequality Lab estimates, 2025: the global top 10% took 53% of income and held 75% of wealth, the bottom half 8% and 2%. The top 0.001% held nearly 6.1% of wealth, up from around 3.8% in 1995. Average income in North America & Oceania is about 13 times Sub-Saharan Africa's. [1](https://wir2026.wid.world/insight/executive-summary/) · [2](https://wir2026.wid.world/www-site/uploads/2026/09/World_Inequality_Report_2026.pdf) | 2025 | unclear | 8 |
| Concentration of money and power | Forbes counted a record 3,428 billionaires worth an estimated $20.1 trillion at 1 March 2026 prices, 400 more people and up from $16.1 trillion in its 2025 list. Epoch AI estimates five hyperscalers held 71% of the world's cumulative AI compute in Q4 2025, up from 63% in Q1 2024. [1](https://www.forbes.com/sites/pr/2026/03/10/forbes-40th-annual-worlds-billionaires-list-elon-musk-is-worlds-richest-person-ever-recorded/) · [2](https://www.forbes.com/sites/chasewithorn/2026/03/10/2026-worlds-billionaires-list-facts-and-figures/) · [3](https://epoch.ai/data-insights/hyperscalers-control-most-compute) | 2026-03-01 | worse | 34 |
| Climate, nature and disasters | September 2026 was 1.63°C above pre-industrial and the 12 months to it 1.50°C; the month was the second-warmest September in Copernicus's ERA5 record. EM-DAT recorded 358 natural-hazard disasters, 16,607 deaths and 110.2 million people affected in 2025, figures still evolving. [1](https://climate.copernicus.eu/surface-air-temperature-september-2026) · [2](https://climate.copernicus.eu/surface-air-temperature-september-2025) · [3](https://files.emdat.be/reports/2025_EMDAT_report.pdf) | 2026-09 | worse | 78 |
| Health and epidemics | UN IGME estimates 4.9 million children died before age five in 2024, down from 6.1 million in 2015, and the pace of decline has slowed by 61%. DR Congo's Bundibugyo Ebola outbreak reached 10,414 confirmed cases, including 5,372 deaths, by 30 October 2026 (INSP). [1](https://data.unicef.org/resources/levels-and-trends-in-child-mortality-2025/) · [2](https://www.who.int/news/item/18-03-2026-progress-in-reducing-child-deaths-slows-as-4.9-million-children-die-before-age-five) · [3](https://insp.cd/sitrep-n169-mve-bdbv-30-10-2026/) · [4](https://insp.cd/sitrep-n159-mve-bdbv-20-10-2026/) | 2024 | unclear | 22 |
| Displacement and humanitarian need | UNHCR estimates 117.8 million people were forcibly displaced at end-2025, 5.4 million fewer than a year earlier, with many returns under adverse circumstances. OCHA's plans list 252.8 million people in need in 2026; its global appeal was 44.3% funded on 1 November. [1](https://www.unhcr.org/sites/default/files/2026-06/global-trends-report-2025.pdf) · [2](https://www.unhcr.org/about-unhcr/overview/figures-glance) · [3](https://humanitarianaction.info/) · [4](https://fts.unocha.org/plans/overview/2026) | 2025-12 | unclear | 5 |
| Democracy and rights | V-Dem's best estimate is 92 autocracies and 87 democracies at end-2025, with 74% of people (6 billion) living in autocracies, up from 50% in 2005. Freedom House recorded a 20th consecutive year of decline in global freedom in 2025: 54 countries down, 35 up. [1](https://www.v-dem.net/documents/75/V-Dem_Institute_Democracy_Report_2026_lowres.pdf) · [2](https://freedomhouse.org/article/new-report-global-freedom-declined-20th-consecutive-year-2025) | 2025 | worse | 22 |
| Information and manipulation | RSF's 2026 index (covering 2025) rates press freedom "difficult" or "very serious" in 52.2% of 180 countries and territories, against 13.7% in 2002. In the 2026 Digital News Report survey, trust in news averaged 37% across 48 markets, the lowest since measuring began in 2015. [1](https://rsf.org/en/2026-rsf-index-press-freedom-25-year-low) · [2](https://reutersinstitute.politics.ox.ac.uk/digital-news-report/2026/dnr-executive-summary) | 2025 | worse | 47 |
| AI and its harms | The AI Incident Database recorded 362 incidents in 2025, up from 233 in 2024. US payroll data show no widespread displacement, but employment at ages 22–25 in highly AI-exposed occupations was about 19% below the pace of less-exposed peers by June 2026; descriptive, not causal. [1](https://hai.stanford.edu/ai-index/2026-ai-index-report) · [2](https://digitaleconomy.stanford.edu/news/canariesaug26/) | 2025 | worse | 1,109 |

Signals: Common Ground, 2026-10-03 to 2026-11-01, of 25,803, by the house's one count. They were counted
before the ledger widened on 2026-11-02, and later counts do not compare with them. A direction is one word
for what the source's own comparison shows. Where a line has two faces, `compared_with` in the data says
so, and it is worth reading before the word is quoted.

## What each field reads

Every briefing opens the newest edition of these, whether or not anything happened in the field.

### War and violence

| Source | Comes | Read for |
|---|---|---|
| [Organized violence article and UCDP datasets](https://ucdp.uu.se/downloads/), Uppsala Conflict Data Program, Uppsala University | yearly (June); candidate events monthly | Deaths in organised violence in the last full year with its three types apart (state-based, non-state, one-sided), and the number of state-based conflicts. Candidate events are preliminary. |
| [Trends in World Military Expenditure and the Military Expenditure Database](https://www.sipri.org/databases/milex), SIPRI | yearly (April) | World total, real-terms change and the world military burden (share of GDP). |
| [ACLED Conflict Index](https://acleddata.com/series/acled-conflict-index), ACLED | yearly (December) | Conflict events and deaths over the twelve months and the places ranked highest. It counts differently from UCDP: never mix the two. ACLED called 2025 steady on events, 204,605 against 208,219. |
| [SIPRI Yearbook, chapter World nuclear forces](https://www.sipri.org/yearbook), SIPRI | yearly (June) | Total inventory, military stockpile and deployed warheads in January of the edition's year (2026: 12,187, about 9,745, about 4,012). These are estimates from public information. SIPRI puts the rise of about 100 deployed warheads mainly down to a reassessment of Russian deployments and to new Chinese and Indian ones, so part of a change can be a recount. The total falls as retired US and Russian warheads are dismantled while stockpiles grow: read the stockpile for the trend. |
| [Global Study on Homicide and UNODC homicide data](https://www.unodc.org/unodc/en/data-and-analysis/global-study-on-homicide.html), UNODC | data yearly, global rate through SDG indicator 16.1.1; study irregular (2011, 2013, 2019, 2023) | The global homicide rate per 100,000 for the latest year (2024: 5.1, down from 5.9 in 2015). When a study appears, also the global count; the newest count, 458,000, is for 2021. These are UNODC model estimates from national data, re-estimated with every release (2021 was 5.8 in the study and is 5.53 now), so compare only within one release. Homicides and UCDP's organised violence overlap where gangs and cartels fight: never add the two. |

### Hunger

| Source | Comes | Read for |
|---|---|---|
| [The State of Food Security and Nutrition in the World (SOFI)](https://www.fao.org/publications/fao-flagship-publications/the-state-of-food-security-and-nutrition-in-the-world/en), FAO, IFAD, UNICEF, WFP and WHO | yearly (July) | Number and share of undernourished people with the range. The newest year is a nowcast and each edition revises the series, so compare only inside one edition. |
| [Global Report on Food Crises and its Mid-year Update](https://www.fightfoodcrises.net/global-report-food-crises), FAO, WFP and the Global Network Against Food Crises | yearly (April to May), mid-year update (September) | People in IPC/CH Phase 3 or above, the share of those analysed, and people in Phase 5. Coverage changes every year, so compare the share and the comparable countries, not the headline total. |
| [Hunger Hotspots](https://www.wfp.org/publications/hunger-hotspots-fao-wfp-early-warnings-acute-food-insecurity), FAO and WFP | twice a year (about June and November) | The hotspots of highest concern and where a risk of famine is named. An early warning: could stays could. The 266 million it quotes is the GRFC total, not a hotspot count. |

### Poverty

| Source | Comes | Read for |
|---|---|---|
| [Poverty and Inequality Platform (PIP)](https://pip.worldbank.org/home), World Bank | several updates a year (in 2026: March, September) | People and share below $3.00 a day (2021 PPP) in the latest year with sufficient data, and the nowcast marked as one. Each version revises earlier years. |
| [Poverty, Prosperity, and Planet Report](https://www.worldbank.org/en/publication/poverty-prosperity-and-planet), World Bank | every two years | The Bank's own reading of the trend, Annex 1C for the series, the $8.30 line, the Prosperity Gap. |
| [Global Multidimensional Poverty Index](https://ophi.org.uk/global-mpi), UNDP and OPHI | yearly (October) | People and share in acute multidimensional poverty, the survey years behind them, and the change like for like. Population growth is part of the change: read the update's own split. |

### Debt, work and cost of living

| Source | Comes | Read for |
|---|---|---|
| [A World of Debt](https://unctad.org/publication/world-of-debt), UN Trade and Development (UNCTAD) | yearly (June to July) | People living in developing countries that spend more on net interest than on health or on education, and how many countries (2026 edition: 3.7 billion in 51), with the net interest bill (US$995 billion in 2025). "Or" means either one. The population figure lags the interest figures (the page's regional shares run to 2023). |
| [Latest debt sustainability analyses under the LIC-DSF](https://www.worldbank.org/en/programs/debt-toolkit/dsa), World Bank and IMF | continuous; the table states its date (end-September 2026) | Countries in debt distress and at high risk of external debt distress (end-September 2026: 10 and 22 of 68 rated). Only IDA countries under the low-income framework. Each rating is as old as the country's last published analysis (Afghanistan, Myanmar and Sudan: 2021). The IMF keeps its own list, dated differently: name which one you quote. |
| [Employment and Social Trends (until 2025: World Employment and Social Outlook: Trends)](https://www.ilo.org/publications/flagship-reports/employment-and-social-trends-2026), International Labour Organization | yearly (January), update in May; the year in the address changes | Global unemployment, the jobs gap, extreme working poverty (under US$3 a day) and informal employment (January 2026: 4.9% projected for 2026, jobs gap 408 million, nearly 300 million, 2.1 billion). ILO model estimates and projections. The May 2026 update added an oil-shock scenario (+0.1 point in 2026, +0.5 in 2027), not a new baseline. |
| [World Economic Outlook](https://www.imf.org/en/publications/weo), IMF | April and October, updates in January and July | World consumer price inflation for the last full year and the current one (October 2026: 4.1% in 2025, 4.7% projected for 2026). The current year is a projection revised in every edition. The world figure is an average weighted by economies' size at purchasing-power parity, not what any household pays. |

### Inequality

| Source | Comes | Read for |
|---|---|---|
| [World Inequality Report](https://wir2026.wid.world/), World Inequality Lab | about every four years (2018, 2022, 2026) | Global shares of the top 10%, top 1%, top 0.001% and bottom 50% in income and wealth, with the year and the PPP basis. |
| [World Inequality Database](https://wid.world/), World Inequality Lab | rolling | Top and bottom shares between report editions, and country series for inequality within countries. |
| [Global Wealth Report](https://www.ubs.com/global/en/wealthmanagement/insights/global-wealth-report.html), UBS | yearly (June) | The wealth pyramid (2025: 1.5% of adults held 48.4% of wealth, 41.1% held 0.6%, sample of 56 markets) and average against median. A bank's estimates in USD; UBS says the weaker dollar amplified 2025 increases outside the US. |
| [World's Billionaires list](https://www.forbes.com/worlds-billionaires/), Forbes | yearly (March to April) | Number of billionaires and their combined net worth on the list's date (2026: 3,428 people, $20.1 trillion, prices of 1 March). These are estimates by Forbes in nominal dollars that move with markets: set them beside WIL's shares, not alone. Oxfam's yearly billionaire figures are its own analysis of Forbes data. |
| [Global Gender Gap Report](https://www.weforum.org/publications/global-gender-gap-report/), World Economic Forum | yearly (June until 2025; September in 2026) | Share of the gender gap closed across the edition's economies and across the 97 indexed since 2006, and the years to parity (2026: 69.2% across 145, 69.4% in the constant sample, 120 years). It scores gaps between women and men, not levels. The set of economies changes between editions, so compare the constant sample or the report's own like-for-like change. Years to parity is an extrapolation. |
| [Global estimates of intimate partner/family member femicides](https://www.unwomen.org/en/digital-library/publications/2025/11/femicides-in-2024-global-estimates-of-intimate-partner-family-member-femicides), UNODC and UN Women | yearly (late November); the year in the address changes | Women and girls killed by intimate partners or family members, with the range, and their share of all women and girls killed intentionally (2024: about 50,000, range 44,400–55,500, 60% of about 83,000). Based on 117 countries and territories with missing values imputed: read it as magnitude, not precision. The authors say the fall from 51,100 in 2023 reflects data availability, not a real decrease. |

### Concentration of money and power

It reads control: who holds compute, markets and the state's ear, and what money does to get them. How large
fortunes are, and how the whole is shared, is inequality's.

| Source | Comes | Read for |
|---|---|---|
| [Data on AI chip owners and Data Insights](https://epoch.ai/data/ai-chip-owners), Epoch AI | irregular, several updates a year | Share of the world's cumulative AI compute held by the five hyperscalers, in H100-equivalents, finalised quarters only. An estimate; coverage of chip ownership is incomplete. |
| [Corruption Perceptions Index](https://www.transparency.org/en/cpi), Transparency International | yearly (late January to February) | Global average score and how many of 182 countries score below 50. Perceptions of public-sector corruption, not measured corruption. |
| [The State of Tax Justice](https://taxjustice.net/reports/), Tax Justice Network | yearly (November) | Estimated tax lost to corporate tax abuse and offshore wealth. Check the period: the 2025 edition's US$1.7 trillion covers six years. |
| [Search Engine Market Share Worldwide](https://gs.statcounter.com/search-engine-market-share), StatCounter Global Stats | monthly (from daily data; a month can be revised for 45 days) | Share of search referrals worldwide held by the leading engine and the next (October 2026: Google 91.05%, Bing 4.8%). It counts page views arriving from search on sites that carry StatCounter's code, not searches made. China weighs little in the worldwide figure (Baidu has 49% in China, 0.42% worldwide), and AI chatbots are counted on a separate page. One market, not concentration in general. |

### Climate and disasters

| Source | Comes | Read for |
|---|---|---|
| [Climate bulletin](https://climate.copernicus.eu/climate-bulletin), Copernicus Climate Change Service (ECMWF) | monthly | The month's anomaly against 1850–1900, its rank in ERA5, the 12-month mean and sea surface temperature. |
| [Emissions Gap Report](https://www.unep.org/en/publications/report/emissions-gap-report-2026), UNEP | yearly (before each COP); the year in the address changes | Emissions of the last year with their range, and warming by 2100 under current policies and under NDCs, as 66% chance statements. UNEP finds 2025 emissions (58.4 GtCO2e, ±5.5) inconclusive on direction. |
| [Disasters in Numbers, from EM-DAT](https://www.emdat.be/publications/), CRED, UCLouvain | yearly | Natural-hazard disasters, deaths, people affected and damage against the 2005–2024 average. Earthquakes count; heatwave and drought deaths lag in reporting, so the newest year is provisional. |

### Nature, air and water

| Source | Comes | Read for |
|---|---|---|
| [Planetary Health Check](https://www.planetaryhealthcheck.org/), Planetary Boundaries Science Lab, PIK | yearly (September) | How many of nine boundaries are transgressed (seven in 2026) and which. The assessment uses the latest available data, some of it older than the edition. |
| [State of Global Air](https://www.stateofglobalair.org/), Health Effects Institute with IHME | irregular, following Global Burden of Disease rounds (2024: June; 2025: 22 October) | Deaths attributable to air pollution in the latest GBD year, with ambient PM2.5, household air pollution and ozone apart (2023: 7.9 million). Model estimates: each edition revises the past (2021 went from 8.1 to 7.6 million), so compare years only within one edition. |
| [Progress on household drinking water, sanitation and hygiene](https://washdata.org/reports), WHO/UNICEF Joint Monitoring Programme | every two years (2025: 26 August); reports on schools and health care facilities in between | People without safely managed drinking water, without safely managed sanitation and without basic hygiene at home (2024: 2.1 billion, 3.4 billion, 1.7 billion). Estimates from national surveys, censuses and administrative data. Each report re-estimates the whole series, so compare years only within one report. |
| [IUCN Red List of Threatened Species, summary statistics](https://www.iucnredlist.org/statistics), IUCN | at least twice a year (2026-1: 9 July; 2026-2 planned for 26 November) | Species assessed and species threatened with extinction (2026-1: 49,505 of 175,909, 28%). The count rises mainly because more species are assessed, and many groups are not fully assessed: it is no trend and no census of life. For direction, read the Red List Index (SDG 15.5.1: 0.806 in 1993, 0.745 in 2025; based on mammals, birds, amphibians, corals and cycads). |

### Health and epidemics

| Source | Comes | Read for |
|---|---|---|
| [Levels and trends in child mortality](https://childmortality.org/), UN Inter-agency Group for Child Mortality Estimation | yearly | Under-five deaths and the rate, with the uncertainty interval, and the annual rate of reduction. |
| [Global Health Estimates](https://www.who.int/data/global-health-estimates), WHO | irregular | Life expectancy, healthy life expectancy and leading causes of death. Replaces GBD on this list: GBD's newest edition found is GBD 2023 of October 2025. |
| [Disease Outbreak News](https://www.who.int/emergencies/disease-outbreak-news), WHO | as events occur | What WHO has confirmed about an outbreak, then follow it to the national source for the running count. |
| [SitRep, 17th Ebola epidemic](https://insp.cd/ebola-17eme-epidemie/), Institut National de Santé Publique, DR Congo | daily, while this outbreak lasts | Cumulative confirmed cases and deaths on the reporting date, from the national institute. SitRep 169 raised Ituri's deaths from 3,436 to 3,750 after harmonising data, so older totals elsewhere can lag. |

### Displacement and humanitarian need

| Source | Comes | Read for |
|---|---|---|
| [Global Trends and Mid-Year Trends](https://www.unhcr.org/about-unhcr/overview/figures-glance), UNHCR | yearly (June), mid-year (autumn) | Forcibly displaced people at the reporting date, by group (IDP figures come from IDMC), and how UNHCR describes returns. |
| [Financial Tracking Service and Global Humanitarian Overview](https://humanitarianaction.info/), OCHA | continuous; overview yearly (December) | People in need across plans, requirements, funding and the percentage funded, with the date. Year-to-date coverage compares only with the same date in another year. |
| [The world's most neglected displacement crises](https://www.nrc.no/resources/reports/the-worlds-most-neglected-displacement-crises-2025), Norwegian Refugee Council | yearly (May to June); the year in the address changes | The ten of 35 displacement crises ranked most neglected on funding, media, political attention and scale. Used to check Urgent but quiet. |
| [CARE Crisis Report](https://www.care.org/media-and-press/tag/10-most-under-reported-humanitarian-crises/), CARE | yearly (January) | The ten least-covered of 43 crises affecting at least one million people, by online articles. Used to check Urgent but quiet. |

### Democracy and rights

| Source | Comes | Read for |
|---|---|---|
| [Democracy Report](https://www.v-dem.net/publications/democracy-reports/), V-Dem Institute | yearly (March) | Autocracies and democracies with the grey-zone range, share of world population in each, and countries autocratizing and democratizing. |
| [Freedom in the World](https://freedomhouse.org/report/freedom-world), Freedom House | yearly (February to March) | Countries declining against improving in the year, consecutive years of decline, share of people in Free countries. |
| [The Global State of Democracy](https://www.idea.int/theme/democracy-assessment), International IDEA | yearly (September) | Countries declining and advancing, comparing the last year with five years before. Keep its counterweight: 81% of cases showed no change. |
| [The State of the World's Human Rights](https://www.amnesty.org/en/documents/pol10/0320/2026/en/), Amnesty International | yearly (April); the document number changes | Documented violations and trends by country. Documentation, not a metric: take no single global figure from it. |

### Information and manipulation

| Source | Comes | Read for |
|---|---|---|
| [World Press Freedom Index](https://rsf.org/en/index), Reporters Without Borders (RSF) | yearly (late April to early May) | Share of 180 countries and territories in each category, the average score and the five indicators. Expert questionnaire plus a tally of abuses, a snapshot of the previous calendar year, updated to publication. |
| [Digital News Report](https://reutersinstitute.politics.ox.ac.uk/digital-news-report/2026), Reuters Institute, University of Oxford | yearly (June); the year in the address changes | Trust in news and concern about fake news across 48 markets. A YouGov online survey fielded early in the year: it stays a survey, and represents the online population. |
| [Prison census and killed report](https://cpj.org/reports/), Committee to Protect Journalists | yearly (January, February) | Journalists jailed on the census date and journalists and media workers killed, with CPJ's own criteria. |
| [#KeepItOn report on internet shutdowns](https://www.accessnow.org/campaign/keepiton/), Access Now and the #KeepItOn coalition | yearly (first half of the year: 24 February 2025, 31 March 2026) | Documented shutdowns and countries (at least 313 in 52 in 2025, up from 304 in 2024). A minimum count. |

### AI and its harms

| Source | Comes | Read for |
|---|---|---|
| [AI Index Report](https://hai.stanford.edu/ai-index), Stanford HAI | yearly (April) | Documented AI incidents by year (from the AI Incident Database) and the responsible AI chapter. Past years are revised. |
| [AI Incident Roundup](https://incidentdatabase.ai/blog/), AI Incident Database | about every three months | What was added and the themes. The database warns that batches reflect what editors processed, so a roundup is no measure of how often a harm occurred. |
| [Canaries in the Coal Mine?](https://digitaleconomy.stanford.edu/publications/canaries-in-the-coal-mine/), Stanford Digital Economy Lab | irregular revisions | The employment gap for ages 22–25 in highly AI-exposed occupations, ADP payroll data, as a shortfall against less-exposed peers. The authors say descriptive, not causal. |
| [International AI Safety Report](https://internationalaisafetyreport.org/), International AI Safety Report, chaired by Yoshua Bengio, with the UK AI Security Institute as partner | yearly (late January to February), with key updates | The assessed state of evidence on risks and safeguards. A synthesis: quote its findings with their hedges. |

## Read across the map

Each of these ranks humanity's problems from a standpoint, so none of them decides. A writer reads them to
ask what they put high that the briefing leaves out.

- [Global Risks Report](https://www.weforum.org/publications/series/global-risks-report/), World Economic Forum, yearly: a survey of leaders and experts. It has named inequality the most interconnected risk two years running.
- [The Sustainable Development Goals Report](https://unstats.un.org/sdgs/report/2026/), United Nations, yearly: how far the targets are on track.
- [Most pressing problems](https://80000hours.org/problem-profiles/), 80,000 Hours, revised irregularly: one school's ranking, led by the risks of advanced AI.
- [Emergency Watchlist](https://www.rescue.org/watchlist), International Rescue Committee, yearly: where humanitarian crises are most likely to worsen.
- [What Worries the World](https://www.ipsos.com/en/what-worries-world), Ipsos, monthly: a survey of what people say worries them. A measure of worry, not of harm.

## Against Urgent but quiet

The second session reads "Urgent but quiet" against the newest editions of NRC's *most neglected displacement
crises* and CARE's *most under-reported crises* (both under Displacement above). A crisis high on them that
the briefing leaves out is named in "Checked", with the reason.

## What the map cannot do

- **Power.** No body publishes a scheduled global series on corporate concentration or on money in
  politics. Since 2026-11-02 the field reads control through parts of it: AI compute (Epoch AI), search
  (StatCounter), perceived corruption (Transparency International) and tax abuse (Tax Justice Network); the
  billionaires moved to inequality. Each is one market or one estimate, and that should be said wherever the
  line is used.
- **Attention.** Common Ground is a set of public charts, in English terms. Quiet means quiet in these charts.
- **Ranking.** The map does not rank the fields. Which matter is most urgent stays a judgement, written down
  and checked.
