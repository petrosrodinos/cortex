import { C } from '../tokens';

export function ApprovalMock() {
  return (
    <div style={{
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: '12px',
      padding: '20px',
      fontSize: '13px',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        marginBottom: '14px', padding: '8px 12px',
        background: 'oklch(0.55 0.18 55 / 0.12)',
        border: '1px solid oklch(0.55 0.18 55 / 0.30)',
        borderRadius: '8px',
      }}>
        <span style={{ fontSize: '14px' }}>⚠</span>
        <span style={{ color: 'oklch(0.80 0.16 70)', fontWeight: 500, fontSize: '12px' }}>
          Pending approval
        </span>
      </div>

      <p style={{
        margin: '0 0 6px', color: C.muted,
        fontSize: '12px', fontWeight: 500,
        textTransform: 'uppercase', letterSpacing: '0.06em',
      }}>
        Proposed action
      </p>
      <p style={{ margin: '0 0 20px', color: C.fg, lineHeight: 1.55 }}>
        Delete all demo accounts inactive for more than 30 days.
        This affects <span style={{ color: C.fg, fontWeight: 500 }}>47 records</span> across 3 organizations.
      </p>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button style={{
          flex: 1, height: '36px', borderRadius: '6px',
          background: C.accent, color: C.accentFg,
          border: 'none', fontWeight: 500, fontSize: '13px', cursor: 'pointer',
        }}>
          Approve
        </button>
        <button style={{
          flex: 1, height: '36px', borderRadius: '6px',
          background: C.surface2, color: C.fg,
          border: `1px solid ${C.border}`, fontWeight: 500, fontSize: '13px', cursor: 'pointer',
        }}>
          Reject
        </button>
      </div>
    </div>
  );
}
