export default function S1_Birth() {
  return (
    <section style={{
      height: '120vh', display: 'flex', alignItems: 'center',
      position: 'relative', padding: '0 8vw',
    }}>
      <div style={{ position: 'absolute', bottom: '14vh', left: '8vw', right: '8vw' }}>
        <div style={{
          fontFamily: "'VT323', 'JetBrains Mono', monospace",
          fontSize: 'clamp(8px, 1vw, 11px)', letterSpacing: '0.24em',
          color: '#FF6A00', textTransform: 'uppercase', marginBottom: 16,
        }}>
          01 // DIGITAL BIRTH
        </div>
        <h1 style={{
          fontFamily: "'VT323', monospace",
          fontSize: 'clamp(52px, 7vw, 110px)', lineHeight: 0.92,
          letterSpacing: '-0.02em', color: '#101010', fontWeight: 400, margin: 0,
        }}>
          THE FUTURE<br/>
          OF LPG<br/>
          <span style={{ color: '#FF6A00' }}>AGENCIES.</span>
        </h1>
        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: 'clamp(12px, 1.2vw, 15px)',
          color: 'rgba(16,16,16,0.5)', marginTop: 20, letterSpacing: '0.02em',
          lineHeight: 1.6, maxWidth: 360,
        }}>
          Designed with precision.<br/>
          Built for India.
        </p>
      </div>

      <div style={{ position: 'absolute', top: '18vh', right: '8vw', textAlign: 'right' }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: '9px',
          color: 'rgba(16,16,16,0.25)', letterSpacing: '0.14em', lineHeight: 2,
        }}>
          <div>23.0225° N 72.5714° E</div>
          <div>AHMEDABAD, INDIA</div>
          <div>v2.6.0 — PRODUCTION</div>
        </div>
      </div>
    </section>
  );
}
