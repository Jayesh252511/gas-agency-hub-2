// Scene 8: Devices — 94–97%
const DEVICES = [
  { name: 'Desktop',  size: '24"',  icon: '▣' },
  { name: 'Tablet',   size: '10"',  icon: '▪' },
  { name: 'Mobile',   size: '6.5"', icon: '▫' },
];

export default function S8_Devices() {
  return (
    <section style={{ height: '100vh', position: 'relative', padding: '0 8vw' }}>
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
        }}>08 // ECOSYSTEM</div>

        <div style={{
          fontFamily: "'VT323', monospace",
          fontSize: 'clamp(40px, 5vw, 76px)',
          color: '#101010',
          lineHeight: 0.92,
          marginBottom: 28,
        }}>
          ANY DEVICE.<br/>
          <span style={{ color: '#FF6A00' }}>ANYWHERE.</span>
        </div>

        <div style={{ display: 'flex', gap: 20 }}>
          {DEVICES.map((d) => (
            <div key={d.name} style={{
              border: '1px solid rgba(16,16,16,0.1)',
              padding: '16px 20px',
              borderRadius: 4,
              minWidth: 90,
            }}>
              <div style={{
                fontFamily: "'VT323', monospace",
                fontSize: '20px',
                color: '#FF6A00',
                marginBottom: 6,
              }}>{d.icon}</div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '9px',
                color: '#101010',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}>{d.name}</div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '8px',
                color: 'rgba(16,16,16,0.4)',
                marginTop: 2,
              }}>{d.size}</div>
            </div>
          ))}
        </div>

        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '12px',
          color: 'rgba(16,16,16,0.4)',
          marginTop: 20,
          lineHeight: 1.7,
          maxWidth: 300,
        }}>
          Browser-based. No install required. Works offline in remote locations.
        </p>
      </div>
    </section>
  );
}
