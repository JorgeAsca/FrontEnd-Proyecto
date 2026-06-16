import { ref } from 'vue'
import { useApi } from './useApi'

export interface Proveedor {
  id: string
  codigo: string
  razon_social: string
  contacto_nombre: string
  email: string
  telefono: string
  direccion: string
  activo: boolean
}

export const useProveedores = () => {
  const { fetchApi } = useApi()
  const error = ref<string | null>(null)
  const loading = ref(false)

  const getProveedores = async (id_empresa: string): Promise<Proveedor[] | null> => {
    loading.value = true
    try {
      const data = await fetchApi<Proveedor[]>(`/ventas/proveedores/${id_empresa}`)
      return data
    } catch (err: any) {
      error.value = err.message
      return null
    } finally {
      loading.value = false
    }
  }

  const createProveedor = async (payload: Partial<Proveedor>): Promise<Proveedor | null> => {
    loading.value = true
    try {
      const data = await fetchApi<Proveedor>('/ventas/proveedores', {
        method: 'POST',
        body: payload
      })
      return data
    } catch (err: any) {
      error.value = err.message
      return null
    } finally {
      loading.value = false
    }
  }

  const updateProveedor = async (id: string, payload: Partial<Proveedor>): Promise<Proveedor | null> => {
    loading.value = true
    try {
      const data = await fetchApi<Proveedor>(`/ventas/proveedores/${id}`, {
        method: 'PATCH',
        body: payload
      })
      return data
    } catch (err: any) {
      error.value = err.message
      return null
    } finally {
      loading.value = false
    }
  }

  const deleteProveedor = async (id: string): Promise<boolean> => {
    loading.value = true
    try {
      await fetchApi(`/ventas/proveedores/${id}`, {
        method: 'DELETE'
      })
      return true
    } catch (err: any) {
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    getProveedores,
    createProveedor,
    updateProveedor,
    deleteProveedor,
    error,
    loading
  }
}
