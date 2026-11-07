function isPrivilegedKey(value) {
  if (/^(?:sb_secret_|service_role)/i.test(value)) return true

  const parts = value.split('.')
  if (parts.length !== 3 || typeof atob !== 'function') return false

  try {
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(payload)).role === 'service_role'
  } catch {
    return false
  }
}

function readSupabaseConfig() {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim()
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()

  const hasPlaceholder = (value) =>
    !value || /your-project-ref|your-supabase-publishable-key|<[^>]+>/i.test(value)

  if (hasPlaceholder(url) || hasPlaceholder(publishableKey)) {
    return {
      url: null,
      publishableKey: null,
      error: 'Supabase belum dikonfigurasi. Isi URL dan publishable key di file .env.',
    }
  }

  let parsedUrl
  try {
    parsedUrl = new URL(url)
  } catch {
    return {
      url: null,
      publishableKey: null,
      error: 'VITE_SUPABASE_URL bukan URL yang valid.',
    }
  }

  const isLocalHost = ['localhost', '127.0.0.1'].includes(parsedUrl.hostname)
  if (!['https:', ...(isLocalHost ? ['http:'] : [])].includes(parsedUrl.protocol)) {
    return { client: null, error: 'VITE_SUPABASE_URL harus menggunakan HTTPS.' }
  }

  if (isPrivilegedKey(publishableKey)) {
    return {
      url: null,
      publishableKey: null,
      error: 'Gunakan publishable key, bukan service_role key, pada aplikasi frontend.',
    }
  }

  return { url, publishableKey, error: null }
}

const configuration = readSupabaseConfig()
let supabaseClientPromise

export const supabaseConfigError = configuration.error
export const isSupabaseConfigured = Boolean(configuration.url && configuration.publishableKey)

export function getSupabaseClient() {
  if (!isSupabaseConfigured) return Promise.resolve(null)

  supabaseClientPromise ??= import('@supabase/supabase-js').then(({ createClient }) =>
    createClient(configuration.url, configuration.publishableKey),
  )

  return supabaseClientPromise
}
