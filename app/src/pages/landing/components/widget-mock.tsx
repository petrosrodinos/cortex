import { C } from '../tokens';

const BARS = [
  { day: 'Mon', value: 38 },
  { day: 'Tue', value: 52 },
  { day: 'Wed', value: 47 },
  { day: 'Thu', value: 61 },
  { day: 'Fri', value: 74 },
  { day: 'Sat', value: 43 },
  { day: 'Sun', value: 29 },
];

const MAX = Math.max(...BARS.map(b => b.value));

export function WidgetMock() {
  return (
    <div style={{
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: '12px',
      overflow: 'hidden',
      fontSize: '13px',
    }}>
      {/* Conversation prompt */}
      <div style={{
        padding: '14px 18px',
        background: C.surface2,
        borderBottom: `1px solid ${C.border}`,
        display: 'flex', gap: '10px', alignItems: 'flex-start',
      }}>
        <div style={{
          width: 26, height: 26, borderRadius: '6px', flexShrink: 0,
          background: C.surface3,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '11px', fontWeight: 600, color: C.muted,
        }}>
          You
        </div>
        <p style={{ margin: 0, paddingTop: '3px', color: C.fg, lineHeight: 1.5 }}>
          Chart this week's new signups by day.
        </p>
      </div>

      {/* Widget card */}
      <div style={{ padding: '18px' }}>
        <div style={{
          background: C.surface2,
          border: `1px solid ${C.border}`,
          borderRadius: '10px',
          padding: '16px',
        }}>
          {/* Widget header */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            marginBottom: '16px',
          }}>
            <div>
              <p style={{ margin: '0 0 2px', fontSize: '12px', fontWeight: 600, color: C.fg }}>
                New signups — this week
              </p>
              <p style={{ margin: 0, fontSize: '11px', color: C.muted }}>
                344 total · from Analytics DB
              </p>
            </div>
            <div style={{
              fontSize: '11px', fontWeight: 500,
              color: C.accent,
              background: C.accentBg,
              border: `1px solid ${C.accentBorder}`,
              borderRadius: '4px', padding: '2px 7px',
            }}>
              Widget
            </div>
          </div>

          {/* Bar chart */}
          <div style={{
            display: 'flex', alignItems: 'flex-end', gap: '6px', height: '80px',
          }}>
            {BARS.map(({ day, value }) => {
              const heightPct = (value / MAX) * 100;
              const isFriday = day === 'Fri';
              return (
                <div key={day} style={{
                  flex: 1, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: '6px', height: '100%',
                  justifyContent: 'flex-end',
                }}>
                  <div style={{
                    width: '100%',
                    height: `${heightPct}%`,
                    borderRadius: '4px 4px 2px 2px',
                    background: isFriday
                      ? C.accent
                      : `color-mix(in oklch, ${C.accent} 35%, ${C.surface3})`,
                    transition: 'height 400ms ease-out',
                  }} />
                  <span style={{
                    fontSize: '10px', color: isFriday ? C.accent : C.muted,
                    fontWeight: isFriday ? 600 : 400,
                  }}>
                    {day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Expand hint */}
        <p style={{
          margin: '10px 0 0', fontSize: '12px', color: C.muted,
          textAlign: 'right',
        }}>
          Expand · Save to board
        </p>
      </div>
    </div>
  );
}
