import { useState } from 'react'
import Login from './pages/Login'
import Gastos from './pages/Gastos'

const App = () => {
  const [usuario, setUsuario] = useState<string | null>(null)
  const [correo, setCorreo] = useState<string>('')

  const handleLoginExitoso = (
    nombre: string,
    correoUsuario: string,
  ) => {
    setUsuario(nombre)
    setCorreo(correoUsuario)
  }

  const handleLogout = () => {
    setUsuario(null)
    setCorreo('')
  }

  return usuario === null ? (
    <Login onLoginExitoso={handleLoginExitoso} />
  ) : (
    <Gastos
      nombreUsuario={usuario}
      correoUsuario={correo}
      onLogout={handleLogout}
    />
  )
}

export default App