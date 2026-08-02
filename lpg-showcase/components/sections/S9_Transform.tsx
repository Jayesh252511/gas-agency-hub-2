// Scene 9: Final Transformation — 97–100%
export default function S9_Transform() {
  return (
    <section style={{
      height: '130vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      textAlign: 'center',
      padding: '0 8vw',
    }}>
      <div style={{
        position: 'sticky',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
      }}>
        <div style={{
          fontFamily: "'VT323', monospace",
          fontSize: '10px',
          color: '#FF6A00',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
        }}>09 // TRANSFORMATION</div>

        <h2 style={{
          fontFamily: "'VT323', monospace",
          fontSize: 'clamp(48px, 7vw, 120px)',
          lineHeight: 0.88,
          letterSpacing: '-0.01em',
          color: '#101010',
          fontWeight: 400,
          margin: 0,
        }}>
          ONE PLATFORM.<br/>
          EVERY CYLINDER.<br/>
          EVERY CUSTOMER.<br/>
          <span style={{ color: '#FF6A00' }}>EVERY RUPEE.</span>
        </h2>

        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '13px',
          color: 'rgba(16,16,16,0.45)',
          maxWidth: 380,
          lineHeight: 1.7,
          marginTop: 8,
        }}>
          GasAgency Hub is the complete operating system for modern LPG agencies in India.
          Start your free trial today — no credit card required.
        </p>

        {/* CTA buttons */}
        <div style={{
          display: 'flex',
          gap: 16,
          marginTop: 8,
          pointerEvents: 'auto',
        }}>
          <a
            href="https://wa.me/918605601801?text=Hello%2C%20I%20want%20to%20start%20a%20free%20trial%20of%20GasAgency%20Hub."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              background: '#FF6A00',
              color: '#FFFFFF',
              padding: '13px 28px',
              textDecoration: 'none',
              borderRadius: 3,
              transition: 'opacity 0.2s',
            }}
          >
            Start Free Trial →
          </a>
          <a
            href="https://gas-agency-hub.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              background: 'transparent',
              color: '#101010',
              padding: '13px 28px',
              textDecoration: 'none',
              border: '1px solid rgba(16,16,16,0.2)',
              borderRadius: 3,
            }}
          >
            View Dashboard
          </a>
        </div>

        {/* Bottom engineering note */}
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '9px',
          color: 'rgba(16,16,16,0.2)',
          letterSpacing: '0.14em',
          marginTop: 24,
          textTransform: 'uppercase',
        }}>
          Made in India — v2.6.0 — © 2026 GasAgency Hub
        </div>
      </div>
    </section>
  );
}
