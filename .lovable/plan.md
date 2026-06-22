# Marketing Tools — Plan

A single-page app on TanStack Start that hosts a growing collection of mini marketing tools. Ships with one tool today; the layout looks complete and intentional with just that one card.

## Answers to your two questions

**1. Future "tool that returns output and starts a chat"** — no special groundwork needed now. Each tool is a self-contained React component owning its own output region. Later, a tool's output area can host a chat panel inline, open a modal, or link to a dedicated route (`/tools/<tool>/chat`) without touching anything else. I'll keep the tool boundary clean so this is a drop-in later.

**2. Embedding on cheatcodecollective.com** — peeked at the site: it's a React + Tailwind app (looks like a Vite/Next-style React build, likely from emergent.sh). That means the tool components I write here are portable. Two realistic paths when you're ready:
  - **Lift the component over** — copy the tool's React component + its Tailwind classes into the CCC repo. The neumorphism tokens travel as a small CSS block. Cleanest result, no iframe.
  - **Embed via iframe** — point an `<iframe>` on a CCC page at a route on this app. Zero rebuild, but styling is sandboxed and sizing needs a little care.

  Either way: no rebuild from scratch. To keep portability easy, I'll keep each tool component free of app-shell dependencies (no router imports inside the tool itself).

## Design direction

Neumorphism (Soft UI) per the spec you pasted. Soft `#E0E5EC` canvas, dual-shadow extruded cards and buttons, generous rounding (`rounded-2xl`/`3xl`), Plus Jakarta Sans for UI + JetBrains Mono for the generated link, indigo `#6C63FF` accent for primary actions and focus rings. Subtle press-down on buttons, 1px lift on cards, no flat surfaces, no hard hex shadows.

## Page structure

```text
┌─────────────────────────────────────────────┐
│  Header                                     │
│    "Marketing Tools"                        │
│    short warm subtitle                      │
├─────────────────────────────────────────────┤
│  Tool card: SMS Opt-In Link & QR Generator  │
│    ├─ Tool header + subtitle                │
│    ├─ Inputs (phone + country, keyword)     │
│    ├─ Generate button                       │
│    └─ Output (link + copy, QR + download)   │
└─────────────────────────────────────────────┘
```

Centered single column, max width ~720px, padded for mobile. With one tool, the card sits as the hero — no empty slots, no "coming soon" placeholders.

## Tool #1 — SMS Opt-In Link & QR Code Generator

**Header**: "Grow Your SMS List" + "Generate a link and QR code that lets your audience subscribe to your texts in one tap."

**Inputs**
- *Your phone number* — country code dropdown (default US +1, plus CA, GB, AU, and a handful of common ones; searchable later) + phone number input. Light formatting as the user types.
- *Opt-in keyword* — text input, default `JOIN`, helper text: "This message gets pre-filled for your audience. Common choices: JOIN, YES, SUBSCRIBE".
- *Generate* — large neumorphic primary button.

**Output** (renders below after Generate, smooth reveal)
- *Link box* — neumorphic inset card showing the full `sms:` link in mono type, with a prominent **Copy Link** button (shows "Copied!" for ~1.5s). Label above: "Add this to your link in bio, website, funnels, landing pages, or anywhere online."
- *QR code* — large (≥ 240px), centered, on a neumorphic raised tile. **Download QR Code** button saves PNG. Two short suggestions beneath:
  - "Share it digitally — drop it on your website, emails, or social posts."
  - "Print it — add it to flyers, business cards, packaging, or handouts."

**Validation**: phone must have digits; if empty, button stays disabled with a quiet hint. No technical jargon surfaced.

## Architecture (technical section)

- **Stack**: existing TanStack Start + Tailwind v4. Home route `src/routes/index.tsx` renders the page.
- **Folder layout**:
  - `src/components/tools/ToolCard.tsx` — shared neumorphic card shell (header, subtitle, body slot).
  - `src/components/tools/SmsOptInTool/` — `index.tsx`, `PhoneInput.tsx`, `LinkOutput.tsx`, `QrOutput.tsx`, `countries.ts`.
  - `src/components/MarketingToolsPage.tsx` — page composition (header + tool list). Tools registered in a simple array so adding a new tool = add a component + push it to the array.
- **Design tokens**: neumorphism palette + shadows defined in `src/styles.css` via `@theme` (background `#E0E5EC`, accent `#6C63FF`, text `#3D4852`/`#6B7280`) plus a couple of `@utility` helpers for `extruded`, `inset`, `pressed` shadow recipes so components stay clean.
- **Fonts**: Plus Jakarta Sans + JetBrains Mono loaded via `<link>` in `src/routes/__root.tsx` head (per Tailwind v4 rule — no URL `@import`).
- **QR**: `qrcode.react` (renders to canvas; easy PNG export via `canvas.toDataURL('image/png')`).
- **Link format**: `sms:+<countrycode><digits>?body=<encodeURIComponent(keyword)>` — assembled client-side, no backend.
- **No backend needed**. Lovable Cloud stays off for this build.
- **Portability hook**: the `SmsOptInTool` component takes no props and has no router/data dependencies, so it can be dropped into CCC's codebase as-is later.

## What I'll skip (and why)

- No empty "more tools coming" slots — you asked for a complete look with one tool.
- No chat scaffolding yet — confirmed it doesn't constrain today's build.
- No iframe embed work for CCC — separate task when you're ready.

## Out of scope / future

- Adding more tools (each is its own component file + one line in the registry).
- Routing individual tools to their own pages if/when one needs a chat surface.
- CCC integration (lift-and-shift or iframe) when you give the go-ahead.
