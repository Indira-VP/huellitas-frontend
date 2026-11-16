function Refugios() {
  return (
    <>
      <section className="hero-subpagina">
        <div className="hero-copy">
          <p className="eyebrow">RED DE APOYO ANIMAL · REFUGIOS UNIDOS</p>
          <h1>Refugios y Hogares de Paso.</h1>
          <p>
            Espacios dedicados al rescate, cuidado y rehabilitación con amor.
            Registra nuevas sedes para que más patitas encuentren abrigo mientras
            esperan una familia.
          </p>
        </div>
      </section>

      <div className="management-layout">
        <section className="panel" aria-labelledby="titulo-formulario-refugio">
          <p className="eyebrow">NUEVA SEDE / ALBERGUE</p>
          <h2 id="titulo-formulario-refugio">Registrar refugio</h2>
          <p className="panel-intro">
            Completa los datos del espacio de acogida para incorporarlo a la red
            oficial de Huellitas.
          </p>

          <form className="data-form">
            <label htmlFor="nombre-refugio">
              Nombre del refugio
              <input
                id="nombre-refugio"
                name="nombre"
                placeholder="Ej. Refugio San Roque"
                required
              />
            </label>

            <label htmlFor="direccion-refugio">
              Dirección
              <input
                id="direccion-refugio"
                name="direccion"
                placeholder="Ej. Av. Los Sauces 450, Los Olivos"
                required
              />
            </label>

            <label htmlFor="telefono-refugio">
              Teléfono de contacto
              <input
                id="telefono-refugio"
                name="telefono"
                type="tel"
                placeholder="Ej. +57 300 123 4567"
                required
              />
            </label>

            <button className="button primary full-width" type="submit">
              Guardar refugio <span aria-hidden="true">→</span>
            </button>
          </form>
        </section>

        <section className="records-section" aria-labelledby="titulo-listado-refugios">
          <div className="records-heading">
            <div>
              <p className="eyebrow">NUESTROS HOGARES</p>
              <h2 id="titulo-listado-refugios">
                Refugios registrados <span className="count">0</span>
              </h2>
            </div>
          </div>
          <p className="notice">
            Aún no hay refugios registrados. Cuando agreguemos la conexión con la
            API, aquí aparecerán los refugios disponibles.
          </p>
        </section>
      </div>
    </>
  )
}

export default Refugios
