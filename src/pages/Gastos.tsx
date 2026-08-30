import { useState } from 'react'
import type { Recibo, ReciboForm } from '../interfaces/types'
import ModalNuevoRecibo from '../components/ModalNuevoRecibo'

interface GastosProps {
  nombreUsuario: string
  correoUsuario: string
  onLogout: () => void
}

const calcularEstado = (
  fecha: string,
  estadoActual: string,
): string => {
  if (estadoActual === 'Pagado') {
    return 'Pagado'
  }

  const diff = Math.ceil(
    (
      new Date(fecha + 'T12:00:00').getTime() -
      new Date().getTime()
    ) / 86400000,
  )

  if (diff < 0) {
    return 'Vencido'
  }

  if (diff === 0) {
    return 'Hoy'
  }

  return 'Pendiente'
}

const BadgeEstado = ({
  estado,
}: {
  estado: string
}) => {
  const clases: Record<string, string> = {
    Pagado: 'badge badge-green',
    Pendiente: 'badge badge-yellow',
    Vencido: 'badge badge-red',
    Hoy: 'badge badge-today',
  }

  return (
    <span
      className={
        clases[estado] || 'badge badge-yellow'
      }
    >
      {estado}
    </span>
  )
}

const formatMoney = (valor: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(valor)

const formatFecha = (str: string) =>
  new Date(
    str + 'T12:00:00',
  ).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

const POR_PAGINA = 8

const Gastos = ({
  nombreUsuario,
  correoUsuario,
  onLogout,
}: GastosProps) => {
  const [recibos, setRecibos] = useState<Recibo[]>([])
  const [modalAbierto, setModalAbierto] =
    useState(false)
  const [dropdownOpen, setDropdownOpen] =
    useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [filtroCat, setFiltroCat] = useState('')
  const [filtroEst, setFiltroEst] = useState('')
  const [pagina, setPagina] = useState(1)

  const listaFiltrada = recibos.filter((r) => {
    const estado = calcularEstado(
      r.fecha,
      r.estado,
    )

    const matchQ =
      !busqueda ||
      r.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase())

    const matchCat =
      !filtroCat ||
      r.categoria === filtroCat

    const matchEst =
      !filtroEst ||
      estado === filtroEst

    return matchQ && matchCat && matchEst
  })

  const totalPags = Math.max(
    1,
    Math.ceil(
      listaFiltrada.length / POR_PAGINA,
    ),
  )

  const paginaActual = Math.min(
    pagina,
    totalPags,
  )

  const inicio =
    (paginaActual - 1) * POR_PAGINA

  const paginada = listaFiltrada.slice(
    inicio,
    inicio + POR_PAGINA,
  )

  const agregarRecibo = (
    form: ReciboForm,
  ) => {
    const nuevo: Recibo = {
      id: crypto.randomUUID(),
      nombre: form.nombre,
      categoria:
        form.categoria as Recibo['categoria'],
      monto: Number(form.monto),
      fecha: form.fecha,
      ciclo: form.ciclo,
      color: form.color,
      estado: 'Pendiente',
      activo: true,
    }

    // Aquí se guardaría el recibo en la base de datos cuando tengamos el backend.

    setRecibos([
      nuevo,
      ...recibos,
    ])

    setModalAbierto(false)
  }

  const marcarPagado = (id: string) => {
    setRecibos(
      recibos.map((r) =>
        r.id === id
          ? {
              ...r,
              estado: 'Pagado',
            }
          : r,
      ),
    )
  }

  const marcarPendiente = (
    id: string,
  ) => {
    setRecibos(
      recibos.map((r) =>
        r.id === id
          ? {
              ...r,
              estado: 'Pendiente',
            }
          : r,
      ),
    )
  }

  const eliminar = (id: string) => {
    if (
      !window.confirm(
        '¿Seguro que deseas eliminar este recibo?',
      )
    ) {
      return
    }

    // Aquí se eliminaría el recibo de la base de datos cuando tengamos el backend.

    setRecibos(
      recibos.filter(
        (r) => r.id !== id,
      ),
    )
  }

  return (
    <div className="app-layout">
      {/* Menú lateral */}

      <nav
        className="sidebar"
        id="sidebar"
      >
        <div className="sidebar-logo">
          SYNC<span>PAGO</span>
        </div>

        <div className="sidebar-nav">
          {[
            {
              icon: '🏠',
              texto: 'Inicio',
              activo: false,
            },
            {
              icon: '📋',
              texto: 'Mis Gastos',
              activo: true,
            },
            {
              icon: '🔔',
              texto: 'Recordatorios',
              activo: false,
            },
            {
              icon: '📊',
              texto: 'Estadísticas',
              activo: false,
            },
            {
              icon: '🕓',
              texto: 'Historial',
              activo: false,
            },
          ].map((item, i) => (
            <button
              key={i}
              className={`nav-item${
                item.activo
                  ? ' active'
                  : ''
              }`}
            >
              {item.icon} {item.texto}
            </button>
          ))}
        </div>

        <button
          className="nav-btn-add"
          onClick={() =>
            setModalAbierto(true)
          }
        >
          + Agregar Gasto
        </button>
      </nav>

      {/* Contenido principal */}

      <div className="main-wrap">
        {/* Barra superior */}

        <header className="topbar">
          <div className="search-bar">
            <span className="search-icon">
              🔍
            </span>

            <input
              type="text"
              placeholder="Buscar por Empresa/Servicio..."
              value={busqueda}
              onChange={(e) => {
                setBusqueda(
                  e.target.value,
                )
                setPagina(1)
              }}
            />
          </div>

          <div className="topbar-right">
            <button className="notif-btn">
              🔔
            </button>

            <div
              className="user-menu"
              onClick={() =>
                setDropdownOpen(
                  !dropdownOpen,
                )
              }
            >
              <div className="avatar">
                👤
              </div>

              <span>
                {nombreUsuario.slice(
                  0,
                  2,
                )}
              </span>

              <span>▾</span>

              {dropdownOpen && (
                <div className="user-dropdown open">
                  <div className="dd-header">
                    <div className="dd-avatar">
                      👤
                    </div>

                    <div className="dd-name">
                      {nombreUsuario}
                    </div>

                    <div className="dd-email">
                      {correoUsuario}
                    </div>
                  </div>

                  <div
                    className="dd-item logout"
                    onClick={onLogout}
                  >
                    Cerrar sesión ↩
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Información y contenido de la página */}

        <main className="content">
          <header className="page-header">
            <h1>Mis Gastos</h1>

            <p>
              Gestiona todas tus obligaciones
              financieras en un solo lugar.
            </p>
          </header>

          <div className="page-notice">
            Todo gasto registrado puede ser
            editado en cualquier momento.
            Al eliminar, el registro se
            conserva en el historial.
          </div>

          {/* Filtros para buscar y ordenar los gastos */}

          <div className="table-toolbar">
            <select
              className="filter-btn"
              value={filtroCat}
              onChange={(e) => {
                setFiltroCat(
                  e.target.value,
                )
                setPagina(1)
              }}
            >
              <option value="">
                Todas las categorías
              </option>

              <option value="Vivienda">
                Vivienda
              </option>

              <option value="Servicios">
                Servicios
              </option>

              <option value="Salud">
                Salud
              </option>

              <option value="Educación">
                Educación
              </option>

              <option value="Ocio">
                Ocio
              </option>

              <option value="Impuestos">
                Impuestos
              </option>

              <option value="Otro">
                Otro
              </option>
            </select>

            <select
              className="filter-btn"
              value={filtroEst}
              onChange={(e) => {
                setFiltroEst(
                  e.target.value,
                )
                setPagina(1)
              }}
            >
              <option value="">
                Todos los estados
              </option>

              <option value="Pendiente">
                Pendiente
              </option>

              <option value="Hoy">
                Hoy
              </option>

              <option value="Vencido">
                Vencido
              </option>

              <option value="Pagado">
                Pagado
              </option>
            </select>

            <div className="search-input-wrap">
              <span
                style={{
                  color:
                    'var(--gray-400)',
                  fontSize: '0.85rem',
                }}
              >
                🔍
              </span>

              <input
                type="text"
                placeholder="Buscar gasto..."
                value={busqueda}
                onChange={(e) => {
                  setBusqueda(
                    e.target.value,
                  )
                  setPagina(1)
                }}
              />
            </div>
          </div>

          {/* Lista de gastos */}

          <table className="data-table">
            <thead>
              <tr>
                <th>
                  Empresa/Servicio
                </th>
                <th>Categoría</th>
                <th>Monto</th>
                <th>Vencimiento</th>
                <th>Ciclo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {paginada.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      textAlign: 'center',
                      padding: '28px',
                      color:
                        'var(--gray-400)',
                    }}
                  >
                    Sin gastos registrados.
                    Haz clic en "+ Agregar Gasto"
                    para comenzar.
                  </td>
                </tr>
              ) : (
                paginada.map(
                  (r: Recibo) => {
                    const estado =
                      calcularEstado(
                        r.fecha,
                        r.estado,
                      )

                    return (
                      <tr key={r.id}>
                        <td>
                          <span className="service-cell">
                            <span
                              className="color-dot"
                              style={{
                                background:
                                  r.color,
                              }}
                            />

                            {r.nombre}
                          </span>
                        </td>

                        <td>
                          {r.categoria}
                        </td>

                        <td>
                          {formatMoney(
                            r.monto,
                          )}
                        </td>

                        <td>
                          {formatFecha(
                            r.fecha,
                          )}
                        </td>

                        <td>
                          {r.ciclo}
                        </td>

                        <td>
                          <BadgeEstado
                            estado={
                              estado
                            }
                          />
                        </td>

                        <td>
                          {estado ===
                          'Pagado' ? (
                            <button
                              className="action-btn"
                              title="Desmarcar"
                              onClick={() =>
                                marcarPendiente(
                                  r.id,
                                )
                              }
                            >
                              ↩
                            </button>
                          ) : (
                            <button
                              className="action-btn"
                              title="Marcar pagado"
                              onClick={() =>
                                marcarPagado(
                                  r.id,
                                )
                              }
                            >
                              ✅
                            </button>
                          )}

                          <button
                            className="action-btn del"
                            title="Eliminar"
                            onClick={() =>
                              eliminar(
                                r.id,
                              )
                            }
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    )
                  },
                )
              )}
            </tbody>
          </table>
                    {/* Páginas de resultados */}

          <div className="pagination">
            <span>
              Mostrando{' '}
              {listaFiltrada.length === 0
                ? 0
                : inicio + 1}
              -
              {Math.min(
                inicio + POR_PAGINA,
                listaFiltrada.length,
              )}{' '}
              de {listaFiltrada.length}
            </span>

            <div className="pagination-buttons">
              <button
                className="page-btn"
                disabled={paginaActual <= 1}
                onClick={() =>
                  setPagina(
                    Math.max(
                      1,
                      paginaActual - 1,
                    ),
                  )
                }
              >
                ←
              </button>

              {Array.from(
                {
                  length: totalPags,
                },
                (_, i) => i + 1,
              ).map((num) => (
                <button
                  key={num}
                  className={`page-btn${
                    paginaActual === num
                      ? ' active'
                      : ''
                  }`}
                  onClick={() =>
                    setPagina(num)
                  }
                >
                  {num}
                </button>
              ))}

              <button
                className="page-btn"
                disabled={
                  paginaActual >= totalPags
                }
                onClick={() =>
                  setPagina(
                    Math.min(
                      totalPags,
                      paginaActual + 1,
                    ),
                  )
                }
              >
                →
              </button>
            </div>
          </div>

          {/* Botón para agregar un nuevo gasto */}

          <div className="add-expense-wrap">
            <button
              className="btn-add-expense"
              onClick={() =>
                setModalAbierto(true)
              }
            >
              + Agregar Gasto
            </button>
          </div>
        </main>

        {/* Pie de página */}

        <footer
          style={{
            padding: '16px 28px',
            fontSize: '0.78rem',
            color: 'var(--gray-400)',
            textAlign: 'center',
            borderTop:
              '1px solid var(--gray-200)',
          }}
        >
          © 2026 SYNCPAGO — Todos los derechos
          reservados
        </footer>
      </div>

      {/* Ventana para agregar un gasto */}

      <ModalNuevoRecibo
        visible={modalAbierto}
        onCerrar={() =>
          setModalAbierto(false)
        }
        onConfirmar={agregarRecibo}
      />
    </div>
  )
}

export default Gastos