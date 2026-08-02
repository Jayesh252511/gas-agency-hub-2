// Scene 2: Product Reveal — 12–25% scroll
// Camera slowly orbits, close-up shots, blueprint labels appear
const SPECS = [
  ['Working Pressure', '7.5 bar'],
  ['Tare Weight', '16.4 kg'],
  ['Water Capacity', '14.2 L'],
  ['Material', 'BIS IS 3196'],
  ['Valve Standard', 'IS 8737'],
  ['Test Pressure', '26.0 bar'],
];

export default function S2_Reveal() {
  return (
    <section style={{
      height: '130vh',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      padding: '0 8vw',
    }}>
      {/* Left spec table */}
      <div style={{
        position: 'absolute',
        left: '8vw',
        top: '50%',
        transform: 'translateY(-50%)',
      }}>
        <div style={{
          fontFamily: "'VT323', monospace",
          fontSize: '10px',
          color: '#FF6A00',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          marginBottom: 20,
        }}>
          02 // SPECIFICATIONS
        </div>

        {SPECS.map(([label, value]) => (
          <div key={label} style={{
            display: 'flex',
            gap: 32,
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(16,16,16,0.07)',
            padding: '10px 0',
          }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '9px',
              color: 'rgba(16,16,16,0.4)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}>{label}</span>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10px',
              color: '#101010',
              fontWeight: 700,
            }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Right — orbital label */}
      <div style={{
        position: 'absolute',
        right: '8vw',
        bottom: '20vh',
      }}>
        <div style={{
          fontFamily: "'VT323', monospace",
          fontSize: 'clamp(32px, 4vw, 58px)',
          color: '#101010',
          lineHeight: 1,
        }}>
          INDUSTRIAL<br/>
          <span style={{ color: '#FF6A00' }}>GRADE</span><br/>
          HARDWARE.
        </div>
      </div>
    </section>
  );
}
