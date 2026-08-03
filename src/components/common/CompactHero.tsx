import React from 'react';

export const COMPACT_HERO_CSS = `
.ch-hero { background: #111111; color: #fff; border-bottom: 2px solid #F8C400; }
.ch-hero-i { max-width: 1280px; margin: 0 auto; padding: 10px 22px; display: flex; align-items: center; gap: 18px; flex-wrap: wrap; }
.ch-hero h1 { font-size: 15px; font-weight: 800; letter-spacing: -0.2px; line-height: 1.2; }
.ch-hero h1 span { color: #F8C400; }
.ch-right { display: flex; align-items: center; gap: 14px; margin-left: auto; }
.ch-stats { display: flex; gap: 18px; flex-wrap: wrap; }
.ch-stat-n { font-size: 15px; font-weight: 900; color: #F8C400; line-height: 1; }
.ch-stat-l { font-size: 9.5px; color: rgba(255,255,255,.4); margin-top: 1px; }
@media (max-width: 640px) {
  .ch-hero-i { padding: 8px 14px; gap: 10px; }
  .ch-hero h1 { font-size: 13px; }
}
`;

export interface CompactHeroStat {
  n: React.ReactNode;
  l: string;
}

interface CompactHeroProps {
  title: React.ReactNode;
  stats?: CompactHeroStat[];
  action?: React.ReactNode;
}

export default function CompactHero({ title, stats, action }: CompactHeroProps) {
  const hasRight = (stats && stats.length > 0) || action;
  return (
    <>
      <style>{COMPACT_HERO_CSS}</style>
      <section className="ch-hero">
        <div className="ch-hero-i">
          <h1>{title}</h1>
          {hasRight && (
            <div className="ch-right">
              {stats && stats.length > 0 && (
                <div className="ch-stats">
                  {stats.map((st, i) => (
                    <div key={i}>
                      <div className="ch-stat-n">{st.n}</div>
                      <div className="ch-stat-l">{st.l}</div>
                    </div>
                  ))}
                </div>
              )}
              {action}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
