import { C } from '../tokens';

const DOCUMENTS = [
  { name: 'Q2 Sales Report.pdf', type: 'PDF', date: 'Jun 18', uploader: 'Sarah K.' },
  { name: 'EMEA Pipeline Analysis.xlsx', type: 'XLS', date: 'Jun 20', uploader: 'Tom R.' },
  { name: 'Board Summary — June.pdf', type: 'PDF', date: 'Jun 22', uploader: 'You' },
];

const TYPE_COLORS: Record<string, string> = {
  PDF: 'oklch(0.58 0.18 25)',
  XLS: 'oklch(0.55 0.16 145)',
};

function FileIcon({ type }: { type: string }) {
  return (
    <div style={{
      width: 36, height: 36, borderRadius: '8px', flexShrink: 0,
      background: `color-mix(in srgb, ${TYPE_COLORS[type] ?? C.accent} 14%, transparent)`,
      border: `1px solid color-mix(in srgb, ${TYPE_COLORS[type] ?? C.accent} 28%, transparent)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '10px', fontWeight: 700,
      color: TYPE_COLORS[type] ?? C.accent,
      letterSpacing: '0.04em',
    }}>
      {type}
    </div>
  );
}

export function BoardMock() {
  return (
    <div style={{
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: '12px',
      overflow: 'hidden',
      fontSize: '13px',
    }}>
      {/* Board header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 18px',
        background: C.surface2,
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div>
          <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: 600, color: C.fg }}>
            Q2 Operations
          </p>
          <p style={{ margin: 0, fontSize: '12px', color: C.muted }}>3 documents · shared with team</p>
        </div>
        <div style={{
          height: '28px', padding: '0 12px', borderRadius: '6px',
          background: C.accent, color: C.accentFg,
          display: 'flex', alignItems: 'center',
          fontSize: '12px', fontWeight: 500, cursor: 'pointer',
        }}>
          + Add
        </div>
      </div>

      {/* Document list */}
      {DOCUMENTS.map((doc, i) => (
        <div key={doc.name} style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '12px 18px',
          borderBottom: i < DOCUMENTS.length - 1 ? `1px solid ${C.border}` : 'none',
        }}>
          <FileIcon type={doc.type} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              margin: '0 0 3px', fontSize: '13px', fontWeight: 500, color: C.fg,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {doc.name}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: C.muted }}>{doc.uploader} · {doc.date}</span>
            </div>
          </div>
          <div style={{ color: C.muted, fontSize: '16px', cursor: 'pointer', flexShrink: 0 }}>⋯</div>
        </div>
      ))}
    </div>
  );
}
