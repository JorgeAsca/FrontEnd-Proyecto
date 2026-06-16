import { useApi } from './useApi'

export function useConfiguracion() {
  const { fetchApi } = useApi()

  async function getGlobalConfigs() {
    try {
      const data = await fetchApi<any[]>('/configuracion/global')
      return data || []
    } catch (error) {
      console.error('Error fetching global configs:', error)
      return []
    }
  }

  async function upsertGlobalConfig(clave: string, valor: string) {
    try {
      const data = await fetchApi<any>('/configuracion/global/upsert', {
        method: 'POST',
        body: { clave, valor }
      })
      return data
    } catch (error) {
      console.error(`Error saving config ${clave}:`, error)
      return null
    }
  }

  return {
    getGlobalConfigs,
    upsertGlobalConfig
  }
}
