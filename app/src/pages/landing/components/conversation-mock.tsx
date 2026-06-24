import { C } from '../tokens';

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

const TOOLS = ['Stripe', 'Zendesk', 'Salesforce'];

export function ConversationMock() {
  return (
    <div style={{
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: '12px',
      overflow: 'hidden',
      fontSize: '13px',
    }}>
      {/* Titlebar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '10px 14px',
        background: C.surface2,
        borderBottom: `1px solid ${C.border}`,
      }}>
        {['oklch(0.55 0.18 25)', 'oklch(0.68 0.18 85)', 'oklch(0.55 0.14 145)'].map((col, i) => (
          <div key={i} style={{ width: 9, height: 9, borderRadius: '50%', background: col, opacity: 0.7 }} />
        ))}
        <span style={{ marginLeft: '8px', color: C.muted, fontSize: '12px', fontWeight: 500 }}>Cortex</span>
      </div>

      <div style={{ padding: '18px 18px 14px' }}>
        {/* User message */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
          <Avatar label="You" />
          <p style={{ margin: 0, paddingTop: '4px', color: C.fg, lineHeight: 1.5 }}>
            What's our MRR, and how many open support tickets do we have?
          </p>
        </div>

        {/* Tool chips */}
        <div style={{
          marginLeft: '38px', marginBottom: '14px',
          display: 'flex', gap: '6px', flexWrap: 'wrap',
        }}>
          {TOOLS.map((tool, i) => (
            <div key={tool} style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              padding: '3px 9px', borderRadius: '20px',
              background: C.accentBg, border: `1px solid ${C.accentBorder}`,
              color: C.accent, fontSize: '12px', fontWeight: 500,
              opacity: 1 - i * 0.08,
            }}>
              <span style={{ fontSize: '9px' }}>✓</span>
              {tool}
            </div>
          ))}
        </div>

        {/* Response */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <Avatar label="C" accent />
          <div style={{ paddingTop: '4px' }}>
            <p style={{ margin: '0 0 10px', color: C.fg, lineHeight: 1.6 }}>
              MRR is{' '}
              <span style={{ color: C.accent, fontWeight: 500 }}>$124k</span>
              {' '}— up 8% month-over-month.{' '}
              <span style={{ color: C.accent, fontWeight: 500 }}>23 open tickets</span>
              {' '}in Zendesk, avg response time 2.1h.
            </p>

            {/* Inline data row */}
            <div style={{
              display: 'flex', gap: '8px',
            }}>
              {[
                { label: 'MRR', value: '$124k', delta: '↑ 8%' },
                { label: 'Open tickets', value: '23', delta: '↓ 4 from last wk' },
                { label: 'Avg response', value: '2.1h', delta: 'within SLA' },
              ].map(({ label, value, delta }) => (
                <div key={label} style={{
                  flex: 1,
                  background: C.surface2,
                  border: `1px solid ${C.border}`,
                  borderRadius: '8px',
                  padding: '8px 10px',
                }}>
                  <p style={{ margin: '0 0 2px', fontSize: '11px', color: C.muted }}>{label}</p>
                  <p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: 600, color: C.fg }}>{value}</p>
                  <p style={{ margin: 0, fontSize: '11px', color: C.accent }}>{delta}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Input bar */}
        <div style={{
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
