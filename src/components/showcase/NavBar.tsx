import { Link } from '@tanstack/react-router';

export default function NavBar() {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      zIndex: 200, padding: '22px 40px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      pointerEvents: 'auto',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 8, height: 8, background: '#FF6A00', borderRadius: 1,
        }} />
        <span style={{
          fontFamily: "'VT323', 'JetBrains Mono', monospace",
          fontSize: '14px', letterSpacing: '0.22em', color: '#101010',
          textTransform: 'uppercase', fontWeight: 700,
        }}>
          GasAgency Hub
        </span>
      </div>

      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '9px', letterSpacing: '0.16em',
        color: 'rgba(16,16,16,0.4)', textTransform: 'uppercase',
      }}>
        Scroll to explore ↓
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <Link
          to="/login"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '10px', letterSpacing: '0.14em',
            color: '#101010', textDecoration: 'none',
            textTransform: 'uppercase', fontWeight: 600,
          }}
        >
          Login
        </Link>
        <a
          href="https://wa.me/918605601801?text=Hello%2C%20I%20want%20a%20free%20trial."
          target="_blank" rel="noopener noreferrer"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '10px', letterSpacing: '0.14em',
            color: '#FFFFFF', background: '#FF6A00',
            padding: '8px 16px', borderRadius: 4,
            textDecoration: 'none', textTransform: 'uppercase',
            fontWeight: 700,
          }}
        >
          Free Trial →
        </a>
      </div>
    </nav>
  );
}
