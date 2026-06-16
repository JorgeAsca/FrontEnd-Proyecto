import { useApi } from './useApi'

export interface Empresa {
  id_empresa: string
  nombre_legal: string
  nombre_comercial: string
  nif_cif: string
}

export const useEmpresas = () => {
  const { fetchApi } = useApi()

  const getEmpresas = async () => {
    return await fetchApi<Empresa[]>('/administracion/empresas')
  }

  const createEmpresa = async (empresa: Partial<Empresa>) => {
    return await fetchApi<Empresa>('/administracion/empresas', {
      method: 'POST',
      body: empresa
    })
  }

  const updateEmpresa = async (id: string, empresa: Partial<Empresa>) => {
    return await fetchApi<Empresa>(`/administracion/empresas/${id}`, {
      method: 'PATCH',
      body: empresa
    })
  }

  const deleteEmpresa = async (id: string) => {
    return await fetchApi<void>(`/administracion/empresas/${id}`, {
      method: 'DELETE'
    })
  }

  return {
    getEmpresas,
    createEmpresa,
    updateEmpresa,
    deleteEmpresa
  }
}
