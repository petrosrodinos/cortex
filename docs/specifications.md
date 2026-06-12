# AI-Powered Business Operations Copilot Platform

## Objective

Build a multi-tenant SaaS platform using **React**, **NestJS**, **Prisma**, and **PostgreSQL** that allows businesses to connect their internal and external systems, then interact with them through AI using natural language.

The platform should function as an AI business copilot capable of retrieving information, performing actions across connected systems, generating files and reports, executing code safely, and producing rich outputs by orchestrating one or more integrations through AI tool calling.

Do not generate example code. Focus on architecture, scalability, maintainability, security, database design, API design, permissions, AI orchestration, and implementation strategy.

---

# Core Concept

Users connect business applications, databases, and APIs to an organization.

The AI assistant should be able to:

- Understand the user's request.
- Determine which integrations are required.
- Call one or multiple tools/integrations.
- Aggregate and transform results.
- Generate the most appropriate response format.

Example requests:

- "Show me the top 10 customers from Stripe and create an Excel report."
- "Compare last month's HubSpot leads with closed Stripe subscriptions."
- "Summarize all GitHub issues assigned to John and send me a PDF."
- "Generate a chart showing revenue growth from my PostgreSQL database."
- "Create a dashboard widget showing support tickets by priority."
- "Search Notion and Google Drive for onboarding documents and summarize them."

---

# Technology Stack

## Frontend

- React
- TypeScript
- Tailwind
- TanStack Query
- Zustand
- Hero UI

## Backend

- NestJS
- Prisma
- PostgreSQL

## AI

- OpenAI SDK
- AI SDK
- OpenAI Tool Calling
- Multi-tool orchestration
- Structured Outputs
- Function Calling

## Agent Framework

Use:

- @openai/agents
- @openai/agents/sandbox
- Code Interpreter

Agents must be capable of:

- Calling integrations
- Querying databases
- Executing code in isolated sandboxes
- Performing data transformations
- Creating reports
- Generating files
- Producing visualizations

---

# Multi-Tenant Architecture

## Accounts

A user account represents a person.

A single user may:

- Own multiple organizations.
- Belong to multiple organizations.
- Be an employee in other organizations.
- Switch between organizations from the UI.

## Organization Switching

A user can:

- Own Organization A.
- Be an employee of Organization B.
- Be an employee of Organization C.

The application must provide an organization/account switcher in the left sidebar that allows instant switching between accessible organizations.

Permissions and available integrations must update based on the currently selected organization.

---

# Organizations

Each organization should have:

- Name
- Members
- Roles
- Permissions
- Integrations
- AI Settings
- Billing Settings
- Audit Logs

Organizations must be completely isolated from one another.

No data leakage between organizations is allowed.

---

# Role-Based Access Control

Support granular RBAC.

Examples:

### Organization Owner

- Full access

### Admin

- Manage members
- Manage integrations
- Configure AI settings

### Manager

- Use integrations
- Create reports
- Manage limited resources

### Employee

- Limited AI usage
- Access only assigned tools

### Custom Roles

Organizations should be able to create custom roles with fine-grained permissions.

Examples:

- Can query Stripe
- Can use GitHub tools
- Can create PDFs
- Can access CRM data
- Can execute Code Interpreter
- Can manage API keys

---

# Integrations System

Create a generic integration framework.

All integrations should share a common architecture while allowing provider-specific capabilities.

---

# Supported Integrations

## SaaS Applications

- GitHub
- Slack
- Intercom
- Stripe
- HubSpot
- Linear
- Notion
- Google Drive
- smtp
- gmail
- Posthog

Additional providers should be easy to add later.

---

## Database Integrations

Support:

### SQL Databases

- PostgreSQL
- MySQL

### NoSQL Databases

- MongoDB

Users should be able to:

- Provide connection strings.
- Configure connection settings.
- Test connectivity.
- Select accessible schemas/databases.
- Configure permissions.

The platform should automatically inspect schemas using the appropriate libraries and metadata APIs.

The AI should receive structured schema information so it can generate safe and accurate queries.

The system must support multiple databases per organization.

Each database should have:

