import {
  getSupabaseClient,
  isSupabaseConfigured,
  supabaseConfigError,
} from '../lib/supabase.js'

const GUESTBOOK_COLUMNS = 'id, name, message, attendance, created_at'
export const GUESTBOOK_ATTENDANCE_OPTIONS = ['Hadir', 'Tidak Hadir', 'Masih Ragu']
export const GUESTBOOK_NAME_MAX_LENGTH = 120
export const GUESTBOOK_MESSAGE_MAX_LENGTH = 1000

async function requireSupabase() {
  const client = await getSupabaseClient()
  if (!isSupabaseConfigured || !client) throw new Error(supabaseConfigError)
  return client
}

export async function getGuestbook() {
  const supabase = await requireSupabase()

  const { data, error } = await supabase
    .from('guestbook')
    .select(GUESTBOOK_COLUMNS)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) throw error
  return data ?? []
}

export async function createGuestbookEntry(payload) {
  const supabase = await requireSupabase()

  const name = typeof payload?.name === 'string' ? payload.name.trim() : ''
  const message = typeof payload?.message === 'string' ? payload.message.trim() : ''
  const attendance = payload?.attendance

  if (!name || name.length > GUESTBOOK_NAME_MAX_LENGTH) {
    throw new Error(`Nama wajib diisi dan maksimal ${GUESTBOOK_NAME_MAX_LENGTH} karakter.`)
  }
  if (!message || message.length > GUESTBOOK_MESSAGE_MAX_LENGTH) {
    throw new Error(`Pesan wajib diisi dan maksimal ${GUESTBOOK_MESSAGE_MAX_LENGTH} karakter.`)
  }
  if (!GUESTBOOK_ATTENDANCE_OPTIONS.includes(attendance)) {
    throw new Error('Pilih konfirmasi kehadiran yang tersedia.')
  }

  const { data, error } = await supabase
    .from('guestbook')
    .insert({ name, message, attendance })
    .select(GUESTBOOK_COLUMNS)
    .single()

  if (error) throw error
  return data
}
