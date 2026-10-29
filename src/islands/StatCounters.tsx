import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export interface Stat {
  target: number;
  prefix?: string;
  label: string;
}

function Counter({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setShown(stat.target);
      return;
    }
    // Cuenta desde 0 cuando la cifra entra en viewport.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const state = { v: 0 };
        gsap.to(state, { v: stat.target, duration: 1.4, ease: 'power2.out', onUpdate: () => setShown(Math.round(state.v)) });
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [stat.target]);

  return (
    <div className="stat">
      <span ref={ref} className="stat__value">
        {stat.prefix ?? ''}
        {shown.toLocaleString('es-ES')}
      </span>
      <span className="stat__label">{stat.label}</span>
    </div>
  );
}

export default function StatCounters({ stats }: { stats: Stat[] }) {
  return (
    <div className="stats">
      {stats.map((stat) => (
        <Counter key={stat.label} stat={stat} />
      ))}
    </div>
  );
}
