import { useEffect, useState } from 'react';
import { C } from '../tokens';

type DemoPhase = 0 | 1 | 2 | 3 | 4 | 5;

const PHASE_DURATIONS: Record<DemoPhase, number> = {
  0: 2400,
  1: 1800,
  2: 2800,
  3: 2000,
  4: 1600,
  5: 4000,
};

const TOTAL_PHASES = 6;

interface DemoExample {
  tab: string;
  question: string;
  tools1: string[];
  response1: React.ReactNode;
  followUp: string;
  tools2: string[];
  response2: React.ReactNode;
}

const EXAMPLES: DemoExample[] = [
  {
    tab: 'Subscriptions',
    question: 'How many new subscriptions did we get today?',
    tools1: ['Stripe', 'Analytics DB'],
    response1: (
      <>
        <span style={{ color: 'var(--accent)', fontWeight: 500 }}>47 new subscriptions</span> today — up 12% from yesterday. 38 Pro, 9 Enterprise.
      </>
    ),
    followUp: 'Make it a PDF and send it to the team.',
    tools2: ['PDF Export', 'Slack'],
    response2: (
      <>
        Done — report exported and sent to{' '}
        <span style={{ color: 'var(--accent)', fontWeight: 500 }}>#sales-ops</span>.
      </>
    ),
  },
  {
    tab: 'Churn risk',
    question: 'Which customers are at risk of churning?',
    tools1: ['Salesforce', 'Analytics DB'],
    response1: (
      <>
        <span style={{ color: 'var(--accent)', fontWeight: 500 }}>8 accounts</span> flagged — no activity in 14+ days. <span style={{ color: 'var(--accent)', fontWeight: 500 }}>$62k ARR</span> at risk. Top: Acme Corp, Globex, Initech.
      </>
    ),
    followUp: 'Send them a check-in email.',
    tools2: ['Gmail', 'HubSpot'],
    response2: (
      <>
        <span style={{ color: 'var(--accent)', fontWeight: 500 }}>8 drafts</span> ready in Gmail — personalized per account. Review before sending.
      </>
    ),
  },
];

function Avatar({ label, accent = false }: { label: string; accent?: boolean }) {
  return (
    <div style={{
      width: 28, height: 28, borderRadius: '6px', flexShrink: 0,
      background: accent ? C.accentBg : C.surface3,
      border: accent ? `1px solid ${C.accentBorder}` : 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '11px', fontWeight: 600,
      color: accent ? C.accent : C.muted,
    }}>
      {label}
    </div>
  );
}

function ToolChips({ tools, visible }: { tools: string[]; visible: boolean }) {
  return (
    <div style={{
      marginLeft: '38px', marginBottom: '14px',
      display: 'flex', gap: '6px', flexWrap: 'wrap',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(5px)',
      transition: 'opacity 250ms ease-out, transform 250ms ease-out',
    }}>
      {tools.map((tool, i) => (
        <div key={tool} style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          padding: '3px 9px', borderRadius: '20px',
          background: C.accentBg, border: `1px solid ${C.accentBorder}`,
          color: C.accent, fontSize: '12px', fontWeight: 500,
          opacity: visible ? 1 : 0,
          transition: `opacity 220ms ease-out ${i * 100}ms`,
        }}>
          <span style={{ fontSize: '9px' }}>✓</span>
          {tool}
        </div>
      ))}
    </div>
  );
}

