import { Link } from 'react-router-dom';
import { ShieldCheck, ScrollText, BarChart2, Building2 } from 'lucide-react';
import Logo from '@/components/brand/logo';
import { Routes } from '@/routes/routes';
import { useThemeContext } from '@/components/providers/theme-provider';
import { C, INTEGRATIONS } from './tokens';
import { DemoTerminal } from './components/demo-terminal';
import { AgentMock } from './components/agent-mock';
import { FeatureRow } from './components/feature-row';
import { ConversationMock } from './components/conversation-mock';
import { BoardMock } from './components/board-mock';
import { WidgetMock } from './components/widget-mock';

const GLOBAL_STYLES = `
  @keyframes lp-marquee {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }
  @keyframes lp-blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
  .lp-cursor::after {
    content: '|';
    display: inline;
    animation: lp-blink 1s step-end infinite;
    color: var(--accent);
    margin-left: 1px;
  }
  .lp-marquee {
    display: flex;
    animation: lp-marquee 32s linear infinite;
    width: max-content;
  }
  .lp-nav-link {
    color: var(--muted);
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: color 150ms ease-out;
  }
  .lp-nav-link:hover { color: var(--foreground); }
  .lp-btn-primary {
    background: var(--accent);
    color: var(--accent-foreground);
    border: none; border-radius: 8px;
    height: 36px; padding: 0 16px;
    font-size: 13px; font-weight: 600;
    cursor: pointer; text-decoration: none;
    display: inline-flex; align-items: center; gap: 6px;
    transition: opacity 150ms ease-out, box-shadow 150ms ease-out;
    white-space: nowrap;
    box-shadow: 0 1px 3px color-mix(in oklch, var(--accent) 40%, transparent);
    letter-spacing: 0.01em;
  }
  .lp-btn-primary:hover {
    opacity: 0.88;
    box-shadow: 0 4px 12px color-mix(in oklch, var(--accent) 35%, transparent);
  }
  .lp-btn-ghost {
    background: transparent;
    color: var(--muted);
    border: none;
    border-radius: 8px; height: 36px; padding: 0 14px;
    font-size: 13px; font-weight: 500;
    cursor: pointer; text-decoration: none;
    display: inline-flex; align-items: center;
    transition: background 150ms ease-out, color 150ms ease-out;
    white-space: nowrap;
  }
  .lp-btn-ghost:hover {
    background: var(--surface-secondary);
    color: var(--foreground);
  }
  .lp-theme-toggle {
    display: inline-flex; align-items: center; justify-content: center;
    width: 34px; height: 34px; border-radius: 8px;
    background: transparent; border: none;
    color: var(--muted); cursor: pointer;
    transition: background 150ms ease-out, color 150ms ease-out;
    flex-shrink: 0;
  }
  .lp-theme-toggle:hover {
    background: var(--surface-secondary);
    color: var(--foreground);
  }
  .lp-feature-row {
    display: flex;
    gap: 64px;
    align-items: center;
  }
  @media (max-width: 800px) {
    .lp-feature-row { flex-direction: column !important; gap: 32px; }
    .lp-feature-text, .lp-feature-visual { flex: none !important; max-width: 100% !important; }
    .lp-hero-grid { grid-template-columns: 1fr !important; }
    .lp-nav-links { display: none !important; }
    .lp-enterprise-grid { grid-template-columns: 1fr 1fr !important; }
  }
  @media (max-width: 520px) {
    .lp-enterprise-grid { grid-template-columns: 1fr !important; }
  }
`;

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

