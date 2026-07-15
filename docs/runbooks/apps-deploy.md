# Runbook: Apps deployen (Cloudflare Pages)

(work order `docs/work-orders/phase-c3-apps-static-deploy.md` §2: „vorbereitet, nicht
ausgelöst" — dieses Dokument beschreibt den Ablauf; der erste echte Deploy passiert nicht durch
dieses Paket, sondern erst wenn Frank die Secrets setzt und den Workflow laufen lässt.)

## Stand nach Paket C3

- **apps/atelier**: vollständig statisch (`@sveltejs/adapter-static`, `prerender = true` im
  Root-Layout). Fünf feste Routen, keine dynamischen Segmente: `/`, `/apparatus`, `/journal`,
  `/material`, `/sheets`. Build: `npm run build --workspace=@research-ecology/atelier` →
  `apps/atelier/build/`. Smoke-Check: `npm run smoke --workspace=@research-ecology/atelier`.
- **apps/middle-web**: **nicht** konvertiert. Siehe „middle-web: noch nicht deploybar" unten —
  das ist ein echter Befund, keine offene Fleißarbeit.
- Workflow `.github/workflows/deploy-apps.yml` baut + deployt aktuell nur `apps/atelier` nach
  Cloudflare Pages (Projekt `ecology-atelier`). Trigger: Push auf `main` (Pfade unter
  `apps/atelier/**`, `packages/**`, `fixtures/**`, `lenses/**`) und `workflow_dispatch`.

## middle-web: noch nicht deploybar

Ein echter Build-Versuch mit `adapter-static` schlägt fehl — nicht nur eine Einzelroute, sondern
grundsätzlich, weil das Root-Layout auf jeder Seite den Theme-Toggle rendert:

1. `src/routes/theme-toggle/+server.ts` ist ein POST-Endpoint (setzt ein Cookie, leitet um) —
   braucht einen laufenden Server. Kein Cloudflare-Pages-Static-Host kann das ausführen; adapter-
   static kann diese Route auch nicht als SPA-Fallback behandeln (das funktioniert nur für
   GET-Seitennavigation, nicht für POST-Endpoints).
2. `src/lib/chrome/ThemeToggle.svelte` (im Root-Layout, also auf jeder Seite) liest
   `page.url.search` — SvelteKit verweigert das Prerendering jeder Seite, die das tut
   („Cannot access url.search on a page with prerendering enabled").
3. `/ledger` liest zusätzlich `url.searchParams.get("cursor")` in `+page.server.ts` für die
   Pagination — dieselbe Fehlerklasse, und selbst wenn der Build das überleben würde: eine
   statisch ausgelieferte Datei kennt keine Query-Strings, „nächste Seite"-Links würden im
   Static-Hosting einfach dieselbe Seite-1 wieder anzeigen.

Das ist im Work Order selbst vorgesehen („STOP-and-report statt wegbiegen") — die drei Punkte
oben sind absichtliche Design-Entscheidungen von middle-web (progressive enhancement ohne JS,
siehe `tests/e2e/no-js.spec.ts:70` „theme toggle degrades to a plain form POST without JS"),
keine Bugs. Sie aufzulösen ist eine Entscheidung, keine Umsetzungsarbeit. Optionen, wenn du
so weit bist:

- **a) Theme-Persistenz umbauen** auf client-seitiges `localStorage` (wie atelier es schon
  macht) statt Server-Cookie + POST-Formular; `/ledger` auf pfadbasierte Pagination
  (`/ledger/seite/2`) oder client-seitiges „mehr laden" umstellen. Danach ist middle-web genauso
  statisch baubar wie atelier.
- **b) Cloudflare Pages Functions** für nur diese zwei dynamischen Stellen (Hybrid: Rest bleibt
  statisch, `/theme-toggle` und `/ledger` laufen als Worker-Function). Mehr Infrastruktur als
  „adapter-static überall", aber immer noch auf Cloudflare Pages.
- **c) middle-web auf einem Node-fähigen Host lassen** (z. B. `adapter-node`, woanders gehostet)
  statt auf Cloudflare Pages statisch — nur atelier wird dann Pages-only.

