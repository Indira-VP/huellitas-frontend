import { useState } from 'react'
import Inicio from './paginas/Inicio.jsx'
import Adopcion from './paginas/Adopcion.jsx'
import Refugios from './paginas/Refugios.jsx'

const paginas = {
  inicio: { nombre: 'Inicio', componente: Inicio },
  adopcion: { nombre: 'Adopción', componente: Adopcion },
  refugios: { nombre: 'Refugios', componente: Refugios },
}

function App() {
  const [pagina, setPagina] = useState('inicio')
  const PaginaActual = paginas[pagina].componente

  return (
    <div className="app">
      <header className="encabezado">
        <a className="marca" href="#inicio" onClick={() => setPagina('inicio')}>Huellitas</a>
        <nav aria-label="Navegación principal">
          {Object.entries(paginas).map(([clave, paginaInfo]) => (
            <button
              className={pagina === clave ? 'enlace activo' : 'enlace'}
              key={clave}
              onClick={() => setPagina(clave)}
              type="button"
            >
              {paginaInfo.nombre}
            </button>
          ))}
        </nav>
      </header>

      <main className="contenido">
        <PaginaActual onNavigate={setPagina} />
      </main>

      <footer className="pie">
        <p>Integrantes: Tatiana Troyana Urrea e Indira Valencia Pavón</p>
        <p>Materia: Desarrollo de páginas web</p>
      </footer>
    </div>
  )
}

export default App
