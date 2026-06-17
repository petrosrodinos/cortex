# Task: Output Generation — PDF, Excel, Word, Charts, Images, Widgets

## Objective
Build the output generation pipeline that the AI agent invokes to produce rich deliverables: PDFs, Excel files, Word documents, charts (as images or JSON), AI-generated images, and interactive HTML/JS widgets. All outputs are uploaded to GCS and persisted as `Document` rows.

## Requirements
- The AI agent calls output tools the same way it calls integration tools
- Generated files are uploaded to GCS under `orgs/<organizationUuid>/documents/<uuid>.<ext>`
- File references are stored in the existing `Document` table (not a separate `GeneratedFile` model)
- Frontend can render previews inline (charts, tables, AI images) and download files
- PDF and Word support branding: logo, headers, footers
- Excel supports multi-sheet, charts, and formulas
- AI image generation uses the org's configured AI provider and API key (same routing as chat)
- Charts (`output__create_chart`) are data visualizations; images (`output__create_image`) are AI-generated graphics from a text prompt
- PDF/document **analysis** (read, extract, summarize uploaded files) is handled by `@openai/agents/sandbox` in task-06 — not by this module

## Subtasks

### Backend

- [ ] Prisma schema — extend existing `Document` model
  - Add `org_uuid: String` (required for org-scoped generated assets)
  - Add `execution_uuid: String?` (link back to `AgentExecution` when created by the agent)
  - Add `metadata: Json?` (e.g. `{ source: 'agent', outputTool, prompt }`)
  - Add `expires_at: DateTime?` (for temporary artifacts such as Code Interpreter outputs)
  - Extend `DocumentType` enum with `EXCEL`, `WORD`, `CHART`, `WIDGET` (keep existing `PDF`, `IMAGE`, `DOCUMENT`, `OTHER`)
  - Add `@@index([org_uuid])` and `@@index([execution_uuid])`
  - Run `prisma migrate dev`

- [ ] Output type → `DocumentType` mapping
  - PDF → `PDF`
  - Excel → `EXCEL`
  - Word → `WORD`
  - Chart PNG → `CHART`
  - AI image → `IMAGE`
  - Widget HTML → `WIDGET`
  - Generic/other → `OTHER`

- [ ] Output tool definitions — register these as internal tools in the AI agent (not integration tools):
  - `output__create_pdf` — `{ title, content_html, options?: { logo_url, footer_text } }`
  - `output__create_excel` — `{ sheets: [{ name, headers, rows, chart? }] }`
  - `output__create_word` — `{ title, sections: [{ heading, body }], tables?, images? }`
  - `output__create_chart` — `{ type: 'bar'|'line'|'pie'|'scatter', data, title, labels }`
  - `output__create_image` — `{ prompt, options?: { size?: '1024x1024'|'1792x1024'|'1024x1792', style?: 'vivid'|'natural', quality?: 'standard'|'hd' } }`
  - `output__create_table` — `{ headers, rows }` (inline markdown table for chat; no `Document` row)
  - `output__create_widget` — `{ html, js?, css? }` (sandboxed HTML snippet)

- [ ] PDF generator (`api/src/modules/outputs/generators/pdf.generator.ts`)
  - Use `puppeteer` (headless Chromium) for HTML-to-PDF conversion
  - Accepts `content_html` — AI generates the HTML with inline Tailwind classes
  - Injects logo, header, footer via template wrapper
  - Returns `Buffer`
  - Alternative: keep `WeasyPrint` as Python microservice if Puppeteer is too heavy

- [ ] Excel generator (`api/src/modules/outputs/generators/excel.generator.ts`)
  - Use `exceljs`
  - Supports: multiple sheets, column auto-width, bold headers, charts (ExcelJS chart API)
  - Returns `Buffer`

- [ ] Word generator (`api/src/modules/outputs/generators/word.generator.ts`)
  - Use `docx` (npm: `docx`)
  - Supports: headings, paragraphs, tables, images (base64)
  - Returns `Buffer`

- [ ] Chart generator (`api/src/modules/outputs/generators/chart.generator.ts`)
  - Use `chart.js` + `chartjs-node-canvas` (server-side rendering)
  - Returns PNG `Buffer` for inline image embedding or standalone file
  - Supported types: bar, line, pie, doughnut, scatter, area

- [ ] Image generator (`api/src/modules/outputs/generators/image.generator.ts`)
  - Use AI SDK `experimental_generateImage` with the org's configured provider
  - Provider routing via `AiProviderFactory` (same pattern as agent runner):
    - OpenAI: `dall-e-3`, `gpt-image-1` (or latest image model supported by `@ai-sdk/openai`)
    - Fallback: if org provider does not support image generation, return a structured tool error so the agent can explain the limitation
  - Input: `prompt` + optional `size`, `style`, `quality`
  - Returns PNG or WebP `Buffer`
  - Record generation cost in `ToolCall.cost_usd` (per-image pricing, not token-based)
  - Reject empty or excessively long prompts (max 4000 chars)

