import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import type { ReciboForm } from '../interfaces/types'

interface ModalNuevoReciboProps {
  visible: boolean
  onCerrar: () => void
  onConfirmar: (recibo: ReciboForm) => void
}

const FORM_INICIAL: ReciboForm = {
  nombre: '',
  categoria: '',
  monto: '',
  fecha: '',
  ciclo: 'mensual',
  color: '#3563e9',
}

const ModalNuevoRecibo = ({
  visible,
  onCerrar,
  onConfirmar,
}: ModalNuevoReciboProps) => {
  const [formulario, setFormulario] =
    useState<ReciboForm>(FORM_INICIAL)

  const [errores, setErrores] = useState({
    nombre: false,
    monto: false,
    fecha: false,
  })

  const inputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target

    setFormulario({
      ...formulario,
      [name]: value,
    })

    if (name in errores) {
      setErrores({
        ...errores,
        [name]: false,
      })
    }
  }

  const validar = (): boolean => {
    const nuevos = {
      nombre: !formulario.nombre.trim(),
      monto:
        !formulario.monto ||
        Number(formulario.monto) <= 0,
      fecha: !formulario.fecha,
    }

    setErrores(nuevos)

    return (
      !nuevos.nombre &&
      !nuevos.monto &&
      !nuevos.fecha
    )
  }

  const envioForm = (e: FormEvent) => {
    e.preventDefault()

    if (!validar()) return

    onConfirmar(formulario)

    setFormulario(FORM_INICIAL)

    setErrores({
      nombre: false,
      monto: false,
      fecha: false,
    })
  }

  const handleCerrar = () => {
    setFormulario(FORM_INICIAL)

    setErrores({
      nombre: false,
      monto: false,
      fecha: false,
    })

    onCerrar()
  }

  return (
    <div
      className={`modal-overlay${
        visible ? ' open' : ''
      }`}
      onClick={handleCerrar}
    >
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <button
            className="modal-back"
            onClick={handleCerrar}
          >
            ←
          </button>

          <h2>Nuevo recibo</h2>
        </div>

        <form onSubmit={envioForm} noValidate>
          <div className="modal-body">
            <div
              className={`form-field${
                errores.nombre ? ' error' : ''
              }`}
            >
              <label htmlFor="new-nombre">
                Nombre del recibo 📋
              </label>

              <input
                id="new-nombre"
                type="text"
                name="nombre"
                placeholder="Ej: Arriendo, Luz, Netflix..."
                value={formulario.nombre}
                onChange={inputChange}
              />

              <p className="field-error">
                El nombre es obligatorio.
              </p>
            </div>

            <div className="form-field">
              <label htmlFor="new-categoria">
                Categoría
              </label>

              <div className="select-wrap">
                <select
                  id="new-categoria"
                  name="categoria"
                  value={formulario.categoria}
                  onChange={inputChange}
                >
                  <option value="">
                    Seleccionar categoría
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
              </div>
            </div>

            <div
              className={`form-field${
                errores.monto ? ' error' : ''
              }`}
            >
              <label htmlFor="new-monto">
                $ Monto
              </label>

              <input
                id="new-monto"
                type="number"
                name="monto"
                placeholder="0"
                min="0"
                value={formulario.monto}
                onChange={inputChange}
              />

              <p className="field-error">
                Ingresa un monto válido mayor a 0.
              </p>
            </div>

            <div
              className={`form-field${
                errores.fecha ? ' error' : ''
              }`}
            >
              <label htmlFor="new-fecha">
                Fecha de vencimiento 📅
              </label>

              <input
                id="new-fecha"
                type="date"
                name="fecha"
                value={formulario.fecha}
                onChange={inputChange}
              />

              <p className="field-error">
                La fecha es obligatoria.
              </p>
            </div>

            <div className="form-field">
              <label htmlFor="new-ciclo">
                Ciclo de pago 🔁
              </label>

              <div className="select-wrap">
                <select
                  id="new-ciclo"
                  name="ciclo"
                  value={formulario.ciclo}
                  onChange={inputChange}
                >
                  <option value="unico">Único</option>
                  <option value="diario">Diario</option>
                  <option value="semanal">
                    Semanal
                  </option>
                  <option value="mensual">
                    Mensual
                  </option>
                  <option value="trimestral">
                    Trimestral
                  </option>
                  <option value="anual">
                    Anual
                  </option>
                </select>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="new-color">
                Color identificador 🎨
              </label>

              <div className="color-picker-row">
                <input
                  id="new-color"
                  type="color"
                  name="color"
                  value={formulario.color}
                  onChange={inputChange}
                />

                <span
                  style={{
                    fontSize: '0.83rem',
                    color: 'var(--gray-500)',
                  }}
                >
                  Elige un color para identificar
                  este gasto
                </span>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="submit"
              className="btn-confirm"
            >
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModalNuevoRecibo