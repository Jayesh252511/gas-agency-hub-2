export default function S6_Warehouse() {
  return (
    <section style={{ height: '120vh', position: 'relative', padding: '0 8vw' }}>
      <div style={{
        position: 'sticky', top: '50%', transform: 'translateY(-50%)',
      }}>
        <div style={{
          fontFamily: "'VT323', monospace", fontSize: '10px',
          color: '#FF6A00', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 16,
        }}>06 // INVENTORY</div>

        <div style={{
          fontFamily: "'VT323', monospace", fontSize: 'clamp(44px, 5.5vw, 84px)',
          color: '#101010', lineHeight: 0.92,
        }}>
          THOUSANDS<br/>
          OF CYLINDERS.<br/>
          <span style={{ color: '#FF6A00' }}>ONE VIEW.</span>
        </div>

        <div style={{ display: 'flex', gap: 32, marginTop: 28 }}>
          {[
            { label: 'In Stock', value: '1,428', color: '#101010' },
            { label: 'Delivered', value: '284', color: '#FF6A00' },
            { label: 'Pending', value: '62', color: '#888899' },
          ].map((stat) => (
            <div key={stat.label}>
              <div style={{
                fontFamily: "'VT323', monospace", fontSize: 'clamp(28px, 3vw, 44px)',
                color: stat.color, lineHeight: 1,
              }}>{stat.value}</div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: '9px',
                color: 'rgba(16,16,16,0.4)', letterSpacing: '0.12em',
                textTransform: 'uppercase', marginTop: 4,
              }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
