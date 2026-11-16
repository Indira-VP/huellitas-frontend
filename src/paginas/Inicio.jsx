function Inicio({ onNavigate }) {
  return (
    <>
      <section className="hero-inicio">
        <div className="hero-copy">
          <p className="eyebrow">CUIDADO · ADOPCIÓN · NUEVAS OPORTUNIDADES</p>
          <h1>Cada patita merece un hogar.</h1>
          <p>Conoce a las mascotas que buscan una familia y a los refugios que las cuidan. Tal vez entre sus historias encuentres a tu próxima gran compañía.</p>
          <div className="hero-actions home-actions">
            <button className="button primary" onClick={() => onNavigate('adopcion')} type="button">Ver mascotas en adopción <span aria-hidden="true">→</span></button>
            <button className="button" onClick={() => onNavigate('refugios')} type="button">Conocer refugios</button>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <img src="/images/ilustracion_inicio.png" alt="" />
        </div>
      </section>
      <section className="how-section">
        <p className="eyebrow">PASO A PASO</p>
        <h2>¿Cómo funciona Huellitas?</h2>
        <p className="section-intro">Un espacio para acercar a las mascotas, los refugios y las familias.</p>
        <div className="info-grid">
          <article className="info-card"><span className="info-icon">🐾</span><p className="step-label">01 / DESCUBRE</p><h3>Conoce sus historias</h3><p>Explora mascotas perdidas o que esperan una familia.</p></article>
          <article className="info-card"><span className="info-icon">♡</span><p className="step-label">02 / CONECTA</p><h3>Acércate al refugio</h3><p>Consulta el refugio relacionado con cada mascota.</p></article>
          <article className="info-card"><span className="info-icon">⌂</span><p className="step-label">03 / ACOMPAÑA</p><h3>Apoya una nueva oportunidad</h3><p>Ayuda a difundir la información de cada animal.</p></article>
        </div>
      </section>
    </>
  )
}

export default Inicio
