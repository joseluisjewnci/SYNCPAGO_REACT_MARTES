export type EstadoRecibo =
  | 'Pendiente'
  | 'Pagado'
  | 'Vencido'
  | 'Hoy'

export type CicloPago =
  | 'unico'
  | 'diario'
  | 'semanal'
  | 'mensual'
  | 'trimestral'
  | 'anual'

export type Categoria =
  | 'Vivienda'
  | 'Servicios'
  | 'Salud'
  | 'Educación'
  | 'Ocio'
  | 'Impuestos'
  | 'Otro'

export interface LoginForm {
  correo: string
  password: string
}

export interface ReciboForm {
  nombre: string
  categoria: Categoria | ''
  monto: number | ''
  fecha: string
  ciclo: CicloPago
  color: string
}

export interface Recibo {
  id: string
  nombre: string
  categoria: Categoria
  monto: number
  fecha: string
  ciclo: CicloPago
  color: string
  estado: EstadoRecibo
  activo: boolean
}

export interface Usuario {
  id: string
  nombre: string
  correo: string
  rol: 'cliente'
}