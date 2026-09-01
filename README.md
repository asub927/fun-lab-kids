# Fun Lab

**NC K–5 Math, English & Science — hands-on Grade 2 learning labs with WebMCP**

Fun Lab is a kid-friendly learning app where students stack blocks, build sentences, and run science labs across North Carolina Grade 2 standards. An AI agent can share the same board — placing blocks, checking answers, and guiding practice through WebMCP tools. Progress saves locally on the device; no account required.

| | |
| --- | --- |
| **Repo** | `funlab` |
| **License** | MIT |
| **Live demo** | https://inquiry-island.vercel.app |
| **Hackathon** | [WebMCP Challenge](https://webmcp.devpost.com/) — deadline Sep 3, 2026 @ 1:00pm PDT |

## WebMCP Challenge submission

This repo is our entry for the OpenAI WebMCP Challenge. Judges may read the README without running the app, so this section covers fit, implementation, and testing.

### Why WebMCP is a strong fit

Grade 2 labs are naturally **shared workspaces**: place-value blocks, opinion-writing frames, and science classification boards. WebMCP lets an agent operate the same manipulatives the child sees, instead of describing steps in chat. The agent can navigate standards, apply board actions, run checks, and request hints while the child stays in control of confirmations (Show Answer, Reset, Accept Revision).

### What kids and agents can do together

- **Navigate curriculum** — list and search NC Grade 2 standards, open any lab by code, read progress and scoreboard stats.
- **Co-play labs** — build numbers with blocks, draft opinion sentences, classify matter and predict state changes.
- **Guided practice** — agent requests hints, asks guiding questions, and suggests revisions; the child confirms sensitive actions in the UI.

This was difficult before WebMCP because ed-tech UIs are built for human clicks, not structured agent tool calls across curriculum + board state.

### How WebMCP is implemented

Tools register via `document.modelContext.registerTool` in [`src/webmcp/register.ts`](src/webmcp/register.ts):

- **App-wide (curriculum):** `list_subjects`, `list_grades`, `list_standards`, `get_standard`, `search_standards`, `set_active_standard`, `get_progress`, `get_scoreboard`
- **Active lab (board):** `get_board_state`, `apply_board_action`, `undo`, `run_check`, `request_hint`, `ask_guiding_question`, `reveal_solution`, `reset_board`, `suggest_revision` (Opinion Builder)

The kid UI works fully without an agent. WebMCP is additive — agents use the same reducers and check logic as the on-screen controls.

### Testing instructions (for judges)

**Live URL:** https://inquiry-island.vercel.app

Open the live deployment in one of:

1. **ChatGPT** desktop app → in-app browser (WebMCP enabled by default), or
2. **Google Chrome 149+** → enable `chrome://flags/#enable-webmcp-testing` → restart

Then try a sample prompt:

| Subject | Sample prompt |
| --- | --- |
| **Math** | Open Place Value Lab. Use tools to build 243 with hundreds, tens, and ones blocks, then `run_check`. |
| **ELA** | Help me write an opinion about recess. Add two reasons and a linking word; suggest one revision and wait for my confirm. |
| **Science** | Classify the objects, heat the ice, predict the state, then `run_check`. |

Legacy deep links still work: `/demo/math` → `/lab/NC.2.NBT.1`, `/demo/ela` → `/lab/W.2.1`, `/demo/science` → `/lab/2.P.2.1`.

> **Devpost also requires:** a working live URL, a public repo with this license, a <3 min YouTube demo video (what you built + how you used WebMCP), and a project description on the submission form. Put the video link on Devpost; keep testing instructions here.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173 and go to **Grade 2** for the full kid app. WebMCP tools register automatically when the host browser supports `document.modelContext`.

## Grade 2 app routes

Guest mode — no child PII; progress saves in localStorage on this device:

| URL | Purpose |
| --- | --- |
| `/` | Home page |
| `/grade-2` | Grade 2 hub (Math, ELA, Science) |
| `/grade-2/math` | All NC.2.* math standards |
| `/grade-2/ela` | All Grade 2 ELA standards |
| `/grade-2/science` | All Grade 2 science standards |
| `/grade-2/progress` | Fun Points, streaks, badges, and lab buddy |
| `/catalog` | Full K–5 standards catalog |
| `/lab/:code` | Play any Grade 2 standard (e.g. `/lab/NC.2.NBT.1`) |

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
- Hybrid template library + 3 showcase labs (Place Value Lab, Opinion Builder, Matter Lab)
- Grade 2 hub, subject browsers, and `/lab/:standardCode` routing
- Fun Points, Smart Score, streaks, and 8 achievement badges
- Optional lab buddy (corner pet) and subject guides (Ripple, Digits, Spark)
- WebMCP tools for agent co-play on curriculum and lab boards
- localStorage progress per standard
- K–5 catalog stubs (non–Grade 2 marked coming soon)

## Standards attribution

Standards text from the North Carolina Standard Course of Study (NCSCOS). Attribution to NC DPI; **not** endorsed by DPI or any district.

## License

MIT — see [LICENSE](./LICENSE).
