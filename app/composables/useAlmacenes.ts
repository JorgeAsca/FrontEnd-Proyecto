import { useApi } from './useApi'

export interface Almacen {
  id: string
  id_empresa: string
  codigo?: string
  nombre: string
  estado: string
  createdAt: string
  
  // Virtual properties that might be useful
  usedCapacity?: number
  productCount?: number
}

export const useAlmacenes = () => {
  const { fetchApi } = useApi()

  const getAlmacenes = async (empresaId?: string) => {
    const url = empresaId ? `/logistica/almacenes?empresaId=${empresaId}` : '/logistica/almacenes'
    return await fetchApi<Almacen[]>(url)
  }

  const createAlmacen = async (almacen: Partial<Almacen>) => {
    return await fetchApi<Almacen>('/logistica/almacenes', {
      method: 'POST',
      body: almacen
    })
  }

  const updateAlmacen = async (id: string, almacen: Partial<Almacen>) => {
    return await fetchApi<Almacen>(`/logistica/almacenes/${id}`, {
      method: 'POST',
      body: almacen
    })
  }

  const deleteAlmacen = async (id: string) => {
    return await fetchApi<{ success: boolean }>(`/logistica/almacenes/delete/${id}`, {
      method: 'POST'
    })
  }

  const getWarehouseStock = async (id: string) => {
    return await fetchApi<any[]>(`/logistica/almacenes/${id}/stock`)
  }

  return {
    getAlmacenes,
    createAlmacen,
    updateAlmacen,
    deleteAlmacen,
    getWarehouseStock
  }
}
