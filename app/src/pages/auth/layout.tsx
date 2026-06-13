import Navbar from "@/components/layout/navbar";
import { Bot, Database, FileText, Search, Workflow } from "lucide-react";
import Logo from "@/components/brand/logo";
import { Outlet } from "react-router-dom";

const connectedSystems = [
  { label: "Apps", value: "CRM, finance, support", icon: Workflow },
  { label: "Data", value: "Warehouse and live tables", icon: Database },
  { label: "Knowledge", value: "Docs, policies, briefs", icon: FileText },
];

const agentTasks = [
  "Summarize pipeline risk across HubSpot and invoices",
  "Create a Q2 board report from connected data",
  "Draft a vendor renewal brief with source citations",
];

export default function AuthLayout() {
  return (
    <div className="flex h-full min-h-0 flex-col bg-background text-foreground">
      <Navbar />
      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto grid min-h-full w-full max-w-7xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_28rem] lg:items-center lg:px-10 lg:py-12">
          <section className="relative hidden min-h-[34rem] overflow-hidden rounded-2xl border border-border bg-surface p-8 shadow-[var(--shadow)] lg:flex lg:flex-col lg:justify-between">
            <div
              className="absolute inset-0 opacity-70"
              style={{
                background:
                  "radial-gradient(circle at 18% 14%, color-mix(in oklch, var(--accent) 20%, transparent), transparent 32%), linear-gradient(135deg, color-mix(in oklch, var(--surface-secondary) 92%, transparent), transparent 52%)",
              }}
            />

            <div className="relative max-w-2xl">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-accent-border bg-accent-bg px-3 py-1 text-xs font-medium text-foreground">
                <Logo size={16} />
                Intelligent operations workspace
              </div>

              <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-normal text-foreground">
                Connect every system your company runs on.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
                Ask natural-language questions, generate reports, create documents,
                analyze operational data, and automate work through AI agents that
                understand your apps, databases, documents, and knowledge.
              </p>
            </div>

            <div className="relative grid gap-4">
              <div className="rounded-xl border border-border bg-background/70 p-4">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-bg text-accent">
                      <Search className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Ask Cortex</p>
                      <p className="text-xs text-muted">Connected to company context</p>
                    </div>
                  </div>
                  <span className="rounded-md border border-border bg-surface-secondary px-2 py-1 text-xs text-muted">
                    Agent ready
                  </span>
                </div>
                <div className="rounded-lg border border-border bg-surface px-3 py-3 text-sm text-foreground">
                  Which accounts need attention before month-end close?
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {connectedSystems.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="rounded-xl border border-border bg-background/60 p-3">
                    <Icon className="mb-3 h-4 w-4 text-accent" />
                    <p className="text-sm font-medium text-foreground">{label}</p>
                    <p className="mt-1 text-xs leading-5 text-muted">{value}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-border bg-background/60 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                  <Bot className="h-4 w-4 text-accent" />
                  Suggested agent work
                </div>
                <div className="space-y-2">
                  {agentTasks.map((task) => (
                    <div key={task} className="rounded-lg bg-surface-secondary px-3 py-2 text-xs leading-5 text-muted">
                      {task}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="mx-auto flex w-full max-w-md flex-col justify-center">
            <div className="mb-8 space-y-4 text-center lg:text-left">
              <div className="flex items-center justify-center gap-2 lg:justify-start">
                <Logo size={40} showWordmark wordmarkClassName="text-xl font-semibold" />
              </div>
              <div>
                <p className="text-2xl font-semibold tracking-normal text-foreground">
                  Your AI business operating system
                </p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Sign in to search company knowledge, coordinate agents, and move work
                  across every connected system.
                </p>
              </div>
            </div>
            <Outlet />
          </section>
        </div>
      </main>
    </div>
  );
}
