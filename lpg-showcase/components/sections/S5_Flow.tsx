// Scene 5: Digital Flow — 58–72%
const FLOW = ['Booking', 'Payment', 'Stock Update', 'Delivery', 'Report'];

export default function S5_Flow() {
  return (
    <section style={{ height: '140vh', position: 'relative', padding: '0 8vw' }}>
      <div style={{
        position: 'sticky',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        justifyContent: 'flex-end',
      }}>
        <div>
          <div style={{
            fontFamily: "'VT323', monospace",
            fontSize: '10px',
            color: '#FF6A00',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            marginBottom: 20,
          }}>05 // DATA FLOW</div>

          <div style={{
            fontFamily: "'VT323', monospace",
            fontSize: 'clamp(36px, 4.5vw, 66px)',
            color: '#101010',
            lineHeight: 0.95,
            marginBottom: 24,
          }}>
            DATA FLOWS<br/>
            <span style={{ color: '#FF6A00' }}>EVERYWHERE.</span>
          </div>

          {/* Animated flow steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {FLOW.map((step, i) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                }}>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '7px 14px',
                    background: i === 0 ? '#FF6A00' : 'rgba(16,16,16,0.04)',
                    color: i === 0 ? '#FFFFFF' : '#101010',
                    border: '1px solid rgba(16,16,16,0.1)',
                    minWidth: 120,
                    textAlign: 'center',
                    letterSpacing: '0.08em',
                  }}>{step}</div>
                  {i < FLOW.length - 1 && (
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '9px',
                      color: '#FF6A00',
                      padding: '3px 0',
                      textAlign: 'center',
                      width: '100%',
                    }}>↓</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
