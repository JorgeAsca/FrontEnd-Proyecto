import { useApi } from './useApi'

export interface Role {
  id_rol: string
  nombre: string
}

export const useRoles = () => {
  const { fetchApi } = useApi()

  const getRoles = async () => {
    return await fetchApi<Role[]>('/usuarios/roles')
  }

  const createRole = async (role: Partial<Role> & { permisos?: string[] }) => {
    return await fetchApi<Role>('/usuarios/roles', {
      method: 'POST',
      body: role
    })
  }

  const updateRole = async (id: string, role: Partial<Role> & { permisos?: string[] }) => {
    return await fetchApi<Role>(`/usuarios/roles/${id}`, {
      method: 'PATCH',
      body: role
    })
  }

  const deleteRole = async (id: string) => {
    return await fetchApi<void>(`/usuarios/roles/${id}`, {
      method: 'DELETE'
    })
  }

  return {
    getRoles,
    createRole,
    updateRole,
    deleteRole
  }
}