const ENTERPRISE_ITEMS = [
  {
    icon: ShieldCheck,
    title: 'Role-based access',
    body: 'Owner, admin, manager, and employee roles with granular permissions on every resource.',
  },
  {
    icon: ScrollText,
    title: 'Audit logs',
    body: 'Every action recorded with actor, timestamp, and outcome. Export on demand.',
  },
  {
    icon: BarChart2,
    title: 'Usage tracking',
    body: 'Token consumption and cost per user, agent, and integration — always visible.',
  },
  {
    icon: Building2,
    title: 'Multi-organization',
    body: 'Manage multiple org workspaces from one account. Context never bleeds across boundaries.',
  },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function LandingPage() {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <div
      id="lp-scroll-root"
      style={{
        background: C.bg, color: C.fg,
        overflowY: 'auto', overflowX: 'hidden', height: '100%',
        scrollBehavior: 'smooth',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />

      {/* ── NAV ── */}
      <header style={{ position: 'sticky', top: '12px', zIndex: 100, padding: '0 20px' }}>
        <nav style={{
          maxWidth: '1100px', margin: '0 auto',
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: '16px', padding: '0 20px', height: '52px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: `color-mix(in oklch, ${C.accent} 28%, oklch(0 0 0 / 0.50)) 0 4px 24px -6px`,
        }}>
          <Logo showWordmark size={22} />
          <div className="lp-nav-links" style={{ display: 'flex', gap: '24px' }}>
            <button onClick={() => scrollTo('features')} className="lp-nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Features</button>
            <button onClick={() => scrollTo('integrations')} className="lp-nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Integrations</button>
            <button onClick={() => scrollTo('enterprise')} className="lp-nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Enterprise</button>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              className="lp-theme-toggle"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
            <Link to={Routes.auth.sign_in} className="lp-btn-ghost">Sign in</Link>
            <Link to={Routes.auth.sign_up} className="lp-btn-primary">Get started</Link>
          </div>
        </nav>
      </header>

      {/* ── HERO ── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '88px 20px 72px' }}>
        <div className="lp-hero-grid" style={{
          display: 'grid', gridTemplateColumns: '1fr 1.15fr',
          gap: '72px', alignItems: 'center',
        }}>
          <div>
            <p style={{
              fontSize: '11px', fontWeight: 500,
              letterSpacing: '0.09em', textTransform: 'uppercase',
              color: C.accent, margin: '0 0 22px',
            }}>
              AI business operating system
            </p>
            <h1 style={{
              fontSize: 'clamp(38px, 5.2vw, 62px)',
              fontWeight: 600, lineHeight: 1.08,
              letterSpacing: '-0.025em', color: C.fg, margin: '0 0 22px',
            }}>
              Every system.<br />
              One conversation.
            </h1>
            <p style={{
              fontSize: '17px', lineHeight: 1.65,
              color: C.muted, margin: '0 0 36px', maxWidth: '400px',
            }}>
              Connect your CRM, databases, finance tools, and more.
              Ask questions in plain language and get answers — and
              take actions — without switching tabs.
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Link
                to={Routes.auth.sign_up}
                className="lp-btn-primary"
                style={{ height: '42px', padding: '0 22px', fontSize: '14px' }}
              >
                Start for free
              </Link>
              <button
                onClick={() => scrollTo('features')}
                className="lp-btn-ghost"
                style={{ height: '42px', padding: '0 18px', fontSize: '14px' }}
              >
                See how it works
              </button>
            </div>
          </div>
          <DemoTerminal />
        </div>
      </section>

      {/* ── INTEGRATIONS STRIP ── */}
      <section id="integrations" style={{
        borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`,
        padding: '20px 0', overflow: 'hidden', position: 'relative',
      }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, width: '100px', height: '100%', zIndex: 2,
          background: `linear-gradient(to right, ${C.bg}, transparent)`,
        }} />
        <div style={{
          position: 'absolute', right: 0, top: 0, width: '100px', height: '100%', zIndex: 2,
          background: `linear-gradient(to left, ${C.bg}, transparent)`,
        }} />
        <div className="lp-marquee">
          {INTEGRATIONS.map((name, i) => (
            <span key={i} style={{
              display: 'inline-flex', alignItems: 'center', gap: '24px',
              padding: '0 24px', color: C.muted,
              fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap',
            }}>
              {name}
              <span style={{ color: C.border }}>·</span>
            </span>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ maxWidth: '1100px', margin: '0 auto', padding: '96px 20px' }}>
        <FeatureRow
          label="Conversations"
          heading="Ask anything across your stack."
          description="Natural-language queries that span every connected system. No SQL, no switching tabs, no copying data between tools. Just ask."
          detail={[
            'Queries multiple integrations simultaneously and merges results.',
            'Understands context from previous messages in the same conversation.',
            'Returns formatted answers with source references.',
          ]}
          visual={<ConversationMock />}
        />

        <div style={{ borderTop: `1px solid ${C.border}`, margin: '80px 0' }} />

        <FeatureRow
          label="Widgets"
          heading="Turn data into visuals, instantly."
          description="Ask Cortex to visualize your data and it generates an interactive widget — charts, KPI dashboards, tables — right inside the conversation."
          detail={[
            'Generated from your actual connected data, not sample data.',
            'Interactive HTML widgets, expandable to full screen.',
            'Save directly to a board or share with your team.',
          ]}
          visual={<WidgetMock />}
          reverse
        />

        <div style={{ borderTop: `1px solid ${C.border}`, margin: '80px 0' }} />

        <FeatureRow
          label="Agents"
          heading="Automate what repeats."
          description="Define agents that run on a schedule — pulling data, generating reports, sending summaries. Configure once, let the work happen."
          detail={[
            'Cron-based scheduling with natural-language task definitions.',
            'Agents can chain tool calls across multiple integrations.',
            'Execution logs for every run, with individual step output.',
          ]}
          visual={<AgentMock />}
        />

        <div style={{ borderTop: `1px solid ${C.border}`, margin: '80px 0' }} />

        <FeatureRow
          label="Document boards"
          heading="A shared surface for what matters."
          description="Boards are your team's shared document library — organized by topic, accessible to everyone with access. Import directly from a conversation or upload from anywhere."
          detail={[
            'Pull reports, charts, and files out of conversations and into a board in one click.',
            'Upload any file — PDFs, spreadsheets, exports — from outside Cortex.',
            'Shared across your organization with permission controls.',
          ]}
          visual={<BoardMock />}
          reverse
        />
      </section>

      {/* ── ENTERPRISE ── */}
      <section id="enterprise" style={{ borderTop: `1px solid ${C.border}`, background: C.surface }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '72px 20px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 600, color: C.fg, margin: '0 0 8px' }}>
            Built for teams that take operations seriously
          </h2>
          <p style={{
            fontSize: '15px', color: C.muted,
            margin: '0 0 44px', maxWidth: '480px', lineHeight: 1.6,
          }}>
            Enterprise-grade control and visibility, without the procurement overhead.
          </p>
          <div className="lp-enterprise-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1px', background: C.border,
            border: `1px solid ${C.border}`, borderRadius: '12px', overflow: 'hidden',
          }}>
            {ENTERPRISE_ITEMS.map(({ icon: Icon, title, body }) => (
              <div key={title} style={{ background: C.surface, padding: '28px 24px' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '8px',
                  background: C.accentBg, border: `1px solid ${C.accentBorder}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '16px',
                }}>
                  <Icon size={16} color={C.accent} strokeWidth={1.75} />
                </div>
                <p style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: 600, color: C.fg }}>
                  {title}
                </p>
                <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.6, color: C.muted }}>
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ maxWidth: '600px', margin: '0 auto', padding: '96px 20px', textAlign: 'center' }}>
        <h2 style={{
          fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 600, lineHeight: 1.15,
          letterSpacing: '-0.02em', color: C.fg, margin: '0 0 16px',
        }}>
          Stop switching tabs.<br />Start knowing things.
        </h2>
        <p style={{ fontSize: '16px', color: C.muted, margin: '0 0 36px', lineHeight: 1.65 }}>
          Connect your first integration in minutes.
          No deployment, no configuration overhead.
        </p>
        <Link
          to={Routes.auth.sign_up}
          className="lp-btn-primary"
          style={{ height: '42px', padding: '0 28px', fontSize: '14px' }}
        >
          Get started free
        </Link>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: '28px 20px' }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto',
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', flexWrap: 'wrap', gap: '16px',
        }}>
          <Logo showWordmark size={20} />
          <p style={{ fontSize: '13px', color: C.muted, margin: 0 }}>
            © 2025 Cortex. All systems go.
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link to={Routes.auth.sign_in} style={{ fontSize: '13px', color: C.muted, textDecoration: 'none' }}>
              Sign in
            </Link>
            <Link to={Routes.auth.sign_up} style={{ fontSize: '13px', color: C.muted, textDecoration: 'none' }}>
              Get started
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
