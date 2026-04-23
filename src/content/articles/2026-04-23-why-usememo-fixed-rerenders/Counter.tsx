import { useState } from 'react';

type Props = {
  label?: string;
  start?: number;
};

export default function Counter({ label = 'Count', start = 0 }: Props) {
  const [count, setCount] = useState(start);

  return (
    <div className="demo">
      <div className="demo-label">Interactive · React</div>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <button onClick={() => setCount((c) => c - 1)} aria-label="decrement">−</button>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '1.1rem', minWidth: '6ch', textAlign: 'center' }}>
          {label}: {count}
        </span>
        <button onClick={() => setCount((c) => c + 1)} aria-label="increment">+</button>
        <button onClick={() => setCount(start)} style={{ marginLeft: 'auto', background: 'transparent', color: 'var(--ink-soft)', border: '1px solid var(--rule)' }}>
          reset
        </button>
      </div>
    </div>
  );
}
