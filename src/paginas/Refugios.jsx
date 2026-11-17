import { useCallback, useEffect, useMemo, useState } from 'react'
import './Refugios.css'

const API = 'http://127.0.0.1:8000/api'
const formularioVacio = { nombre: '', direccion: '', telefono: '' }

function obtenerLista(datos) {
  return Array.isArray(datos) ? datos : datos?.results ?? []
}

async function leerRespuesta(respuesta) {
  const datos = respuesta.status === 204
    ? null
    : await respuesta.json().catch(() => null)

  if (!respuesta.ok) {
    const detalle = datos && typeof datos === 'object'
      ? Object.values(datos).flat().join(' ')
      : ''
    const problema = new Error(detalle || `No se pudo completar la solicitud (${respuesta.status}).`)
    problema.status = respuesta.status
    throw problema
  }

  return datos
}

function Refugios() {
  const [refugios, setRefugios] = useState([])
  const [formulario, setFormulario] = useState(formularioVacio)
  const [refugioEditando, setRefugioEditando] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [eliminandoId, setEliminandoId] = useState(null)
  const [error, setError] = useState('')
  const [aviso, setAviso] = useState('')

  const cargarRefugios = useCallback(async () => {
    setCargando(true)
    setError('')

    try {
      const respuesta = await fetch(`${API}/refugios/`)
      const datos = await leerRespuesta(respuesta)
      setRefugios(obtenerLista(datos))
    } catch (problema) {
      setError(`No pudimos cargar los refugios. ${problema.message}`)
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    cargarRefugios()
  }, [cargarRefugios])

  const refugiosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLocaleLowerCase()
    if (!termino) return refugios

    return refugios.filter((refugio) =>
      [refugio.nombre, refugio.direccion, refugio.telefono]
        .some((dato) => String(dato ?? '').toLocaleLowerCase().includes(termino)),
    )
  }, [refugios, busqueda])

  function cambiarCampo(evento) {
    const { name, value } = evento.target
    setFormulario((actual) => ({ ...actual, [name]: value }))
  }

  function comenzarEdicion(refugio) {
    setRefugioEditando(refugio.id)
    setFormulario({
      nombre: refugio.nombre ?? '',
      direccion: refugio.direccion ?? '',
      telefono: refugio.telefono ?? '',
    })
    setError('')
    setAviso('')
  }

  function cancelarEdicion() {
    setRefugioEditando(null)
    setFormulario(formularioVacio)
    setError('')
    setAviso('')
  }

  async function guardarRefugio(evento) {
    evento.preventDefault()
    setGuardando(true)
    setError('')
    setAviso('')
    const editando = refugioEditando !== null

    try {
      const respuesta = await fetch(
        editando ? `${API}/refugios/${refugioEditando}/` : `${API}/refugios/`,
        {
          method: editando ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formulario),
        },
      )
      await leerRespuesta(respuesta)
      setRefugioEditando(null)
      setFormulario(formularioVacio)
      setAviso(
        editando ? 'Refugio actualizado correctamente.' : 'Refugio registrado correctamente.',
      )
      await cargarRefugios()
    } catch (problema) {
      const accion = editando ? 'actualizar' : 'guardar'
      setError(`No pudimos ${accion} el refugio. ${problema.message}`)
    } finally {
      setGuardando(false)
    }
  }

  async function eliminarRefugio(refugio) {
    if (!window.confirm(`¿Quieres eliminar el refugio ${refugio.nombre}?`)) return

    setEliminandoId(refugio.id)
    setError('')
    setAviso('')

    try {
      const respuesta = await fetch(`${API}/refugios/${refugio.id}/`, {
        method: 'DELETE',
      })
      await leerRespuesta(respuesta)
      setAviso('Refugio eliminado correctamente.')
      await cargarRefugios()
    } catch (problema) {
      const detalle = problema.status >= 500
        ? 'El servidor no pudo completar la eliminación. Si hay mascotas asociadas, puede estar impidiéndola.'
        : problema.message
      setError(`No pudimos eliminar el refugio. ${detalle}`)
    } finally {
      setEliminandoId(null)
    }
  }

  return (
    <>
      <section className="hero-subpagina hero-refugios">
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
          <p className="eyebrow">
            {refugioEditando !== null ? 'ACTUALIZAR SEDE / ALBERGUE' : 'NUEVA SEDE / ALBERGUE'}
          </p>
          <h2 id="titulo-formulario-refugio">
            {refugioEditando !== null ? 'Editar refugio' : 'Registrar refugio'}
          </h2>
          <p className="panel-intro">
            Completa los datos del espacio de acogida para incorporarlo a la red
            oficial de Huellitas.
          </p>

          <form className="data-form" onSubmit={guardarRefugio}>
            <label htmlFor="nombre-refugio">
              Nombre del refugio
              <input
                id="nombre-refugio"
                name="nombre"
                value={formulario.nombre}
                onChange={cambiarCampo}
                placeholder="Ej. Refugio San Roque"
                required
              />
            </label>

            <label htmlFor="direccion-refugio">
              Dirección
              <input
                id="direccion-refugio"
                name="direccion"
                value={formulario.direccion}
                onChange={cambiarCampo}
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
                value={formulario.telefono}
                onChange={cambiarCampo}
                placeholder="Ej. +57 300 123 4567"
                required
              />
            </label>

            <div className="form-actions">
              {refugioEditando !== null && (
                <button
                  className="button"
                  type="button"
                  onClick={cancelarEdicion}
                  disabled={guardando}
                >
                  Cancelar
                </button>
              )}
              <button className="button primary full-width" type="submit" disabled={guardando}>
                {guardando
                  ? 'Guardando…'
                  : refugioEditando !== null
                    ? 'Guardar cambios'
                    : 'Guardar refugio'}
                <span aria-hidden="true"> →</span>
              </button>
            </div>
          </form>

          {aviso && <p className="notice success" role="status">{aviso}</p>}
          {error && <p className="notice error" role="alert">{error}</p>}
        </section>

        <section className="records-section" aria-labelledby="titulo-listado-refugios">
          <div className="search-bar">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
              placeholder="Buscar por nombre, dirección o teléfono…"
              aria-label="Buscar refugios por nombre, dirección o teléfono"
            />
          </div>

          <div className="records-heading">
            <div>
              <p className="eyebrow">NUESTROS HOGARES</p>
              <h2 id="titulo-listado-refugios">
                Refugios registrados <span className="count">{refugios.length}</span>
              </h2>
            </div>
          </div>

          {cargando ? (
            <p className="notice" role="status">Cargando refugios…</p>
          ) : error && refugios.length === 0 ? (
            <p className="notice error" role="alert">{error}</p>
          ) : refugiosFiltrados.length === 0 ? (
            <p className="notice">
              {refugios.length === 0
                ? 'Aún no hay refugios registrados.'
                : 'No encontramos refugios con esa búsqueda.'}
            </p>
          ) : (
            <div className="record-list">
              {refugiosFiltrados.map((refugio) => (
                <article className="record-card" key={refugio.id}>
                  <span className="animal-icon" aria-hidden="true">⌂</span>
                  <div className="record-info">
                    <div className="record-title"><h3>{refugio.nombre}</h3></div>
                    <p>{refugio.direccion}</p>
                    <small>{refugio.telefono}</small>
                  </div>
                  <div className="record-actions">
                    <button
                      className="button"
                      type="button"
                      onClick={() => comenzarEdicion(refugio)}
                      disabled={guardando || eliminandoId !== null}
                    >
                      Editar
                    </button>
                    <button
                      className="button delete"
                      type="button"
                      onClick={() => eliminarRefugio(refugio)}
                      disabled={guardando || eliminandoId !== null}
                    >
                      {eliminandoId === refugio.id ? 'Eliminando…' : 'Eliminar'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  )
}

export default Refugios
