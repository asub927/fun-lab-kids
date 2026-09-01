# Inquiry Island

**NC K–5 Math, English & Science — hands-on Grade 2 learning labs**

Inquiry Island is a kid-friendly learning app where students stack blocks, build sentences, and run science labs across North Carolina Grade 2 standards. Progress saves locally on the device — no account required.

| | |
| --- | --- |
| **Repo** | `inquiry-island` |
| **License** | MIT |
| **Hosting** | Vercel |

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173 and go to **Grade 2** for the full kid app.

## Grade 2 app routes

Guest mode — no child PII; progress saves in localStorage on this device:

| URL | Purpose |
| --- | --- |
| `/` | Home page |
| `/grade-2` | Grade 2 hub (Math, ELA, Science) |
| `/grade-2/math` | All NC.2.* math standards |
| `/grade-2/ela` | All Grade 2 ELA standards |
| `/grade-2/science` | All Grade 2 science standards |
| `/grade-2/progress` | Island Points, streaks, badges, and island friend |
| `/catalog` | Full K–5 standards catalog |
| `/lab/:code` | Play any Grade 2 standard (e.g. `/lab/NC.2.NBT.1`) |

Legacy deep links redirect automatically:

| Old URL | Redirects to |
| --- | --- |
| `/demo` | `/grade-2` |
| `/demo/math` | `/lab/NC.2.NBT.1` |
| `/demo/ela` | `/lab/W.2.1` |
| `/demo/science` | `/lab/2.P.2.1` |

## Scripts

```bash
npm run dev        # local development
npm run typecheck  # TypeScript
npm run test       # board reducer tests
npm run build      # production build → dist/
```

## Deployment

Deploy after the local build passes. See `vercel.json` for build settings and SPA routing.

```bash
npm run build   # verify locally first
```

Import the repo at [vercel.com/new](https://vercel.com/new) — no environment variables required.

## Features

- **NCSCOS-complete Grade 2** — 77 playable standards (23 Math, 41 ELA, 13 Science)
- Hybrid template library + 3 showcase labs (Place Value Island, Opinion Builder, Matter Lab)
- Grade 2 hub, subject browsers, and `/lab/:standardCode` routing
- Island Points, Smart Score, streaks, and 8 achievement badges
- Optional island friend (corner pet) and subject guides (Ripple, Digits, Spark)
- localStorage progress per standard
- K–5 catalog stubs (non–Grade 2 marked coming soon)

## Standards attribution

Standards text from the North Carolina Standard Course of Study (NCSCOS). Attribution to NC DPI; **not** endorsed by DPI or any district.

## License

MIT — see [LICENSE](./LICENSE).
