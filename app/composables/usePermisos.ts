import { useApi } from './useApi'

export interface Permiso {
  id_permiso: string
  nombre: string
  descripcion?: string
}

export const usePermisos = () => {
  const { fetchApi } = useApi()

  const getPermisos = async () => {
    return await fetchApi<Permiso[]>('/usuarios/permisos')
  }

  return {
    getPermisos
  }
}
