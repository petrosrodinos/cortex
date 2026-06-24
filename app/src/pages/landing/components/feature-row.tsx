import { type ReactNode } from 'react';
import { C } from '../tokens';

interface FeatureRowProps {
  label: string;
  heading: string;
  description: string;
  detail: string[];
  visual: ReactNode;
  reverse?: boolean;
}

export function FeatureRow({ label, heading, description, detail, visual, reverse = false }: FeatureRowProps) {
  return (
    <div className="lp-feature-row" style={{ flexDirection: reverse ? 'row-reverse' : 'row' }}>
      <div style={{ flex: '0 0 42%', maxWidth: '42%' }} className="lp-feature-text">
        <p style={{
          fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em',
          textTransform: 'uppercase', color: C.accent, margin: '0 0 14px',
        }}>
          {label}
        </p>
        <h2 style={{
          fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 600, lineHeight: 1.15,
          color: C.fg, margin: '0 0 16px', letterSpacing: '-0.015em',
        }}>
          {heading}
        </h2>
        <p style={{ fontSize: '15px', lineHeight: 1.65, color: C.muted, margin: '0 0 24px' }}>
          {description}
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {detail.map(d => (
            <li key={d} style={{
              display: 'flex', alignItems: 'flex-start', gap: '10px',
              fontSize: '14px', color: C.muted, lineHeight: 1.5,
            }}>
              <span style={{ color: C.accent, marginTop: '2px', flexShrink: 0 }}>—</span>
              {d}
            </li>
          ))}
        </ul>
      </div>
      <div style={{ flex: '0 0 52%', maxWidth: '52%' }} className="lp-feature-visual">
        {visual}
      </div>
    </div>
  );
}
