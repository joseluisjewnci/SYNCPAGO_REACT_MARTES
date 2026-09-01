import { useState } from 'react'
import type { Recibo, ReciboForm } from '../interfaces/types'
import ModalNuevoRecibo from '../components/ModalNuevoRecibo'
import { useStatus } from '../hooks/useStatus'

export function Gastos() {
  const [estadoFiltro, setEstadoFiltro] = useStatus('Todos los estados')
  const [modalAbierto, setModalAbierto] = useState(false)
  
  const [recibos, setRecibos] = useState<Recibo[]>([
    {
      id: '1',
      nombre: 'Luz',
      categoria: 'Vivienda',
      monto: 20000,
      fecha: '31 de ago de 2026',
      ciclo: 'semanal',
      estado: 'Hoy',
      color: '#2563eb',
      activo: true
    }
  ])

  const handleAgregar = (data: ReciboForm) => {
    if (!data.categoria || !data.monto) return

    const nuevo: Recibo = {
      ...data,
      categoria: data.categoria,
      monto: Number(data.monto),
      id: Date.now().toString(),
      estado: 'Pendiente',
      activo: true
    }
    setRecibos([...recibos, nuevo])
    setModalAbierto(false)
  }

  const handleMarcarPagado = (id: string) => {
    setRecibos(recibos.map(r => 
      r.id === id ? { ...r, estado: 'Pagado' } : r
    ))
  }

  const handleEliminar = (id: string) => {
    setRecibos(recibos.filter(r => r.id !== id))
  }

  const recibosFiltrados = recibos.filter(r => {
    if (estadoFiltro === 'Todos los estados') return true
    return r.estado === estadoFiltro
  })

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* BARRA LATERAL (SIDEBAR) */}
      <aside style={{ width: '240px', backgroundColor: '#2563eb', color: '#ffffff', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '10px' }}>SYNCPAGO</h2>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <a href="#" style={{ color: '#ffffff', textDecoration: 'none', padding: '10px 12px', borderRadius: '6px', fontSize: '14px', opacity: 0.8 }}>🏠 Inicio</a>
          <a href="#" style={{ color: '#ffffff', textDecoration: 'none', padding: '10px 12px', borderRadius: '6px', fontSize: '14px', backgroundColor: 'rgba(255, 255, 255, 0.2)', fontWeight: 'bold' }}>💳 Mis Gastos</a>
          <a href="#" style={{ color: '#ffffff', textDecoration: 'none', padding: '10px 12px', borderRadius: '6px', fontSize: '14px', opacity: 0.8 }}>🔔 Recordatorios</a>
          <a href="#" style={{ color: '#ffffff', textDecoration: 'none', padding: '10px 12px', borderRadius: '6px', fontSize: '14px', opacity: 0.8 }}>📊 Estadísticas</a>
          <a href="#" style={{ color: '#ffffff', textDecoration: 'none', padding: '10px 12px', borderRadius: '6px', fontSize: '14px', opacity: 0.8 }}>📜 Historial</a>
        </nav>

        <button 
          onClick={() => setModalAbierto(true)}
          style={{ marginTop: 'auto', backgroundColor: '#22c55e', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'center' }}
        >
          + Agregar Gasto
        </button>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ flex: 1, backgroundColor: '#f3f4f6', padding: '32px' }}>
        
        {/* Título */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Mis Gastos</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
            Gestiona todas tus obligaciones financieras en un solo lugar.
          </p>
        </div>

        {/* Alerta */}
        <div style={{ backgroundColor: '#ffffff', borderLeft: '4px solid #2563eb', padding: '16px', borderRadius: '0 8px 8px 0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '24px', color: '#6b7280', fontSize: '14px' }}>
          Todo gasto registrado puede ser editado en cualquier momento. Al eliminar, el registro se conserva en el historial.
        </div>

        {/* Tarjeta de la Tabla */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px' }}>
          
          {/* Filtros */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <select style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', backgroundColor: '#fff', color: '#374151' }}>
                <option>Todas las categorías</option>
              </select>
              <select 
                value={estadoFiltro} 
                onChange={(e) => setEstadoFiltro(e.target.value)}
                style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', backgroundColor: '#fff', color: '#374151' }}
              >
                <option value="Todos los estados">Todos los estados</option>
                <option value="Hoy">Hoy</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Pagado">Pagado</option>
                <option value="Vencido">Vencido</option>
              </select>
            </div>

            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Buscar gasto..." 
                style={{ padding: '8px 12px 8px 32px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
              />
              <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '12px' }}>🔍</span>
            </div>
          </div>

          {/* Tabla */}
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb', color: '#6b7280', fontSize: '13px', fontWeight: 600 }}>
                <th style={{ paddingBottom: '12px' }}>Empresa/Servicio</th>
                <th style={{ paddingBottom: '12px' }}>Categoría</th>
                <th style={{ paddingBottom: '12px' }}>Monto</th>
                <th style={{ paddingBottom: '12px' }}>Vencimiento</th>
                <th style={{ paddingBottom: '12px' }}>Ciclo</th>
                <th style={{ paddingBottom: '12px' }}>Estado</th>
                <th style={{ paddingBottom: '12px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {recibosFiltrados.map((r) => (
                <tr key={r.id} style={{ borderBottom: '1px solid #f3f4f6', fontSize: '14px', color: '#374151' }}>
                  <td style={{ padding: '16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: r.color || '#2563eb', display: 'inline-block' }} />
                    {r.nombre}
                  </td>
                  <td style={{ padding: '16px 0' }}>{r.categoria}</td>
                  <td style={{ padding: '16px 0', fontWeight: 500 }}>$ {r.monto.toLocaleString()}</td>
                  <td style={{ padding: '16px 0' }}>{r.fecha}</td>
                  <td style={{ padding: '16px 0' }}>{r.ciclo}</td>
                  <td style={{ padding: '16px 0' }}>
                    <span style={{ 
                      backgroundColor: r.estado === 'Pagado' ? '#22c55e' : '#2563eb', 
                      color: '#ffffff', 
                      padding: '4px 12px', 
                      borderRadius: '9999px', 
                      fontSize: '12px', 
                      fontWeight: 500 
                    }}>
                      {r.estado}
                    </span>
                  </td>
                  <td style={{ padding: '16px 0' }}>
                    <button 
                      onClick={() => handleMarcarPagado(r.id)} 
                      title="Marcar como pagado"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '8px' }}
                    >
                      ✅
                    </button>
                    <button 
                      onClick={() => handleEliminar(r.id)} 
                      title="Eliminar gasto"
                      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginación */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', color: '#9ca3af', fontSize: '13px' }}>
            <span>Mostrando 1-{recibosFiltrados.length} de {recibosFiltrados.length}</span>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <button style={{ border: '1px solid #e5e7eb', backgroundColor: '#fff', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', color: '#9ca3af' }}>&larr;</button>
              <button style={{ border: '1px solid #2563eb', backgroundColor: '#fff', padding: '4px 10px', borderRadius: '4px', color: '#2563eb', fontWeight: 600 }}>1</button>
              <button style={{ border: '1px solid #e5e7eb', backgroundColor: '#fff', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', color: '#9ca3af' }}>&rarr;</button>
            </div>
          </div>

          
        </div>

        <ModalNuevoRecibo 
          visible={modalAbierto}
          onCerrar={() => setModalAbierto(false)} 
          onConfirmar={handleAgregar} 
        />
      </main>
    </div>
  )
}

export default Gastos