- [ ] `OutputsService` (`api/src/modules/outputs/outputs.service.ts`)
  - `generate(organizationUuid, userUuid, executionUuid, type, params)`:
    1. Call appropriate generator → `Buffer`
    2. Upload to GCS via `GcsAdapter.uploadImage()` (or a generic upload helper): `orgs/<organizationUuid>/documents/<uuid>.<ext>`
    3. Persist `Document` row: `uuid`, `org_uuid`, `user_uuid`, `execution_uuid`, `filename`, `mimetype`, `size`, `url`, `path`, `type`, `metadata`, `expires_at?`
    4. Return `{ documentUuid, filename, path, signedUrl }`
  - Image uploads use `contentType: image/png` (or `image/webp` when provider returns WebP)

- [ ] Output tool executor (`api/src/modules/outputs/output-tools.service.ts`)
  - Exposes output tools in OpenAI tool-calling format
  - Delegates to `OutputsService`
  - Registered as internal tools in `AgentRunner` (alongside integration tools)
  - `output__create_image` passes `organizationUuid` so the image generator can resolve the org's AI provider and decrypt API key server-side

- [ ] Documents module (`api/src/modules/documents/`)
  - `documents.service.ts`: list documents by org (filter `metadata.source = 'agent'` or all org docs), generate signed download URL from GCS, delete
  - `documents.controller.ts`: routes `/organizations/:organizationUuid/documents`
  - `GET /documents/:uuid/download` → redirect to signed URL (1h expiry)
  - Reuse existing `GcsAdapter` for upload/download; do not duplicate storage logic

### Frontend

- [ ] Message renderer: detect `outputType` in message metadata
  - `CHART` → render `<img>` inline from signed URL
  - `IMAGE` → render `<img>` inline from signed URL with lightbox on click
  - `TABLE` → render markdown table component
  - `FILE_PDF | FILE_EXCEL | FILE_WORD` → show file card with Download button (linked to `Document.uuid`)
  - `WIDGET` → render in sandboxed `<iframe srcdoc="...">`
- [ ] Files page: `app/src/pages/files/` — grid of `Document` cards with type icon, filename, size, created date
- [ ] Chart preview in message bubble (click to expand full-screen)
- [ ] Image preview in message bubble (click to expand full-screen; show prompt from `Document.metadata` if available)

## Technical Notes
- Analysis vs generation: use `@openai/agents/sandbox` (`code_interpreter`) to analyze existing PDFs/Word/Excel uploads; use `output__create_*` tools here only to produce new files
- Puppeteer binary adds ~300MB to Docker image — use `puppeteer-core` + `chrome-aws-lambda` for serverless, or pin full Puppeteer for VM-based deployments
- Charts embedded in PDF: generate chart PNG first (`chart.generator.ts`), base64-encode, inject as `<img src="data:...">` in HTML before PDF render
- AI images embedded in PDF/Word: generate image first (`image.generator.ts`), upload to GCS, inject via signed URL or base64 in document content
- Excel formulas: only inject safe formulas (whitelist); never eval user-supplied formula strings
- Widget sandboxing: store widget HTML as a `Document` with `type: WIDGET` and `mimetype: text/html`; never eval on server; frontend renders in `<iframe sandbox="allow-scripts">`
- Signed GCS URLs: 1-hour expiry; generate fresh on each `/download` request
- `Document.expires_at`: for temporary artifacts (e.g. Code Interpreter outputs), set 24h TTL; scheduled job in Phase 8 cleans up expired documents from GCS and DB
- Image generation cost: add per-model image pricing to `api/src/integrations/ai/utils/ai-pricing.ts` (e.g. per-image flat rate for DALL-E 3 standard vs HD)
- Content policy: surface provider moderation errors to the agent as structured tool failures; do not retry blocked prompts automatically
- `output-detector` (task-06): add `IMAGE` to output types; detect when `output__create_image` was called or user intent is "generate/draw/create an image"
- Agent messages should reference `documentUuid` in metadata/files array so the frontend can resolve previews and downloads from `Document`

## Acceptance Criteria
- [ ] Agent creates a PDF and the file card appears in chat with a working download link
- [ ] Agent creates an Excel file with two sheets and a chart; opens correctly in Excel
- [ ] Agent creates a Word document with a table and heading
- [ ] Agent creates a bar chart PNG that renders inline in chat
- [ ] Agent generates an image from a text prompt; PNG renders inline in chat with expand-on-click
- [ ] Every generated asset creates a `Document` row with correct `org_uuid`, `user_uuid`, `type`, and GCS `path`
- [ ] Generated image is stored in GCS under the org path and appears on the Files page with type `IMAGE`
- [ ] Image generation cost is recorded on the corresponding `ToolCall` row
- [ ] Files list page shows all org `Document` rows with correct types and sizes
- [ ] Expired documents are not downloadable (GCS signed URL expired or DB row deleted)