Bis diese Entscheidung fällt, bleibt `apps/middle-web/svelte.config.js` beim
`@sveltejs/adapter-auto`-Platzhalter; sein Playwright-Setup (SSR-Build + `vite preview`) ist
unverändert und unabhängig von dieser Frage.

## Secrets setzen (einmalig, GitHub → Settings → Secrets and variables → Actions)

- `CLOUDFLARE_API_TOKEN` — ein API-Token mit Cloudflare-Pages-Edit-Recht (Cloudflare-Dashboard →
  My Profile → API Tokens → „Create Token" → Template „Edit Cloudflare Workers" reicht, oder ein
  eigenes Token mit `Account.Cloudflare Pages: Edit`).
- `CLOUDFLARE_ACCOUNT_ID` — steht im Cloudflare-Dashboard rechts auf jeder Domain-Übersichtsseite
  unter „Account ID".

Beide Namen sind im Workflow schon referenziert (`secrets.CLOUDFLARE_API_TOKEN`,
`secrets.CLOUDFLARE_ACCOUNT_ID`) — nichts weiter einzutragen als die Werte selbst.

## Erster echter Deploy

1. Secrets setzen (oben).
2. Workflow manuell auslösen: GitHub → Actions → „Deploy apps (Cloudflare Pages)" →
   „Run workflow" (oder einfach etwas unter `apps/atelier/**` auf `main` pushen).
3. `wrangler-action` legt das Cloudflare-Pages-Projekt `ecology-atelier` beim ersten Lauf
   automatisch an, falls es noch nicht existiert — kein manuelles Vorab-Anlegen im Dashboard
   nötig.
4. Nach dem ersten erfolgreichen Deploy bekommt das Projekt eine `*.pages.dev`-Adresse
   automatisch. Custom Domain (z. B. `atelier.frankbueltge.de`) danach im Cloudflare-Dashboard
   unter dem Pages-Projekt → „Custom domains" → „Set up a custom domain" anbinden — das ist ein
   DNS-Schritt im Dashboard, nicht Teil dieses Workflows.
5. Für middle-web analog, sobald die Design-Entscheidung oben gefallen und ein `deploy-middle`-
   Job ergänzt ist: Projektname `ecology-middle`, Domain-Vorschlag `middle.frankbueltge.de`.

## Rollback

Cloudflare-Dashboard → Pages-Projekt (`ecology-atelier` / später `ecology-middle`) →
„Deployments" — jeder Deploy ist einzeln aufgelistet mit Zeitstempel und Commit-SHA. Auf einen
älteren Eintrag „Rollback to this deployment" klicken; das setzt die Produktions-URL sofort auf
diesen Stand zurück, ohne einen neuen Build zu brauchen (Cloudflare hält alle Deployments vor).

## Site-Links umstellen (nach dem ersten Deploy)

Die Platzhalter auf frankbueltge.de (`/akte/…`, „record app not deployed yet", Blattrand
„→ the middle", Atelier-Werk-Links) auf die echten Deploy-URLs umstellen ist ein eigenes,
kleines Site-Paket — **nicht Teil dieses Runbooks und nicht dieses Repos**. Wenn beide Apps
(oder auch nur atelier) live sind, das als eigene kurze Aufgabe im Site-Repo
(`frankbueltge.de`) einplanen.

## Nightly-Gedanke

Ein nächtlicher Auto-Deploy (statt nur „push auf main") ist hier bewusst **nicht** angelegt —
siehe `docs/runbooks/site-export.md` für die Begründung und das Muster, dem eine spätere
Nightly-Automation in diesem Lab folgen würde (GitHub-Actions-Workflow, `workflow_run`-Trigger
statt `on: push`, weil ein Push mit eingebautem `GITHUB_TOKEN` `on: push` nicht auslöst). Bis
Frank das freigibt, bleibt der Deploy hier push-getriggert plus manuell (`workflow_dispatch`).
