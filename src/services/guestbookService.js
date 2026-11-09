import {
  getSupabaseRestConfig,
  isSupabaseConfigured,
  supabaseConfigError,
} from '../lib/supabase.js'

const GUESTBOOK_COLUMNS = 'id, name, message, attendance, created_at'
const GUESTBOOK_ENDPOINT = '/rest/v1/guestbook'
export const GUESTBOOK_ATTENDANCE_OPTIONS = ['Hadir', 'Tidak Hadir', 'Masih Ragu']
export const GUESTBOOK_NAME_MAX_LENGTH = 120
export const GUESTBOOK_MESSAGE_MAX_LENGTH = 1000

const SECRET_PATTERNS = [/Bearer\s+\S+/gi]

function sanitizeDebugText(value, publishableKey) {
  if (typeof value !== 'string') return undefined

  let safeText = value.replace(/[\u0000-\u001f\u007f]/g, ' ')
  if (publishableKey) safeText = safeText.split(publishableKey).join('[redacted]')
  for (const pattern of SECRET_PATTERNS) safeText = safeText.replace(pattern, 'Bearer [redacted]')
  return safeText.slice(0, 500)
}

export class GuestbookServiceError extends Error {
  constructor(category, message, debug = {}) {
    super(message)
    this.name = 'GuestbookServiceError'
    this.category = category
    this.debug = debug
  }
}

function classifyHttpError(status, code) {
  if (status === 401 || status === 403 || code === '42501') return 'permission'
  if (
    ['PGRST204', 'PGRST205', '42703', '42P01', '42804'].includes(code) ||
    (status === 404 && code.startsWith('PGRST'))
  ) return 'schema'
  return 'http'
}

async function requestGuestbook({ method, params, payload }) {
  if (!isSupabaseConfigured) {
    throw new GuestbookServiceError('configuration', supabaseConfigError, {
      category: 'configuration',
    })
  }

  const { url: supabaseUrl, publishableKey } = getSupabaseRestConfig()
  const endpoint = new URL(GUESTBOOK_ENDPOINT, `${supabaseUrl.replace(/\/+$/, '')}/`)
  if (params) endpoint.search = params.toString()

  const headers = {
    apikey: publishableKey,
    Authorization: `Bearer ${publishableKey}`,
    'Content-Type': 'application/json',
  }

  if (method === 'POST') headers.Prefer = 'return=representation'

  let response
  try {
    response = await fetch(endpoint, {
      method,
      headers,
      ...(payload ? { body: JSON.stringify(payload) } : {}),
    })
  } catch {
    throw new GuestbookServiceError('network', 'Koneksi ke layanan RSVP tidak tersedia.', {
      category: 'network',
    })
  }

  const responseText = await response.text()
  let responseBody
  if (responseText) {
    try {
      responseBody = JSON.parse(responseText)
    } catch {
      responseBody = null
    }
  }

  if (!response.ok) {
    const code = sanitizeDebugText(responseBody?.code, publishableKey)
    const category = classifyHttpError(response.status, code ?? '')
    const serverMessage = sanitizeDebugText(responseBody?.message, publishableKey)
    const details = sanitizeDebugText(responseBody?.details, publishableKey)
    const hint = sanitizeDebugText(responseBody?.hint, publishableKey)
    throw new GuestbookServiceError(category, 'Permintaan RSVP belum dapat diproses.', {
      category,
      status: response.status,
      code,
      message: serverMessage,
      details,
      hint,
    })
  }

  if (!responseText) return null
  if (responseBody === undefined || responseBody === null) {
    throw new GuestbookServiceError('http', 'Respons layanan RSVP tidak dapat dibaca.', {
      category: 'http',
      status: response.status,
      code: 'INVALID_JSON_RESPONSE',
    })
  }
  return responseBody
}

export async function getGuestbook() {
  const params = new URLSearchParams({
    select: GUESTBOOK_COLUMNS,
    order: 'created_at.desc',
    limit: '20',
  })
  const data = await requestGuestbook({ method: 'GET', params })
  return Array.isArray(data) ? data : []
}

export async function createGuestbookEntry(payload) {
  const name = typeof payload?.name === 'string' ? payload.name.trim() : ''
  const message = typeof payload?.message === 'string' ? payload.message.trim() : ''
  const attendance = payload?.attendance

  if (!name || name.length > GUESTBOOK_NAME_MAX_LENGTH) {
    throw new GuestbookServiceError(
      'validation',
      `Nama wajib diisi dan maksimal ${GUESTBOOK_NAME_MAX_LENGTH} karakter.`,
      { category: 'validation', field: 'name' },
    )
  }
  if (!message || message.length > GUESTBOOK_MESSAGE_MAX_LENGTH) {
    throw new GuestbookServiceError(
      'validation',
      `Pesan wajib diisi dan maksimal ${GUESTBOOK_MESSAGE_MAX_LENGTH} karakter.`,
      { category: 'validation', field: 'message' },
    )
  }
  if (!GUESTBOOK_ATTENDANCE_OPTIONS.includes(attendance)) {
    throw new GuestbookServiceError(
      'validation',
      'Pilih konfirmasi kehadiran yang tersedia.',
      { category: 'validation', field: 'attendance' },
    )
  }

  const params = new URLSearchParams({ select: GUESTBOOK_COLUMNS })
  const rows = await requestGuestbook({
    method: 'POST',
    params,
    payload: { name, message, attendance },
  })

  if (!Array.isArray(rows) || !rows[0]) {
    throw new GuestbookServiceError('unknown', 'Hasil penyimpanan RSVP belum dapat dipastikan.', {
      category: 'unknown',
      code: 'EMPTY_INSERT_REPRESENTATION',
    })
  }

  return rows[0]
}

export function getGuestbookErrorMessage(error) {
  switch (error?.category) {
    case 'configuration':
      return 'RSVP online belum tersedia karena konfigurasi layanan belum lengkap.'
    case 'validation':
      return error.message
    case 'permission':
      return 'RSVP belum dapat diproses karena izin layanan belum sesuai. Silakan hubungi penyelenggara.'
    case 'schema':
      return 'RSVP belum dapat diproses karena konfigurasi data layanan perlu diperiksa.'
    case 'network':
      return 'Koneksi ke layanan RSVP gagal. Periksa koneksi internet lalu coba kembali.'
    case 'unknown':
      return 'Hasil pengiriman belum dapat dipastikan. Mohon jangan kirim ulang; hubungi penyelenggara untuk konfirmasi.'
    case 'http':
    default:
      return 'RSVP belum dapat diproses saat ini. Silakan coba kembali nanti.'
  }
}

export function getGuestbookErrorDebugDetails(error) {
  return error instanceof GuestbookServiceError
    ? { ...error.debug, category: error.category }
    : { category: 'unknown', code: 'UNEXPECTED_ERROR' }
}
