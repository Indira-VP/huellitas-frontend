import { useEffect, useMemo, useState } from 'react'

const API = 'http://127.0.0.1:8000/api'
const formularioVacio = {
  nombre: '',
  especie: '',
  raza: '',
  edad: '',
  estado: 'Disponible',
  refugio: '',
  descripcion: '',
}

function obtenerLista(datos) {
  return Array.isArray(datos) ? datos : datos?.results ?? []
}

async function leerRespuesta(respuesta) {
  const datos = respuesta.status === 204 ? null : await respuesta.json().catch(() => null)
  if (!respuesta.ok) {
    const detalle = datos && typeof datos === 'object'
      ? Object.values(datos).flat().join(' ')
      : ''
    throw new Error(detalle || `No se pudo completar la solicitud (${respuesta.status}).`)
  }
  return datos
}

function Adopcion() {
  const [mascotas, setMascotas] = useState([])
  const [refugios, setRefugios] = useState([])
  const [formulario, setFormulario] = useState(formularioVacio)
  const [mascotaEditando, setMascotaEditando] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const [aviso, setAviso] = useState('')

  async function cargarMascotas() {
    setCargando(true)
    setError('')
    try {
      const respuesta = await fetch(`${API}/mascotas/`)
      setMascotas(obtenerLista(await leerRespuesta(respuesta)))
    } catch (problema) {
      setError(`No pudimos cargar las mascotas. ${problema.message}`)
    } finally {
      setCargando(false)
    }
  }

  async function cargarRefugios() {
    try {
      const respuesta = await fetch(`${API}/refugios/`)
      setRefugios(obtenerLista(await leerRespuesta(respuesta)))
    } catch {
      setRefugios([])
    }
  }

  useEffect(() => {
    cargarMascotas()
    cargarRefugios()
  }, [])

  const mascotasFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLocaleLowerCase()
    if (!termino) return mascotas
    return mascotas.filter((mascota) =>
      [mascota.nombre, mascota.raza, mascota.refugio_nombre, mascota.refugio?.nombre]
        .some((dato) => String(dato ?? '').toLocaleLowerCase().includes(termino)),
    )
  }, [mascotas, busqueda])

  function cambiarCampo(evento) {
    const { name, value } = evento.target
    setFormulario((actual) => ({ ...actual, [name]: value }))
  }

  function comenzarEdicion(mascota) {
    setMascotaEditando(mascota.id)
    setFormulario({
      nombre: mascota.nombre ?? '',
      especie: mascota.especie ?? '',
      raza: mascota.raza ?? '',
      edad: mascota.edad ?? '',
      estado: mascota.estado ?? 'Disponible',
      refugio: mascota.refugio?.id ?? mascota.refugio ?? '',
      descripcion: mascota.descripcion ?? '',
    })
    setAviso('')
    setError('')
  }

  function cancelarEdicion() {
    setMascotaEditando(null)
    setFormulario(formularioVacio)
  }

  async function guardarMascota(evento) {
    evento.preventDefault()
    setGuardando(true)
    setError('')
    setAviso('')
    const datos = { ...formulario, refugio: Number(formulario.refugio) }
    const editando = mascotaEditando !== null

    try {
      const respuesta = await fetch(
        editando ? `${API}/mascotas/${mascotaEditando}/` : `${API}/mascotas/`,
        {
          method: editando ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datos),
        },
      )
      await leerRespuesta(respuesta)
      cancelarEdicion()
      setAviso(editando ? 'Mascota actualizada.' : 'Mascota registrada.')
      await cargarMascotas()
    } catch (problema) {
      setError(`No pudimos guardar la mascota. ${problema.message}`)
    } finally {
      setGuardando(false)
    }
  }

  async function eliminarMascota(mascota) {
    if (!window.confirm(`¿Quieres eliminar a ${mascota.nombre}?`)) return
    setError('')
    setAviso('')
    try {
      const respuesta = await fetch(`${API}/mascotas/${mascota.id}/`, { method: 'DELETE' })
      await leerRespuesta(respuesta)
      if (mascotaEditando === mascota.id) cancelarEdicion()
      setAviso('Mascota eliminada.')
      await cargarMascotas()
    } catch (problema) {
      setError(`No pudimos eliminar la mascota. ${problema.message}`)
    }
  }

  return (
    <>
      <section className="hero-subpagina">
        <p className="eyebrow">CUIDADO · ADOPCIÓN RESPONSABLE · NUEVAS OPORTUNIDADES</p>
        <h1>Cada patita merece un hogar.</h1>
        <p>Encuentra a tu compañero ideal y conoce mascotas que esperan una familia amorosa.</p>
      </section>

      <div className="management-layout">
        <section className="panel">
          <p className="eyebrow">{mascotaEditando ? 'ACTUALIZAR REGISTRO' : 'NUEVO INGRESO'}</p>
          <h2>{mascotaEditando ? 'Editar mascota' : 'Registrar mascota'}</h2>
          <p className="panel-intro">Completa sus datos para agregarla al refugio.</p>
          <form className="data-form" onSubmit={guardarMascota}>
            <label>Nombre<input name="nombre" value={formulario.nombre} onChange={cambiarCampo} placeholder="Ej. Luna" required /></label>
            <div className="form-row">
              <label>Especie<select name="especie" value={formulario.especie} onChange={cambiarCampo} required><option value="" disabled>Elige una</option><option value="Perro">Perro</option><option value="Gato">Gato</option><option value="Otro">Otro</option></select></label>
              <label>Raza<input name="raza" value={formulario.raza} onChange={cambiarCampo} placeholder="Ej. Mestizo, Labrador…" /></label>
            </div>
            <div className="form-row">
              <label>Edad<input name="edad" value={formulario.edad} onChange={cambiarCampo} placeholder="Ej. 3 años" /></label>
              <label>Estado<select name="estado" value={formulario.estado} onChange={cambiarCampo}><option>Disponible</option><option>En adopción</option><option>Adoptada</option></select></label>
            </div>
            <label>Refugio asignado<select name="refugio" value={formulario.refugio} onChange={cambiarCampo} required><option value="" disabled>{refugios.length ? 'Elige un refugio' : 'No hay refugios disponibles'}</option>{refugios.map((refugio) => <option key={refugio.id} value={refugio.id}>{refugio.nombre}</option>)}</select></label>
            <label>Descripción y personalidad<textarea name="descripcion" value={formulario.descripcion} onChange={cambiarCampo} rows="3" placeholder="Cuéntanos sobre su historia, personalidad o cuidados especiales…" /></label>
            {error && <p className="notice error" role="alert">{error}</p>}
            {aviso && <p className="notice success" role="status">{aviso}</p>}
            <div className="form-actions">
              {mascotaEditando !== null && <button className="button" type="button" onClick={cancelarEdicion}>Cancelar</button>}
              <button className="button primary full-width" type="submit" disabled={guardando || !refugios.length}>
                {guardando ? 'Guardando…' : mascotaEditando ? 'Guardar cambios' : 'Guardar mascota'} <span aria-hidden="true">→</span>
              </button>
            </div>
          </form>
        </section>

        <section className="records-section">
          <div className="search-bar"><span aria-hidden="true">⌕</span><input value={busqueda} onChange={(evento) => setBusqueda(evento.target.value)} placeholder="Buscar por nombre, raza o refugio…" aria-label="Buscar mascotas" /></div>
          <div className="records-heading"><div><p className="eyebrow">NUESTROS ANIMALES</p><h2>Mascotas registradas <span className="count">{mascotas.length}</span></h2></div><button className="refresh" aria-label="Actualizar mascotas" type="button" onClick={cargarMascotas} disabled={cargando}>↻</button></div>
          {cargando ? <p className="notice" role="status">Cargando mascotas…</p>
            : error && mascotas.length === 0 ? <p className="notice error" role="alert">{error}</p>
              : mascotasFiltradas.length === 0 ? <p className="notice">{mascotas.length ? 'No encontramos mascotas con esa búsqueda.' : 'Pronto te mostraremos a tu compañero de vida.'}</p>
                : <div className="record-list">
                  {mascotasFiltradas.map((mascota) => (
                    <article className="record-card" key={mascota.id}>
                      <span className="animal-icon" aria-hidden="true">{mascota.especie === 'Gato' ? '🐈' : '🐕'}</span>
                      <div className="record-info"><div className="record-title"><h3>{mascota.nombre}</h3><span className="status">{mascota.estado}</span></div><p>{mascota.especie} · {mascota.raza || 'Raza no especificada'} · {mascota.edad || 'Edad no especificada'}</p><small>⌖ {mascota.refugio_nombre ?? mascota.refugio?.nombre ?? refugios.find((refugio) => refugio.id === mascota.refugio)?.nombre ?? 'Refugio'}</small>{mascota.descripcion && <p className="description">{mascota.descripcion}</p>}</div>
                      <div className="record-actions"><button className="button" type="button" onClick={() => comenzarEdicion(mascota)}>Editar</button><button className="button delete" type="button" onClick={() => eliminarMascota(mascota)}>Eliminar</button></div>
                    </article>
                  ))}
                </div>}
        </section>
      </div>
    </>
  )
}

export default Adopcion
