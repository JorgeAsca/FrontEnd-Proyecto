export const useApi = () => {
  const config = useRuntimeConfig()
  
  const baseURL = import.meta.server ? config.apiBase : config.public.apiBase
  
  const fetchApi = async <T>(endpoint: string, options: any = {}) => {
    return await $fetch<T>(endpoint, {
      baseURL,
      ...options,
      headers: {
        ...options.headers,
      }
    })
  }

  return { fetchApi, baseURL }
}
