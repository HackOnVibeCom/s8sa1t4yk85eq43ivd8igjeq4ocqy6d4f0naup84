# HackOnVibe 2026 — Customer journey video

**Required duration:** Five minutes
**Recording style:** Real user journey, not a slide-only presentation.
**Voice workflow:** Not confirmed end to end. Use text for the assistant unless microphone permission, recognition, response playback and turn-taking have all been tested in the recording browser.

## Five-minute storyboard

### Scene 1 — The problem (0:00–0:35)

- **Screen:** Presenter briefly on camera or a real-world arrival/planning context, then the CANIGO landing page.
- **Exact actions:** Describe trying to plan a visit without knowing entrance, route or facility details; open CANIGO.
- **Suggested narration:** "Before a visit, a generic accessibility label may not tell someone whether the entrance, route or facilities will work for them. CANIGO is designed to put practical observations and their evidence in one place."
- **Expected result:** Viewers understand the planning problem and see the actual product.
- **Capture requirement:** Record the opening and landing page in the same take; avoid private account or location data.
- **Fallback:** Narrate over a live landing-page capture. Do not use fabricated user testimony or statistics.

### Scene 2 — Discover CANIGO (0:35–1:10)

- **Screen:** Landing page, available location/search interface, venue discovery results and accessibility filter controls.
- **Exact actions:** Enter a location or use the available sample context; open the results; interact only with filters confirmed to change the displayed results.
- **Suggested narration:** "I can start with the place I am planning to visit and narrow the available results by access information. This build uses a limited sample dataset, so these results are a prototype rather than a complete city directory."
- **Expected result:** A judge sees the actual discovery UI and understands its data limits.
- **Capture requirement:** Keep the query, visible results and active filter legible.
- **Fallback:** If search or a filter is not functional, show the existing sample results and explain the limitation instead of pretending it worked.

### Scene 3 — Make an informed decision (1:10–2:00)

- **Screen:** A venue detail page with attributes, photographs and any evidence/status labels actually present.
- **Exact actions:** Open one available venue; inspect listed entrance/route/facility information; open the associated images; point out what is and is not evidenced.
- **Suggested narration:** "Here I can review the listed attributes and the images attached to this sample venue. A photo or community observation is useful context, not a guarantee that every person's needs will be met."
- **Expected result:** The judge sees a concrete venue view and understands evidence boundaries.
- **Capture requirement:** Capture the venue name, attributes and evidence labels without implying that sample content is independently verified.
- **Fallback:** If a status label or photo does not load, show the available detail page and state that the current sample lacks that evidence.

### Scene 4 — Contribute to the community (2:00–2:50)

- **Screen:** Contribution form, from venue selection through observation/evidence steps.
- **Exact actions:** Open the contribution form; enter a short non-sensitive sample observation; select a synthetic or authorized image if upload works; review the final step. Submit only if the target Supabase environment has been tested and the recording is intended to create a real record.
- **Suggested narration:** "A community member can describe an observation and attach evidence. This build has a multi-step contribution interface, but the full cloud persistence path is still being verified."
- **Expected result:** Viewers understand how a contribution is prepared and see its current status.
- **Capture requirement:** Use only a synthetic/authorized photo; do not show personal data, an actual user's image without permission, or secret configuration.
- **Fallback:** If upload or persistence is unavailable, demonstrate the form without submitting and explicitly call it a prototype interaction.

### Scene 5 — Trust and verification (2:50–3:30)

- **Screen:** Community feedback/evidence view and, if properly configured, the relevant moderation screen.
- **Exact actions:** Show the available observation, feedback and report controls. Interact only with controls whose behavior has been checked; do not imply that local UI state is a persisted vote or moderator decision.
- **Suggested narration:** "Community feedback can add context and flag information for review. In this prototype, some confirmation, helpfulness and report interactions are local or incomplete; AI does not verify claims."
- **Expected result:** Judges see the intended trust loop and its current limitations.
- **Capture requirement:** Show the difference between community observation and any actual review status.
- **Fallback:** If no moderator account or persisted record is available, show the interface and describe the intended workflow as a next step, not an operating service.

