Add a new client-side tool card to the marketing tools page that helps email senders generate a Gmail-search embed button for their subscribers. No backend or database required.

### What it does
- A visitor (the sender) enters:
  - From address: the email address their confirmation message is sent from
  - Subject keyword: the word that appears in the confirmation email subject line
  - Button text: what the embed button should say (default: "Find my confirmation email")
- The tool previews the button live and produces a copy-paste HTML snippet.
- The generated button opens Gmail with a pre-filled search like `from:sender@example.com subject:confirm`.

### Why it fits
- Matches the existing "no signup, instant output" pattern of the other tools.
- Pure client-side React + Tailwind, no Supabase table or server function needed.
- Complements the audience-growth tools with a subscriber-experience helper.

### Files to change

1. **Create `src/components/tools/FindMyEmailTool/index.tsx`**
   - New tool card component using `ToolCard`.
   - State: `fromAddress`, `subjectKeyword`, `buttonText`, `copied`.
   - Derive the Gmail search URL: `https://mail.google.com/mail/u/0/#search/from:<from>+subject:<keyword>`
   - Render a live button preview styled with the existing neu-extruded/neu-inset classes.
   - Render a `<textarea>` (or code block) with the paste-ready HTML snippet.
   - Copy-to-clipboard for the snippet.

2. **Edit `src/components/MarketingToolsPage.tsx`**
   - Import `FindMyEmailTool`.
   - Add it to the `tools` array after the existing cards.
   - Update the footer copy if needed (optional).

### UI details
- Use the same input styling as the other tools: `neu-inset-sm rounded-2xl px-4 py-3` with `focus:ring-[#6C63FF]`.
- Use the same primary button style: `neu-extruded-sm rounded-2xl`, purple accent text.
- Output section appears after valid input, animated like the SMS tool.
- Include a small explanation: "Paste this into your confirmation page or email so subscribers can jump straight to their Gmail search."

### Validation
- Require a valid-looking email in the from-address field before showing the snippet.
- Allow empty subject keyword but warn it may return too many results.
- No tracking, no storage, no server function.

### Verification
- Typecheck with `bunx tsgo --noEmit`.
- Manually test the generated link opens Gmail with the correct search query.
- Confirm the embed HTML copies correctly and the preview button renders in the neumorphic style.