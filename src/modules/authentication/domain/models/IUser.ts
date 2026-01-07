export interface IUser {
  codigo: number
  nome?: string
  cpf?: string
  email?: string
  cargo?: string
  login?: string
  senha?: string
  iosToken?: string
  androidToken?: string
  refreshToken?: string
  status?: string
  foto?: Buffer
}

