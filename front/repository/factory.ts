// import { useRuntimeConfig } from '#app'

// export const apiFactory = () => {
//   const config = useRuntimeConfig()

//   const fetcher = <T>(url: string, options: any = {}): Promise<T> => {
//     return $fetch<T>(`${config.public.apiBase}${url}`, {
//       ...options,
//     })
//   }

//   return {
//     fetcher,
//   }
// }

export const apiFactory = () => {
  const fetcher = <T>(url: string, options: any = {}): Promise<T> => {
    return $fetch<T>(`/api${url}`, {
      ...options,
    })
  }

  return {
    fetcher,
  }
}