### Scene 6 — Gemini AI assistant (3:30–4:30)

- **Screen:** CANIGO assistant, with a visible text conversation.
- **Exact actions:** Ask a realistic question answerable from available app context, such as "What accessibility information is listed for this venue?" Review the answer. Optionally demonstrate one safe, supported navigation action if it has been tested.
- **Suggested narration:** "The assistant uses Gemini to help people interact with CANIGO's available information. Its response is not an accessibility audit, and the current integration is not a live streaming voice model."
- **Expected result:** The judge sees an actual successful response from the deployed or configured app.
- **Capture requirement:** Use text by default. Demonstrate voice only after a successful test in the same browser with permission granted; keep a text fallback ready.
- **Fallback:** If the request fails, do not stage or fabricate a response. State that the Gemini endpoint needs configuration/verification and continue with the text-only explanation or omit the failed interaction.

### Scene 7 — Impact and closing (4:30–5:00)

- **Screen:** Return to venue details or the landing page; optionally show the contribution pathway.
- **Exact actions:** Summarize who the product is for, its intended value and the next step for community growth.
- **Suggested narration:** "CANIGO aims to help people plan with more practical access context and to make community observations easier to share. The next step is validating the complete experience with users, maintaining reliable data and making the report and verification workflow robust."
- **Expected result:** A concise close that connects the product to its intended impact without unsupported claims.
- **Capture requirement:** End on the real product and a clear CANIGO name.
- **Fallback:** If a live integration failed, mention the limitation and close on the verified part of the application.

## Recording preparation checklist

- Confirm the final five-minute storyboard and keep the total runtime within the organizer's requirement.
- Obtain and test the actual deployment URL; do not use localhost in the final submission.
- Test the primary user journey as a signed-out external visitor.
- Prepare an authorized Supabase citizen account if sign-in is needed; no shared demo credentials exist in the frontend.
- Confirm sample data is clearly described as sample data.
- Verify the Gemini endpoint with a real, non-sensitive text request before recording Scene 6.
- Use text-first AI interaction unless voice works reliably in the exact browser/device.
- If testing voice: confirm browser support, microphone permission, intelligible recognition, spoken response and text fallback.
- Close unrelated tabs and hide notifications, personal data and developer tools containing secrets.
- Use readable zoom, visible pointer movement and captions/subtitles where possible.
- Do not show API keys, `.env`, private dashboards or unapproved user photos.

## Browser and demo account

Use an up-to-date browser on a device matching the expected judge experience. Test a private window to check the signed-out public path, and a separate account session for authenticated flows. Create a citizen account through the configured Supabase signup flow if required; do not invent or hardcode demo credentials. An admin account is not part of the public demo.

## Test data and audio

Use the existing sample venue data or synthetic content. Never submit a real contribution while recording unless the Supabase project and downstream visibility have been approved. Test microphone input, output volume and response playback before capture. Keep text as the fallback path.

## Editing and export

- Prefer a continuous real interaction; use concise cuts only to remove waiting or setup.
- Add captions and label any sample/mock information.
- Do not splice a failed assistant interaction into a fabricated successful one.
- Keep narration clear and avoid background music that masks speech.
- Export a readable 1080p MP4 if accepted by the organizer's upload service; follow the dashboard's actual format/size rules if different.
- Watch the exported file from start to finish and confirm the duration, sound, captions and absence of secrets.

## Upload and final link

Upload the finished video to the public video host or submission upload location specified by HackOnVibe (check the dashboard/organizer instructions). Ensure the public share permission works in a signed-out browser. Paste that real public URL into the HackOnVibe **Customer Journey** submission field.

**Final video URL:** `[PASTE THE PUBLIC VIDEO URL HERE AFTER UPLOAD]`

The storyboard is not a recorded video and this placeholder is not a submitted URL.

## Team

| GitHub username | Team member | Designation |
|---|---|---|
| `KanishJebaMathewM` | Kanish Jeba Mathew M | Team Lead |
| `tharunrajcse` | Tharun Raj S | Not specified |
| `MadheshLoganathan123` | L. Madhesh | Not specified |
