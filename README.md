# Fun Lab

**NC K–5 Math, English & Science — learn with your AI teammate**

WebMCP Challenge project: a Synthesis-inspired learning web app where kids and an AI agent share manipulatives, writing boards, and simple science sims via `document.modelContext.registerTool`.

| | |
| --- | --- |
| **Repo** | `funlab` |
| **License** | MIT |
| **Deadline** | Sep 3, 2026 @ 1:00pm PDT |
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
| `/grade-2` | Jordan's Grade 2 hub (Math, ELA, Science) |
| `/grade-2/math` | All NC.2.* math standards |
| `/grade-2/ela` | All Grade 2 ELA standards |
| `/grade-2/science` | All Grade 2 science standards |
| `/lab/:code` | Play any Grade 2 standard (e.g. `/lab/NC.2.NBT.1`) |

Legacy judge deep links redirect automatically:

| Old URL | Redirects to |
| --- | --- |
| `/demo` | `/grade-2` |
| `/demo/math` | `/lab/NC.2.NBT.1` |
| `/demo/ela` | `/lab/W.2.1` |
| `/demo/science` | `/lab/2.P.2.1` |

## ChatGPT judge prompts

1. **Math:** `Open Place Value Lab. Use tools to build 243 with hundreds, tens, and ones blocks, then run_check.`
2. **ELA:** `Help me write an opinion about recess. Add two reasons and a linking word; suggest one revision and wait for my confirm.`
3. **Science:** `Classify the objects, heat the ice, predict the state, then run_check.`

## WebMCP testing

Test in one of:

- **ChatGPT** in-app browser (WebMCP enabled by default), or
- **Chrome:** enable `chrome://flags/#enable-webmcp-testing` and restart

If WebMCP is unavailable, a banner appears — the kid UI still works without an agent.

### Registered tools (P0)

Curriculum: `list_subjects`, `list_grades`, `list_standards`, `get_standard`, `search_standards`, `set_active_standard`, `get_progress`

Board: `get_board_state`, `apply_board_action`, `undo`, `run_check`, `request_hint`, `ask_guiding_question`, `reveal_solution`, `reset_board`, `suggest_revision` (Opinion Builder)

## Scripts

```bash
npm run dev        # local development
npm run typecheck  # TypeScript
npm run test       # board reducer tests
npm run build      # production build → dist/
```

## Vercel

Deploy only after the local smoke checklist passes. See `vercel.json` for build settings and SPA routing. Preview deploys are automatic per PR.

```bash
npm run build   # verify locally first
```

Import the repo at [vercel.com/new](https://vercel.com/new) — no environment variables required.

## Scope (Phase 1 shipped)

- **NCSCOS-complete Grade 2** — 77 playable standards (23 Math, 41 ELA, 13 Science)
- Hybrid template library + 3 showcase labs
- Grade 2 hub, subject browsers, `/lab/:standardCode` routing
- localStorage progress per standard
- WebMCP tools + degradation banner
- K–5 catalog stubs (non-G2 marked coming soon)

## Standards attribution

Standards text from the North Carolina Standard Course of Study (NCSCOS). Attribution to NC DPI; **not** endorsed by DPI or any district.

## License

MIT — see [LICENSE](./LICENSE).
