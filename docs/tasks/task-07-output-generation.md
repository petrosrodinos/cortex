# Task: Output Generation — PDF, Excel, Word, Charts, Widgets

## Objective
Build the output generation pipeline that the AI agent invokes to produce rich deliverables: PDFs, Excel files, Word documents, charts (as images or JSON), and interactive HTML/JS widgets. All outputs are stored in GCS and referenced in the message.

## Requirements
- The AI agent calls output tools the same way it calls integration tools
- Generated files are uploaded to GCS under `orgs/<organizationUuid>/files/<uuid>.<ext>`
- File references are stored in `GeneratedFile` table
- Frontend can render previews inline (charts, tables) and download files
- PDF and Word support branding: logo, headers, footers
- Excel supports multi-sheet, charts, and formulas

## Subtasks

### Backend

- [ ] Prisma schema
  - Add `GeneratedFile` model (see plan.md domain model)
  - Run `prisma migrate dev`

- [ ] Output tool definitions — register these as internal tools in the AI agent (not integration tools):
  - `output__create_pdf` — `{ title, content_html, options?: { logo_url, footer_text } }`
  - `output__create_excel` — `{ sheets: [{ name, headers, rows, chart? }] }`
  - `output__create_word` — `{ title, sections: [{ heading, body }], tables?, images? }`
  - `output__create_chart` — `{ type: 'bar'|'line'|'pie'|'scatter', data, title, labels }`
  - `output__create_table` — `{ headers, rows }` (inline markdown table for chat)
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

- [ ] `OutputsService` (`api/src/modules/outputs/outputs.service.ts`)
  - `generate(organizationUuid, userId, executionId, type, params)`:
    1. Call appropriate generator → `Buffer`
    2. Upload to GCS: `orgs/<organizationUuid>/files/<uuid>.<ext>`
    3. Persist `GeneratedFile` row
    4. Return `{ fileId, filename, gcsPath, signedUrl }`

- [ ] Output tool executor (`api/src/modules/outputs/output-tools.service.ts`)
  - Exposes output tools in OpenAI tool-calling format
  - Delegates to `OutputsService`
  - Registered as internal tools in `AgentRunner` (alongside integration tools)

- [ ] Files module (`api/src/modules/files/`)
  - `files.service.ts`: list files by org, generate signed download URL from GCS, delete
  - `files.controller.ts`: routes `/organizations/:organizationUuid/files`
  - `GET /files/:id/download` → redirect to signed URL (1h expiry)

### Frontend

- [ ] Message renderer: detect `outputType` in message metadata
  - `CHART` → render `<img>` inline from signed URL
  - `TABLE` → render markdown table component
  - `FILE_PDF | FILE_EXCEL | FILE_WORD` → show file card with Download button
  - `WIDGET` → render in sandboxed `<iframe srcdoc="...">`
- [ ] Files page: `app/src/pages/files/` — grid of generated files with type icon, size, download
- [ ] Chart preview in message bubble (click to expand full-screen)

## Technical Notes
- Puppeteer binary adds ~300MB to Docker image — use `puppeteer-core` + `chrome-aws-lambda` for serverless, or pin full Puppeteer for VM-based deployments
- Charts embedded in PDF: generate chart PNG first (`chart.generator.ts`), base64-encode, inject as `<img src="data:...">` in HTML before PDF render
- Excel formulas: only inject safe formulas (whitelist); never eval user-supplied formula strings
- Widget sandboxing: store `html` in `GeneratedFile`, never eval on server; frontend renders in `<iframe sandbox="allow-scripts">`
- Signed GCS URLs: 1-hour expiry; generate fresh on each `/download` request
- `GeneratedFile.expires_at`: for temporary artifacts (e.g. Code Interpreter outputs), set 24h TTL; scheduled job in Phase 8 cleans up expired files from GCS and DB

## Acceptance Criteria
- [ ] Agent creates a PDF and the file card appears in chat with a working download link
- [ ] Agent creates an Excel file with two sheets and a chart; opens correctly in Excel
- [ ] Agent creates a Word document with a table and heading
- [ ] Agent creates a bar chart PNG that renders inline in chat
- [ ] Files list page shows all org-generated files with correct types and sizes
- [ ] Expired files are not downloadable (GCS signed URL expired or DB row deleted)
