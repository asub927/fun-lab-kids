# WebMCP Challenge — Submission Completion Guide

**Project:** Fun Lab  
**Repo:** https://github.com/asub927/inquiry-island (`funlab`)  
**Live demo:** https://inquiry-island.vercel.app  
**Official rules:** https://webmcp.devpost.com/rules  
**Deadline:** September 3, 2026 @ 1:00pm PDT  

This guide covers every **pending** eligibility item as its own section. Each section maps to a specific Official Rules requirement, includes done-when criteria, steps, and paste-ready content.

Do **not** treat this file as the Devpost submission. Use it as the checklist and copy source while filling https://webmcp.devpost.com/.

---

## Status scoreboard

| Requirement (Official Rules §4) | Status | Where |
| --- | --- | --- |
| Join / register on Devpost | Pending (entrant) | [§1 Devpost registration](#1-devpost-registration) |
| WebMCP-powered web app using `document.modelContext.registerTool` | Met | [`src/webmcp/register.ts`](../src/webmcp/register.ts) |
| Built during Submission Period (Aug 25–Sep 3, 2026) | Met | Git history from 2026-08-26 |
| Working live URL (ChatGPT in-app browser or Chrome + WebMCP) | Met | https://inquiry-island.vercel.app — still verify WebMCP in ChatGPT/Chrome |
| Text description (4 required explanation points) | Pending | [§3 Devpost text description](#3-devpost-text-description) |
| Public code repository | Met | Public GitHub repo |
| Open-source license (detectable on GitHub) | Met | MIT [`LICENSE`](../LICENSE) |
| Demo video &lt;3 min, public YouTube, with audio | Pending | [§4 Demo YouTube video](#4-demo-youtube-video) |
| Testing / judge access instructions | Pending (paste to Devpost) | [§5 Judge testing instructions](#5-judge-testing-instructions) |
| Submit all fields on Enter a Submission | Pending | [§6 Submission form assembly](#6-submission-form-assembly) |
| Freeze repo + site + Devpost after deadline | Pending after submit | [§7 Post-deadline freeze](#7-post-deadline-freeze) |
| Optional Netlify credits form (Sep 1 @ 12pm PT) | Optional / likely closed | [§8 Optional hosting credits](#8-optional-hosting-credits) |

**Entrant-only (cannot be verified from the repo):** age-of-majority eligibility, OpenAI API–supported country/territory, not a disqualified person/org (Official Rules §3).

---

## 1. Devpost registration

### Rule satisfied

Official Rules §4 *How To Enter*: visit the Hackathon Website, click **Join Hackathon**, and create/log into a free Devpost account so you can receive updates and create a Submission.

### Why it matters

Without registration you cannot submit. This is an eligibility gate, not a judging criterion.

### Done when

- [ ] You are logged into Devpost
- [ ] Fun Lab / your account shows as joined on https://webmcp.devpost.com/
- [ ] You can open **Enter a Submission** (draft is fine)

### How to complete

1. Open https://webmcp.devpost.com/
2. Click **Join Hackathon**
3. Sign up or log in with Devpost
4. Confirm you see the challenge dashboard / Enter a Submission flow
5. Optional: install the Devpost Hackathons plugin in Codex (not required to enter or win — Official Rules §5)

### Ready-to-use content

None beyond account identity. Use the same name you want on the submission and prize paperwork.

### Evidence to keep

Screenshot of the joined-hackathon confirmation or dashboard showing you are registered.

---

## 2. Working live URL

### Rule satisfied

Official Rules §4 *Submission Requirements*: provide a **working live URL** judges can access using ChatGPT’s in-app browser or Google Chrome with WebMCP enabled. Hosting may be Vercel, Netlify, Cloudflare, Render, ChatGPT Sites, etc.

### Why it matters

Pass/fail for submission completeness. Judges are not required to build from source.

### Done when

- [x] Production URL loads over HTTPS without login — https://inquiry-island.vercel.app
- [ ] `/grade-2` hub and showcase labs load
- [ ] In ChatGPT in-app browser **or** Chrome with `chrome://flags/#enable-webmcp-testing`, agent tools work
- [ ] Agent can call at least `set_active_standard`, `apply_board_action`, and `run_check`
- [ ] GitHub repo **About → Website** is set to the live URL (if not already)
- [ ] Same URL is pasted into the Devpost submission form

### How to complete

Live site is already on **Vercel** (`vercel.json` in repo). Remaining work is verification + Devpost paste.

1. Open https://inquiry-island.vercel.app/grade-2
2. Smoke: Math / ELA / Science → open a lab
3. Open the same URL in ChatGPT’s in-app browser (WebMCP on by default)
4. Alternate: Chrome 149+, enable `chrome://flags/#enable-webmcp-testing`, restart, reload
5. GitHub → repo **About** (gear) → Website → `https://inquiry-island.vercel.app` → Save
6. Paste the same URL into Devpost

Local rebuild (only if you change code before submit):

```bash
npm install
npm run typecheck
npm run test
npm run build
```

### Ready-to-use content

| Field | Value |
| --- | --- |
| Live URL | `https://inquiry-island.vercel.app` |
| Grade 2 hub | `https://inquiry-island.vercel.app/grade-2` |
| Math showcase | `https://inquiry-island.vercel.app/lab/NC.2.NBT.1` |
| ELA showcase | `https://inquiry-island.vercel.app/lab/W.2.1` |
| Science showcase | `https://inquiry-island.vercel.app/lab/2.P.2.1` |

Auth: none required (guest mode, localStorage only). Leave Devpost login credentials blank.

### Evidence to keep

- Screenshot of live `/grade-2`
- Screenshot or recording of tools visible to the agent
- Confirmation that Devpost uses this exact URL

---

## 3. Devpost text description

### Rule satisfied

Official Rules §4 *Submission Requirements* — text description that explains:

1. Why the use case is a strong fit for WebMCP  
2. How it creates a better user experience  
3. What people and agents can do together that was difficult or impossible before  
4. Briefly how you implemented WebMCP  

### Why it matters

Required submission field. Also feeds Stage Two judging: **WebMCP Leverage**, **Execution**, **Potential Impact**, **Creativity & Ambition**.

### Done when

- [ ] All four points are covered in the Devpost description
- [ ] Copy uses the product name **Fun Lab** (not the old Inquiry Island name)
- [ ] Copy mentions real tools from this repo
- [ ] English only

### How to complete

1. Open Enter a Submission → Project description / “About the project”
2. Paste the block below
3. Optionally add 2–4 screenshots: hub, Place Value Lab, Opinion Builder, Matter Lab

### Ready-to-use content (paste into Devpost)

**Project name:** Fun Lab  

**Tagline:**  
NC Grade 2 Math, ELA & Science — hands-on labs kids share with an AI teammate via WebMCP.

**Full description:**

```text
## What is Fun Lab?

Fun Lab is a WebMCP-powered learning web app where a child and an AI teammate share the same manipulatives, writing board, and science sims. Built for the WebMCP Challenge around North Carolina Grade 2 standards (NCSCOS): playable standards across Math, ELA, and Science, with three showcase labs (Place Value, Opinion Builder, Matter Lab).

Live app: https://inquiry-island.vercel.app
Grade 2 hub: https://inquiry-island.vercel.app/grade-2

## Why this is a strong fit for WebMCP

Classroom/learning agents usually either chat in a side panel or scrape the DOM. Neither is safe or reliable for shared math blocks, opinion essays, or science classifications. WebMCP lets Fun Lab expose an explicit tool surface—curriculum navigation plus board actions—so the agent operates the same state the child sees, with schemas and child confirmations for reveal/reset/revision.

## How it creates a better user experience

- The child stays in a kid-first UI (Grade 2 hub → subject → lab) while the agent helps without hijacking the screen.
- Tools like request_hint and ask_guiding_question coach instead of spoiling; reveal_solution and reset_board require in-UI confirmation.
- Progress, Fun Points, and badges stay on-device (localStorage); guest mode collects no child PII.
- If WebMCP is off, the kid UI still works—agents are additive, not required.

## What people and agents can do together that was hard before

Together they can: pick a standard, read board state, place hundreds/tens/ones blocks, draft opinion reasons, classify matter and heat ice, run checks, undo, and suggest revisions—with the human confirming sensitive steps. Before WebMCP, that meant brittle UI automation or a disconnected chat that could not touch the board. Now both teammates act on one shared model.

## How we implemented WebMCP

We register tools with document.modelContext.registerTool in src/webmcp/register.ts:

Curriculum (always on): list_subjects, list_grades, list_standards, get_standard, search_standards, set_active_standard, get_progress, get_scoreboard

Lab (when a lab is active): get_board_state, apply_board_action, undo, run_check, request_hint, ask_guiding_question, reveal_solution, reset_board, and suggest_revision on Opinion Builder

Each tool has a JSON Schema input, execute handler wired to React app state, and unregister-on-unmount. Stack: Vite + React + TypeScript, hosted on Vercel.

## Judge quick start

1. Open https://inquiry-island.vercel.app in ChatGPT’s in-app browser (or Chrome with chrome://flags/#enable-webmcp-testing).
2. Go to /grade-2 (or /lab/NC.2.NBT.1).
3. Try: “Open Place Value Lab. Use tools to build 243 with hundreds, tens, and ones blocks, then run_check.”

Standards text is from NCSCOS with attribution to NC DPI; not endorsed by DPI or any district.
```

**Built with (tags):** WebMCP, React, TypeScript, Vite, Vercel, NCSCOS

### Evidence to keep

Copy of the final Devpost description after Save Draft / Submit.

---

## 4. Demo YouTube video

### Rule satisfied

Official Rules §4 *Submission Requirements* — demonstration video that:

- Is **less than three (3) minutes** (judges need not watch beyond 3:00)
- Includes a **clear demo** of the project functioning
- Includes **audio** covering what you built and how you used WebMCP
- Is uploaded and **publicly visible on YouTube**, with the link on the submission form
- Does **not** include third-party trademarks or copyrighted music/material without permission

### Why it matters

Required for a complete Submission. Primary evidence for judges who may not deep-test the live site.

### Done when

- [ ] Final cut ≤ 2:59
- [ ] Narration or on-mic audio explains Fun Lab + WebMCP
- [ ] Screen shows https://inquiry-island.vercel.app working
- [ ] At least one agent tool call is visible (ChatGPT tool use or Chrome WebMCP)
- [ ] YouTube visibility = **Public** or **Unlisted** (accessible via link; Public preferred)
- [ ] No copyrighted music; no unlicensed logos
- [ ] YouTube URL pasted into Devpost

### How to complete

1. Record against the **live** URL so the video matches the submission link.
2. Record with OBS, QuickTime, or Loom (export MP4).
3. Follow the shot list and script below.
4. Upload to YouTube → Title / description from ready-to-use content → Public.
5. Paste `https://youtu.be/________` into Devpost.

### Shot list

| Time | Visual | Audio focus |
| --- | --- | --- |
| 0:00–0:20 | Home or Grade 2 hub, **Fun Lab** brand visible | Pitch: kid + AI teammate, WebMCP Challenge |
| 0:20–0:45 | Navigate hub → Math → Place Value Lab | Human path: guest kid UI |
| 0:45–1:10 | Child (or you) places a few blocks manually | Shared board is the product |
| 1:10–1:35 | ChatGPT in-app browser (or Chrome) beside/over the lab | “WebMCP tools are registered on the page” |
| 1:35–2:10 | Agent calls `get_board_state` / `apply_board_action` / `run_check` | Narrate each tool; show board updating |
| 2:10–2:25 | Quick cut: Opinion Builder or Matter Lab | Breadth beyond one lab |
| 2:25–2:45 | Hub + closing frame with live URL + repo | Why WebMCP uniquely enables this |

### Spoken script (~2:30)

**0:00–0:20**  
“Hi — this is Fun Lab, our WebMCP Challenge project. It’s a Grade 2 learning app for North Carolina math, English, and science where a kid and an AI teammate share the same boards — not a chat bolted on the side.”

**0:20–1:10**  
“Here’s the kid experience. Guest mode, no child PII. From the Grade 2 hub I open Place Value Lab. I can move hundreds, tens, and ones myself. Progress and Fun Points stay in localStorage on this device.”

**1:10–2:20**  
“Now the WebMCP part. The page registers tools with `document.modelContext.registerTool`. In ChatGPT’s browser I’m asking the agent to read the board, apply actions to build two hundred forty-three, and run check. You can see the same blocks update that the child sees — curriculum tools like `set_active_standard`, and lab tools like `apply_board_action` and `run_check`. Hints and guiding questions coach; reveal and reset ask the child to confirm in the UI.”

**2:20–2:45**  
“Without WebMCP, an agent would guess at the DOM or work in a disconnected chat. With WebMCP, human and agent truly share one learning board. Thanks for judging Fun Lab — live demo and MIT source are linked on our Devpost.”

### Recording tips

- Prefer https://inquiry-island.vercel.app so the recording matches the submission link
- Mic check; keep background quiet; no music bed
- Zoom browser UI enough to read tool names
- Hard cap at 2:45 so encoding/title cards do not push past 3:00

### Ready-to-use YouTube metadata

**Title:**  
Fun Lab — WebMCP Challenge Demo (Kid + AI Shared Learning Boards)

**Description:**

```text
Fun Lab is a WebMCP-powered Grade 2 learning app (NC Math, ELA, Science) where kids and AI agents share manipulatives and boards via document.modelContext.registerTool.

Live: https://inquiry-island.vercel.app
Repo: https://github.com/asub927/inquiry-island
Devpost: WebMCP Challenge

Tools shown include set_active_standard, get_board_state, apply_board_action, and run_check.
```

**Visibility:** Public  
**Category:** Science & Technology  
**Kids mode:** Do **not** mark as “Made for Kids” if that restricts discoverability for judges; this is a developer demo.

### Evidence to keep

- YouTube link
- Local master MP4 backup
- Note of final runtime (e.g. 2:38)

---

## 5. Judge testing instructions

### Rule satisfied

Official Rules §4 *Testing*: access must be provided to a working Project for judging and testing via website/demo link; free of charge through the Judging Period.

### Why it matters

Clear instructions improve WebMCP Leverage and Execution scores even when judges also watch the video.

### Done when

- [ ] Instructions list live URL, WebMCP test environments, and 3 copy-paste agent prompts
- [ ] No login required
- [ ] Instructions match production routes and the name **Fun Lab**

### How to complete

Paste the block below into Devpost testing instructions (aligned with README).

### Ready-to-use content

```text
TESTING INSTRUCTIONS — Fun Lab

Live URL: https://inquiry-island.vercel.app
Grade 2 hub: https://inquiry-island.vercel.app/grade-2

How to enable WebMCP
1) Preferred: open the live URL inside ChatGPT’s in-app browser (WebMCP on by default).
2) Or Google Chrome 149+: enable chrome://flags/#enable-webmcp-testing, restart Chrome, open the live URL.

No login. Guest mode. Progress is localStorage only.

Suggested agent prompts
• Math: Open Place Value Lab. Use tools to build 243 with hundreds, tens, and ones blocks, then run_check.
• ELA: Help me write an opinion about recess. Add two reasons and a linking word; suggest one revision and wait for my confirm.
• Science: Classify the objects, heat the ice, predict the state, then run_check.

Deep links
• /lab/NC.2.NBT.1 — Place Value Lab
• /lab/W.2.1 — Opinion Builder
• /lab/2.P.2.1 — Matter Lab

Legacy redirects: /demo/math, /demo/ela, /demo/science

Source: https://github.com/asub927/inquiry-island (MIT)
```

### Evidence to keep

Screenshot of the Devpost testing-instructions field filled in.

---

## 6. Submission form assembly

### Rule satisfied

Official Rules §4: complete and enter **all required fields** on the Hackathon Website’s **Enter a Submission** page during the Submission Period (Aug 25, 2026 11:00am PT – Sep 3, 2026 1:00pm PT).

### Why it matters

A partial draft does not count. Everything above must land on one submitted entry before the deadline.

### Done when

- [ ] Status is **Submitted** (not only Saved Draft) before Sep 3, 2026 1:00pm PDT
- [ ] Every required field has a value
- [ ] Live URL, repo URL, license, video URL, and description are consistent and say **Fun Lab**

### How to complete — field map

| Devpost field | What to enter | Source section |
| --- | --- | --- |
| Project name | Fun Lab | — |
| Tagline | NC Grade 2 Math, ELA & Science — learn with your AI teammate via WebMCP | §3 |
| Project URL / Live demo | `https://inquiry-island.vercel.app` | §2 |
| Demo video | YouTube link | §4 |
| Repo URL | https://github.com/asub927/inquiry-island | Verified appendix |
| Open source license | MIT (detectable on GitHub) | Verified appendix |
| Description | Paste from §3 | §3 |
| Testing instructions | Paste from §5 | §5 |
| Built with | WebMCP, React, TypeScript, Vite, Vercel | §3 |
| Images | Hub + 1–3 lab screenshots | Capture from live site |
| Team | Your Devpost user / teammates | §1 |
| Opt-in emails / rules agree | Accept Official Rules | https://webmcp.devpost.com/rules |

Steps:

1. Finish §1, §3–§5 (live URL already ready)  
2. Enter a Submission → fill using the table  
3. **Save Draft** and click every link (live, repo, video) in a private window  
4. **Submit** before the deadline  
5. Immediately proceed to §7 freeze discipline  

### Evidence to keep

Screenshot of the submitted project page and confirmation email/notification if Devpost sends one.

---

## 7. Post-deadline freeze

### Rule satisfied

Official Rules §6 *Submission Modifications* and Resources FAQ: after the Submission Period ends **September 3, 2026 at 1:00pm PT**, do **not** change the Devpost submission, the submitted repository, or the live site until winners are announced. Editing during judging can risk eligibility. To keep building, **fork** the repo and work on the fork only.

### Why it matters

Eligibility risk after an otherwise valid submit.

### Done when

- [ ] Calendar reminder set for Sep 3, 2026 12:30pm PDT (“submit + freeze”)
- [ ] After submit: no pushes that change the judged demo, no production deploys that change behavior, no Devpost edits
- [ ] Any continued work happens on a **fork**

### How to complete

1. Submit on Devpost  
2. Tag the submitted commit: `git tag webmcp-submission-2026 && git push origin webmcp-submission-2026`  
3. Freeze Vercel production deploys for the judged project during judging, or avoid merging demo-changing PRs  
4. If you must fix a rules violation (IP, PII) only, wait for Sponsor/Devpost permission per §6  

### Ready-to-use content

Calendar title: `WebMCP FREEZE — do not edit Fun Lab Devpost/repo/prod`  
Date: Sep 3, 2026 1:00pm PDT → through winner announcement (~Sep 23, 2026).

### Evidence to keep

Tag name + commit SHA that matches what is deployed and linked on Devpost.

---

## 8. Optional hosting credits

### Rule satisfied

Official Rules §4 *How To Enter* (optional): registered Entrants may request free Netlify credits via the Google form while supplies last; request by **September 1, 2026 at 12:00pm PT**. Credits are not required to enter or win.

### Why it matters

Does **not** affect eligibility. Fun Lab is already hosted on **Vercel**; Netlify credits are optional and the request window may already be closed.

### Done when

- [ ] Form submitted before Sep 1, 2026 12:00pm PT **or** you consciously skip it
- [ ] Production remains reachable on the Devpost live URL through judging

### How to complete

Skip if the Sep 1 noon PT window has passed or you are staying on Vercel. If still open and desired: Official Rules cite https://forms.gle/xw75XGUQzCXEiALc7.

### Evidence to keep

Form confirmation (if used) or note that hosting is Vercel-only.

---

## Appendix A — Already met (verified in repo)

### A1. Public repository

- **Rule:** Public GitHub/GitLab/Bitbucket URL with all source, assets, and instructions  
- **Evidence:** https://github.com/asub927/inquiry-island  
- **Package / product name:** `funlab` / **Fun Lab**  
- **Instructions:** [`README.md`](../README.md)

### A2. Open-source license

- **Rule:** OSS license file detectable/visible on the repository  
- **Evidence:** MIT [`LICENSE`](../LICENSE)

### A3. WebMCP `registerTool` implementation

- **Rule:** Demonstrate `document.modelContext.registerTool({ name, description, inputSchema, execute })`  
- **Evidence:** [`src/webmcp/register.ts`](../src/webmcp/register.ts)  
- **Curriculum tools:** `list_subjects`, `list_grades`, `list_standards`, `get_standard`, `search_standards`, `set_active_standard`, `get_progress`, `get_scoreboard`  
- **Lab tools:** `get_board_state`, `apply_board_action`, `undo`, `run_check`, `request_hint`, `ask_guiding_question`, `reveal_solution`, `reset_board`, `suggest_revision`

### A4. Built during Submission Period

- **Rule:** New during Aug 25–Sep 3, 2026, or meaningfully extended with WebMCP in-period  
- **Evidence:** Initial commit 2026-08-26; project is new for this hackathon

### A5. Language

- **Rule:** Submission materials in English  
- **Evidence:** README, UI, and this guide are English

### A6. Theme fit

- **Rule:** WebMCP-powered web app where humans and agents interact/collaborate  
- **Evidence:** Shared boards + agent tools + kid UI

### A7. Working live URL

- **Evidence:** https://inquiry-island.vercel.app (Vercel)

---

## Appendix B — Judging criteria reminder (not pass/fail)

After eligibility, Stage Two weights these equally (Official Rules §7):

1. **WebMCP Leverage** — non-trivial `registerTool` surface  
2. **Execution** — coherent product (Grade 2 hub + labs + progress)  
3. **Potential Impact** — real learner audience, NC standards framing  
4. **Creativity & Ambition** — shared-board teammate vs chat sidebar  

Strengthen these with a video that *shows* tool calls on Fun Lab, not only slides.

---

## Appendix C — Final pre-submit checklist

- [ ] Devpost Join Hackathon done  
- [ ] Live URL verified in ChatGPT browser or Chrome WebMCP flag  
- [ ] GitHub Website field = `https://inquiry-island.vercel.app`  
- [ ] YouTube demo ≤3 min with audio, public, branded **Fun Lab**, no copyrighted music  
- [ ] Description includes all 4 required explanation bullets and says **Fun Lab**  
- [ ] Testing instructions pasted  
- [ ] Repo public + MIT visible  
- [ ] Submission status = Submitted  
- [ ] Freeze plan armed (§7)  

**Hard stop:** September 3, 2026 @ 1:00pm PDT.
