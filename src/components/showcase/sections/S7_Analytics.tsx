const METRICS = [
  { label: 'Monthly Revenue',  value: '₹3,24,580', change: '+14.2%', up: true },
  { label: 'Active Customers', value: '847',        change: '+28',    up: true },
  { label: 'Pending Udhari',   value: '₹1,18,200', change: '-8.4%',  up: false },
  { label: 'Deliveries Today', value: '284',        change: '+12',    up: true },
];

function PixelBar({ heights }: { heights: number[] }) {
  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: 28 }}>
      {heights.map((h, i) => (
        <div key={i} style={{
          width: 5, height: h,
          background: i === heights.length - 1 ? '#FF6A00' : 'rgba(16,16,16,0.15)',
          borderRadius: 1,
        }} />
      ))}
    </div>
  );
}

export default function S7_Analytics() {
  return (
    <section style={{ height: '100vh', position: 'relative', padding: '0 8vw' }}>
      <div style={{
        position: 'sticky', top: '50%', transform: 'translateY(-50%)',
        display: 'flex', justifyContent: 'flex-end',
      }}>
        <div style={{ maxWidth: 380 }}>
          <div style={{
            fontFamily: "'VT323', monospace", fontSize: '10px',
            color: '#FF6A00', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 16,
          }}>07 // ANALYTICS</div>

          <div style={{
            fontFamily: "'VT323', monospace", fontSize: 'clamp(38px, 4.5vw, 66px)',
            color: '#101010', lineHeight: 0.95, marginBottom: 24,
          }}>
            EVERY NUMBER.<br/>
            <span style={{ color: '#FF6A00' }}>REAL TIME.</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {METRICS.map((m) => (
              <div key={m.label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 0', borderBottom: '1px solid rgba(16,16,16,0.07)',
              }}>
                <div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: '9px',
                    color: 'rgba(16,16,16,0.4)', letterSpacing: '0.1em',
                    textTransform: 'uppercase', marginBottom: 4,
                  }}>{m.label}</div>
                  <div style={{
                    fontFamily: "'VT323', monospace", fontSize: '22px',
                    color: '#101010', lineHeight: 1,
                  }}>{m.value}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                  <PixelBar heights={[8, 12, 9, 16, 11, 20, 14, 24].map(h => h * 0.9)} />
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: '9px',
                    color: m.up ? '#22C55E' : '#EF4444', fontWeight: 700,
                  }}>{m.change}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
