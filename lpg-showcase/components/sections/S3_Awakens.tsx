// Scene 3: Cylinder Awakens — 25–40%
export default function S3_Awakens() {
  return (
    <section style={{ height: '150vh', position: 'relative', padding: '0 8vw' }}>
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
            marginBottom: 16,
          }}>03 // SYSTEM ACTIVATION</div>
          <div style={{
            fontFamily: "'VT323', monospace",
            fontSize: 'clamp(40px, 5vw, 72px)',
            color: '#101010',
            lineHeight: 0.95,
          }}>
            AN INVISIBLE<br/>
            OPERATING<br/>
            <span style={{ color: '#FF6A00' }}>SYSTEM.</span>
          </div>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '12px',
            color: 'rgba(16,16,16,0.45)',
            marginTop: 18,
            lineHeight: 1.7,
            maxWidth: 280,
          }}>
            Inside every cylinder exists the intelligence to manage your entire agency.
            Sales. Payments. Stock. Delivery. All suspended in the air.
          </p>
        </div>
      </div>
    </section>
  );
}
