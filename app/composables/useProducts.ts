import { useApi } from './useApi'

export interface Product {
  id: string
  sku: string
  nombre: string
  precio: number
  stock: number
  activo: boolean
  categoriaId?: string
  almacenId?: string
  unidadMedida?: string
  stockMinimo?: number
  proveedorId?: string
  categoria?: any
}

export const useProducts = () => {
  const { fetchApi } = useApi()

  const getProducts = async () => {
    return await fetchApi<Product[]>('/inventario/productos')
  }

  const getProduct = async (id: string) => {
    return await fetchApi<Product>(`/inventario/productos/${id}`)
  }

  const createProduct = async (product: Partial<Product>) => {
    return await fetchApi<Product>('/inventario/productos', {
      method: 'POST',
      body: product
    })
  }

  const updateProduct = async (id: string, product: Partial<Product>) => {
    return await fetchApi<Product>(`/inventario/productos/${id}`, {
      method: 'PATCH',
      body: product
    })
  }

  const deleteProduct = async (id: string) => {
    return await fetchApi(`/inventario/productos/${id}`, {
      method: 'DELETE'
    })
  }

  return {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
  }
}