export function DemoTerminal() {
  const [activeTab, setActiveTab] = useState(0);
  const [phase, setPhase] = useState<DemoPhase>(0);

  useEffect(() => {
    let current: DemoPhase = 0;
    let timeout: ReturnType<typeof setTimeout>;

    const advance = () => {
      current = ((current + 1) % TOTAL_PHASES) as DemoPhase;
      setPhase(current);
      timeout = setTimeout(advance, PHASE_DURATIONS[current]);
    };

    timeout = setTimeout(advance, PHASE_DURATIONS[0]);
    return () => clearTimeout(timeout);
  }, [activeTab]);

  const handleTabChange = (i: number) => {
    setActiveTab(i);
    setPhase(0);
  };

  const ex = EXAMPLES[activeTab];

  const firstToolsVisible = phase >= 1;
  const firstResponseVisible = phase >= 2;
  const secondMessageVisible = phase >= 3;
  const secondToolsVisible = phase >= 4;
  const secondResponseVisible = phase >= 5;

  return (
    <div style={{
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: `color-mix(in oklch, ${C.accent} 28%, oklch(0 0 0 / 0.5)) 0 16px 40px -8px`,
      fontSize: '13px',
    }}>
      {/* Titlebar + tabs */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px',
        background: C.surface2,
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {['oklch(0.55 0.18 25)', 'oklch(0.68 0.18 85)', 'oklch(0.55 0.14 145)'].map((col, i) => (
            <div key={i} style={{ width: 9, height: 9, borderRadius: '50%', background: col, opacity: 0.7 }} />
          ))}
          <span style={{ marginLeft: '8px', color: C.muted, fontSize: '12px', fontWeight: 500 }}>Cortex</span>
        </div>

        {/* Tab pills */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {EXAMPLES.map((ex, i) => (
            <button
              key={ex.tab}
              onClick={() => handleTabChange(i)}
              style={{
                height: '26px', padding: '0 10px', borderRadius: '6px',
                border: activeTab === i ? `1px solid ${C.accentBorder}` : `1px solid ${C.border}`,
                background: activeTab === i ? C.accentBg : 'transparent',
                color: activeTab === i ? C.accent : C.muted,
                fontSize: '12px', fontWeight: 500, cursor: 'pointer',
                transition: 'all 150ms ease-out',
              }}
            >
              {ex.tab}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '18px 18px 14px' }}>
        {/* First user message */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
          <Avatar label="You" />
          <p style={{ margin: 0, paddingTop: '4px', color: C.fg, lineHeight: 1.5 }}>
            {ex.question}
            {phase === 0 && <span className="lp-cursor" />}
          </p>
        </div>

        <ToolChips tools={ex.tools1} visible={firstToolsVisible} />

        {/* First response */}
        <div style={{
          display: 'flex', gap: '10px', marginBottom: '16px',
          opacity: firstResponseVisible ? 1 : 0,
          transform: firstResponseVisible ? 'translateY(0)' : 'translateY(5px)',
          transition: 'opacity 300ms ease-out, transform 300ms ease-out',
        }}>
          <Avatar label="C" accent />
          <p style={{ margin: 0, paddingTop: '4px', color: C.fg, lineHeight: 1.55 }}>
            {ex.response1}
          </p>
        </div>

        {/* Second user message */}
        <div style={{
          display: 'flex', gap: '10px', marginBottom: '12px',
          opacity: secondMessageVisible ? 1 : 0,
          transform: secondMessageVisible ? 'translateY(0)' : 'translateY(5px)',
          transition: 'opacity 280ms ease-out, transform 280ms ease-out',
        }}>
          <Avatar label="You" />
          <p style={{ margin: 0, paddingTop: '4px', color: C.fg, lineHeight: 1.5 }}>
            {ex.followUp}
            {phase === 3 && <span className="lp-cursor" />}
          </p>
        </div>

        <ToolChips tools={ex.tools2} visible={secondToolsVisible} />

        {/* Second response */}
        <div style={{
          display: 'flex', gap: '10px',
          opacity: secondResponseVisible ? 1 : 0,
          transform: secondResponseVisible ? 'translateY(0)' : 'translateY(5px)',
          transition: 'opacity 300ms ease-out, transform 300ms ease-out',
        }}>
          <Avatar label="C" accent />
          <p style={{ margin: 0, paddingTop: '4px', color: C.fg, lineHeight: 1.55 }}>
            {ex.response2}
          </p>
        </div>

        {/* Input bar */}
        <div style={{
          marginTop: '16px',
          background: C.surface2, border: `1px solid ${C.border}`,
          borderRadius: '8px', padding: '9px 12px',
          color: C.muted, fontSize: '13px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span>Ask a follow-up…</span>
          <div style={{
            width: 26, height: 26, borderRadius: '6px',
            background: C.accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', color: C.accentFg,
          }}>
            ↑
          </div>
        </div>
      </div>
    </div>
  );
}
