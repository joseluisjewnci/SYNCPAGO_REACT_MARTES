import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import type { LoginForm } from '../interfaces/types'

interface LoginProps {
  onLoginExitoso: (nombre: string, correo: string) => void
}

const Login = ({ onLoginExitoso }: LoginProps) => {
  const [formulario, setFormulario] = useState<LoginForm>({
    correo: '',
    password: '',
  })

  const [errores, setErrores] = useState({
    correo: false,
    password: false,
  })

  const [cargando, setCargando] = useState(false)

  const inputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormulario({
      ...formulario,
      [name]: value,
    })

    setErrores({
      ...errores,
      [name]: false,
    })
  }

  const validar = (): boolean => {
    const nuevos = {
      correo:
        !formulario.correo ||
        !formulario.correo.includes('@'),
      password: !formulario.password,
    }

    setErrores(nuevos)

    return !nuevos.correo && !nuevos.password
  }

  const envioForm = async (e: FormEvent) => {
    e.preventDefault()

    if (!validar()) return

    setCargando(true)

    try {
      // Aquí se conectará el inicio de sesión con el backend.
      // const data = await AuthAPI.login(
      //   formulario.correo,
      //   formulario.password
      // )
      // onLoginExitoso(
      //   data.usuario.nombre,
      //   data.usuario.correo
      // )

      const nombre = formulario.correo.split('@')[0]

      const nombreFmt =
        nombre.charAt(0).toUpperCase() +
        nombre.slice(1)

      onLoginExitoso(
        nombreFmt,
        formulario.correo,
      )
    } catch {
      setErrores({
        correo: true,
        password: false,
      })
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-inner">
        <span className="auth-logo">
          SYNC<span>PAGO</span>
        </span>

        <section className="auth-card">
          <h1>Iniciar sesión</h1>

          <form onSubmit={envioForm} noValidate>
            <div
              className={`field-group${
                errores.correo ? ' error' : ''
              }`}
            >
              <span className="icon">✉</span>

              <input
                type="email"
                name="correo"
                placeholder="Correo electrónico"
                value={formulario.correo}
                onChange={inputChange}
                autoComplete="email"
              />

              <p className="field-error">
                Ingresa un correo válido.
              </p>
            </div>

            <div
              className={`field-group${
                errores.password ? ' error' : ''
              }`}
            >
              <span className="icon">🔒</span>

              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={formulario.password}
                onChange={inputChange}
                autoComplete="current-password"
              />

              <p className="field-error">
                La contraseña es obligatoria.
              </p>
            </div>

            <a className="forgot-link">
              ¿Olvidaste tu contraseña?
            </a>

            <button
              type="submit"
              className="btn-primary"
              disabled={cargando}
              style={{
                opacity: cargando ? 0.7 : 1,
              }}
            >
              {cargando
                ? 'Iniciando...'
                : 'Iniciar sesión'}
            </button>
          </form>
        </section>

        <p className="auth-link">
          ¿No tienes cuenta? <a>Regístrate</a>
        </p>
      </div>
    </div>
  )
}

export default Login