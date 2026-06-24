import { C } from '../tokens';

const SCHEDULES = [
  {
    cron: 'Mon · 9:00 AM',
    tasks: ['Pull week-over-week pipeline data', 'Post summary to #sales-ops'],
  },
  {
    cron: 'Daily · 6:00 PM',
    tasks: ['Sync Salesforce contacts to analytics DB', 'Flag records with missing fields'],
  },
];

export function AgentMock() {
  return (
    <div style={{
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: '12px',
      overflow: 'hidden',
      fontSize: '13px',
    }}>
      {SCHEDULES.map((s, si) => (
        <div key={si} style={{
          padding: '16px 20px',
          borderBottom: si < SCHEDULES.length - 1 ? `1px solid ${C.border}` : 'none',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: C.accent, flexShrink: 0,
            }} />
            <span style={{ color: C.muted, fontSize: '12px', fontWeight: 500 }}>{s.cron}</span>
          </div>
          {s.tasks.map((task, ti) => (
            <div key={ti} style={{
              display: 'flex', gap: '10px', alignItems: 'flex-start',
              paddingLeft: '16px',
              marginBottom: ti < s.tasks.length - 1 ? '6px' : 0,
            }}>
              <span style={{ color: C.border, flexShrink: 0, marginTop: '2px' }}>└─</span>
              <span style={{ color: C.fg, lineHeight: 1.4 }}>{task}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
