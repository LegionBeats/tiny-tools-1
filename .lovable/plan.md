Once you've minted the new PIT in GHL, here's the flow:

## Steps

1. **You** generate a Private Integration token in GHL:
   - Sub-Account → Settings → Private Integrations → Create
   - Scopes: `contacts.write` + `contacts.readonly` (minimum)
   - Same sub-account as `GHL_LOCATION_ID`

2. **I** open a secure form to update the `GHL_API_TOKEN` secret (via `update_secret`). You paste the new token there — never in chat.

3. **I** re-invoke `capture-lead` with the same test payload:
   ```json
   { "email": "audit-test+20260708@gmail.com", "artistId": "246791", "artistName": "Drake", "score": 95 }
   ```

4. **Branch on the response:**
   - `{ ok: true }` → done, lead capture is live.
   - `ghl_failed` status 400/422 → GHL accepted the auth but rejected the payload (most likely the three `customFields` keys don't exist in this location). I'll strip `customFields` from `supabase/functions/capture-lead/index.ts`, redeploy, retest.
   - `ghl_failed` status 401 again → token still not accepted. I'll stop and report, not loop.

No code changes unless step 4 hits the 400/422 branch.