import { useCallback, useEffect, useState } from 'react'

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
    throw new Error(detalle || `No se pudo completar la solicitud (${respuesta.status}).`)
  }

  return datos
}

function Refugios() {
  const [refugios, setRefugios] = useState([])
  const [formulario, setFormulario] = useState(formularioVacio)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
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

  function cambiarCampo(evento) {
    const { name, value } = evento.target
    setFormulario((actual) => ({ ...actual, [name]: value }))
  }

  async function guardarRefugio(evento) {
    evento.preventDefault()
    setGuardando(true)
    setError('')
    setAviso('')

    try {
      const respuesta = await fetch(`${API}/refugios/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formulario),
      })
      await leerRespuesta(respuesta)
      setFormulario(formularioVacio)
      setAviso('Refugio registrado correctamente.')
      await cargarRefugios()
    } catch (problema) {
      setError(`No pudimos guardar el refugio. ${problema.message}`)
    } finally {
      setGuardando(false)
    }
  }

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

            <button className="button primary full-width" type="submit" disabled={guardando}>
              {guardando ? 'Guardando…' : 'Guardar refugio'} <span aria-hidden="true">→</span>
            </button>
          </form>

          {aviso && <p className="notice success" role="status">{aviso}</p>}
          {error && <p className="notice error" role="alert">{error}</p>}
        </section>

        <section className="records-section" aria-labelledby="titulo-listado-refugios">
          <div className="records-heading">
            <div>
              <p className="eyebrow">NUESTROS HOGARES</p>
              <h2 id="titulo-listado-refugios">
                Refugios registrados <span className="count">{refugios.length}</span>
              </h2>
            </div>
          </div>

          {cargando
            ? <p className="notice" role="status">Cargando refugios…</p>
            : error && refugios.length === 0
              ? <p className="notice error" role="alert">{error}</p>
              : refugios.length === 0
                ? <p className="notice">Aún no hay refugios registrados.</p>
                : <div className="record-list">
                  {refugios.map((refugio) => (
                    <article className="record-card" key={refugio.id}>
                      <span className="animal-icon" aria-hidden="true">⌂</span>
                      <div className="record-info">
                        <div className="record-title"><h3>{refugio.nombre}</h3></div>
                        <p>{refugio.direccion}</p>
                        <small>{refugio.telefono}</small>
                      </div>
                    </article>
                  ))}
                </div>}
        </section>
      </div>
    </>
  )
}

export default Refugios
