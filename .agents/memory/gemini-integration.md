---
name: Gemini AI Integration
description: Which Gemini model works, API key is free-tier, routes location, streaming pattern.
---

# Gemini AI Integration

## Working model
`gemini-2.5-flash` — confirmed working with this API key's quota.

**Why:** `gemini-2.0-flash` and `gemini-2.0-flash-lite` hit free-tier daily limit (limit: 0) after a few test calls. `gemini-2.5-flash` has separate quota and responded successfully.

## Routes
`artifacts/api-server/src/routes/ai.ts` — two endpoints:
- `POST /api/ai/chat` — SSE streaming chat using `startChat` + `sendMessageStream`
- `POST /api/ai/generate-image` — returns `{ thumbnail, enhancedPrompt }` (Gemini enhances prompt; thumbnail is Pexels placeholder since Gemini doesn't generate images)

Mounted at `artifacts/api-server/src/routes/index.ts` under `/ai`.

## Key constraint
GEMINI_API_KEY is free-tier — daily quota exhausts quickly under heavy testing. Production requires a paid Google AI Studio account.

## Streaming pattern
Chat uses SSE: `res.write("data: JSON\n\n")` for each chunk, then `data: {"done":true}\n\n`. Frontend uses `fetch` + `ReadableStream` reader to consume chunks.
