export function useMcbannersApiBase(): string {
  const config = useRuntimeConfig()
  return (
    config.public.mcbannersApiBase || 'https://api.mcbanners.com'
  ).replace(/\/$/, '')
}

export function useMcbannersApiUrl(path: string): string {
  const base = useMcbannersApiBase()
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalizedPath}`
}
