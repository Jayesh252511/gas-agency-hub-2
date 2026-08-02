'use client';

export default function NavBar() {
  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 200,
      padding: '22px 40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      pointerEvents: 'auto',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 8, height: 8,
          background: '#FF6A00',
          borderRadius: 1,
          animation: 'blink 2s step-end infinite',
        }} />
        <span style={{
          fontFamily: "'VT323', 'JetBrains Mono', monospace",
          fontSize: '13px',
          letterSpacing: '0.22em',
          color: '#101010',
          textTransform: 'uppercase',
        }}>
          GasAgency Hub
        </span>
      </div>

      {/* Nav label */}
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '9px',
        letterSpacing: '0.16em',
        color: 'rgba(16,16,16,0.4)',
        textTransform: 'uppercase',
      }}>
        Scroll to explore ↓
      </div>

      {/* CTA */}
      <a
        href="https://wa.me/918605601801?text=Hello%2C%20I%20want%20a%20free%20trial."
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '10px',
          letterSpacing: '0.14em',
          color: '#FF6A00',
          textDecoration: 'none',
          textTransform: 'uppercase',
          borderBottom: '1px solid rgba(255,106,0,0.3)',
          paddingBottom: 2,
          transition: 'border-color 0.2s',
        }}
      >
        Free Trial →
      </a>
    </nav>
  );
}