- Name
- Description
- Connection settings
- Schema metadata (keep in mind the schema can often change so we need to keep in sync before each query)
- Allowed operations

Examples:

- Production Database
- Analytics Database
- Customer Database

The AI must understand which database to use based on user intent.

---

## OpenAPI Integrations

Users should be able to connect any system by providing:

- OpenAPI URL
- Swagger URL
- OpenAPI JSON specification

The platform should:

- Parse specifications.
- Generate tools automatically.
- Generate authentication settings.
- Create AI-callable actions.

Supported authentication:

- API Key
- Bearer Token
- OAuth2
- Custom Headers

---

# Integration Permissions

For every integration, administrators should be able to enable or disable specific actions.

Examples:

GitHub:

- Read repositories
- Create issues
- Update issues
- Merge pull requests

Stripe:

- Read customers
- Read subscriptions
- Create refunds

Databases:

- Read data
- Insert data
- Update data
- Delete data

AI agents must only have access to explicitly enabled actions.

---

# AI Provider Management

Each organization should be able to configure its own AI providers.

Supported providers:

- OpenAI
- Claude
- Grok

Each organization can store:

- API Keys
- Default Model
- Model Routing Rules
- Usage Limits

Examples:

- OpenAI for reasoning
- Claude for long-context analysis
- Grok for specific workflows

The AI orchestration layer should support provider switching without changing application code.

---

# AI Agent Orchestration

The AI system should:

1. Analyze user intent.
2. Determine required tools.
3. Execute tools sequentially or in parallel.
4. Aggregate results.
5. Generate final output.

Support:

- Single-tool workflows
- Multi-tool workflows
- Multi-step reasoning
- Tool chaining
- Human approval workflows
- Long-running tasks

---

# Output Types

The AI must be capable of producing multiple response formats.

## Text

- Markdown
- Structured summaries
- Reports

## Files

- PDF
- Excel
- Word Documents

## Visualizations

- Charts
- Tables
- Dashboards

## Interactive Content

- Widgets
- HTML/CSS/JavaScript Components

## Media

- Images
- Generated graphics

The AI should automatically select the best format based on the request.

---

# Document Generation

## PDF

Use:

- WeasyPrint
- ReportLab

Generate professional business-quality PDFs.

Support:

- Branding
- Headers
- Footers
- Charts
- Tables
- Images
- Page numbering
- Multi-page reports

## Excel

Support:

- Multiple sheets
- Charts
- Formulas
- Pivot tables

## Word

Support:

- Rich formatting
- Images
- Tables
- Structured reports

---

# File Storage

Use the existing Google Cloud Storage implementation.

Store:

- Generated files
- Uploaded files
- Temporary artifacts
- Reports
- Charts
- Agent outputs

Requirements:

- Organization isolation

---

# Security Requirements

Implement enterprise-grade security.

Include:

- Encryption at rest
- Encryption in transit
- Secret management
- Audit logging
- API key protection
- Rate limiting
- Data isolation
- Permission validation

AI agents must never gain access to resources outside their authorized organization.

---

# Observability & Monitoring

Include:

- Agent execution logs
- Tool call logs
- Cost tracking
- Token tracking
- Usage analytics

Administrators should be able to inspect every AI action and tool execution.

---

# Scalability Requirements

The architecture must support:

- Thousands of organizations
- Millions of tool executions
- Hundreds of integrations
- Long-running workflows
- Background jobs using Bullmq with real time completion notification to the frontend
- Horizontal scaling

Design for production deployment from day one.

---

# Deliverables

Provide:

1. Complete system architecture.
2. Folder structure.
3. Domain-driven module structure.
4. Prisma schema design.
5. Database entities and relationships.
6. RBAC architecture.
7. Integration framework design.
8. AI orchestration architecture.
9. Agent architecture.
10. OpenAPI integration architecture.
11. Database integration architecture.
12. Security architecture.
13. File generation architecture.
14. Background jobs architecture.
15. Scalability considerations.
16. API design recommendations.
17. Potential bottlenecks and mitigation strategies.
18. Future expansion strategy.

Focus on clean architecture,clean folder structure, reusable code,reusable components,non duplicate code, extensibility, maintainability, multi-tenancy, and enterprise-grade production readiness.
