const mascotasEjemplo = [
  { nombre: 'Luna', especie: 'Perro', raza: 'Golden Retriever', edad: '3 años', estado: 'Disponible', refugio: 'Refugio San Roque', descripcion: 'Alegre y sociable. Le encanta correr al aire libre.' },
  { nombre: 'Milo', especie: 'Gato', raza: 'Siamés mestizo', edad: '1 año y medio', estado: 'Disponible', refugio: 'Hogar Huellitas', descripcion: 'Tranquilo y cariñoso. Busca un lugar sereno para descansar.' },
  { nombre: 'Kira', especie: 'Perro', raza: 'Cruce de Pastor', edad: '2 años', estado: 'En adopción', refugio: 'Refugio San Roque', descripcion: 'Atenta y protectora. Disfruta los paseos y la compañía.' },
]

function Adopcion() {
  return (
    <>
      <section className="hero-subpagina">
        <p className="eyebrow">CUIDADO · ADOPCIÓN RESPONSABLE · NUEVAS OPORTUNIDADES</p>
        <h1>Cada patita merece un hogar.</h1>
        <p>Encuentra a tu compañero ideal y conoce mascotas que esperan una familia amorosa.</p>
      </section>

      <div className="management-layout">
        <section className="panel">
          <p className="eyebrow">NUEVO INGRESO</p>
          <h2>Registrar mascota</h2>
          <p className="panel-intro">Completa sus datos para agregarla al refugio.</p>
          <form className="data-form">
            <label>Nombre<input placeholder="Ej. Luna" /></label>
            <div className="form-row">
              <label>Especie<select defaultValue=""><option value="" disabled>Elige una</option><option>Perro</option><option>Gato</option><option>Otro</option></select></label>
              <label>Raza<input placeholder="Ej. Mestizo, Labrador…" /></label>
            </div>
            <div className="form-row">
              <label>Edad<input placeholder="Ej. 3 años" /></label>
              <label>Estado<select defaultValue="Disponible"><option>Disponible</option><option>Perdida</option><option>Encontrada</option><option>En adopción</option></select></label>
            </div>
            <label>Refugio asignado<select defaultValue=""><option value="" disabled>Elige un refugio</option><option>Refugio San Roque</option><option>Hogar Huellitas</option></select></label>
            <label>Descripción<textarea rows="3" placeholder="Cuéntanos sobre su historia, personalidad o cuidados especiales…" /></label>
            <button className="button primary full-width" type="button">Guardar mascota <span aria-hidden="true">→</span></button>
          </form>
        </section>

        <section className="records-section">
          <div className="search-bar"><span aria-hidden="true">⌕</span><input placeholder="Buscar por nombre, raza o refugio…" /><button className="button primary" type="button">Buscar</button></div>
          <div className="records-heading"><div><p className="eyebrow">NUESTROS ANIMALES</p><h2>Mascotas registradas <span className="count">3</span></h2></div><button className="refresh" aria-label="Actualizar" type="button">↻</button></div>
          <div className="record-list">
            {mascotasEjemplo.map((mascota) => (
              <article className="record-card" key={mascota.nombre}>
                <span className="animal-icon" aria-hidden="true">{mascota.especie === 'Gato' ? '🐈' : '🐕'}</span>
                <div className="record-info"><div className="record-title"><h3>{mascota.nombre}</h3><span className="status">{mascota.estado}</span></div><p>{mascota.especie} · {mascota.raza} · {mascota.edad}</p><small>⌖ {mascota.refugio}</small><p className="description">{mascota.descripcion}</p></div>
                <div className="record-actions"><button className="button" type="button">Editar</button><button className="button delete" type="button">Eliminar</button></div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}

export default Adopcion
