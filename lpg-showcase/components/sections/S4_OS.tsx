// Scene 4: Operating System — 40–58%
const MODULES = ['Sales', 'Customers', 'Stock', 'Reports', 'Delivery', 'Payments'];

export default function S4_OS() {
  return (
    <section style={{ height: '180vh', position: 'relative', padding: '0 8vw' }}>
      <div style={{
        position: 'sticky',
        top: '50%',
        transform: 'translateY(-50%)',
      }}>
        <div style={{
          fontFamily: "'VT323', monospace",
          fontSize: '10px',
          color: '#FF6A00',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          marginBottom: 16,
        }}>04 // OPERATING SYSTEM</div>

        <div style={{
          fontFamily: "'VT323', monospace",
          fontSize: 'clamp(42px, 5.5vw, 82px)',
          color: '#101010',
          lineHeight: 0.92,
        }}>
          SIX MODULES.<br/>
          ONE<br/>
          <span style={{ color: '#FF6A00' }}>PLATFORM.</span>
        </div>

        {/* Module list */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          marginTop: 28,
        }}>
          {MODULES.map((mod, i) => (
            <div key={mod} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}>
              <div style={{
                width: 4, height: 4,
                background: i % 2 === 0 ? '#FF6A00' : '#888899',
                borderRadius: 1,
              }} />
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '10px',
                color: 'rgba(16,16,16,0.6)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}>{mod}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
