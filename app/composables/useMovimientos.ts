import { useApi } from './useApi'

export interface Movimiento {
  id: string
  id_producto: string
  id_almacen: string
  tipo: 'ENTRADA' | 'SALIDA'
  cantidad: number
  referencia_externa?: string
  id_usuario?: string
  fecha_movimiento: string
}

export const useMovimientos = () => {
  const { fetchApi } = useApi()

  const getMovimientos = async (empresaId?: string) => {
    const url = empresaId ? `/logistica/movimientos?empresaId=${empresaId}` : '/logistica/movimientos'
    return await fetchApi<Movimiento[]>(url)
  }

  const createMovimiento = async (movimiento: Partial<Movimiento>) => {
    return await fetchApi<Movimiento>('/logistica/movimientos', {
      method: 'POST',
      body: movimiento
    })
  }

  const getStockByProducto = async (productoId: string) => {
    return await fetchApi<any[]>(`/logistica/stock/${productoId}`)
  }

  return {
    getMovimientos,
    createMovimiento,
    getStockByProducto
  }
}
