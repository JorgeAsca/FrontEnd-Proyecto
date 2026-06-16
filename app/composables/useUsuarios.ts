import { useApi } from './useApi'

export interface Usuario {
  id_usuario?: string
  email: string
  nombre: string
  password?: string
  empresaId: string
  rolId?: string
  rol?: any
}

export const useUsuarios = () => {
  const { fetchApi } = useApi()

  const getUsuarios = async () => {
    return await fetchApi<Usuario[]>('/usuarios')
  }

  const createUsuario = async (usuario: Partial<Usuario>) => {
    return await fetchApi<Usuario>('/usuarios', {
      method: 'POST',
      body: usuario
    })
  }

  const updateUsuario = async (id: string, usuario: Partial<Usuario>) => {
    return await fetchApi<Usuario>(`/usuarios/${id}`, {
      method: 'PATCH',
      body: usuario
    })
  }


  const deleteUsuario = async (id: string) => {
    return await fetchApi<void>(`/usuarios/${id}`, {
      method: 'DELETE'
    })
  }

  return {
    getUsuarios,
    createUsuario,
    updateUsuario,
    deleteUsuario
  }
}

