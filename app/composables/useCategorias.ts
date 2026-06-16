import { useApi } from './useApi'

export interface Categoria {
  id: string
  nombre: string
  descripcion: string
  activo: boolean
}

export const useCategorias = () => {
  const { fetchApi } = useApi()

  const getCategorias = async () => {
    return await fetchApi<Categoria[]>('/inventario/categorias')
  }

  const createCategoria = async (categoria: Partial<Categoria>) => {
    return await fetchApi<Categoria>('/inventario/categorias', {
      method: 'POST',
      body: categoria
    })
  }

  const updateCategoria = async (id: string, categoria: Partial<Categoria>) => {
    return await fetchApi<Categoria>(`/inventario/categorias/${id}`, {
      method: 'PATCH',
      body: categoria
    })
  }

  const deleteCategoria = async (id: string) => {
    return await fetchApi(`/inventario/categorias/${id}`, {
      method: 'DELETE'
    })
  }

  return {
    getCategorias,
    createCategoria,
    updateCategoria,
    deleteCategoria
  }
}
