export const DEFAULT_GUEST_NAME = 'Tamu Undangan'
const MAX_GUEST_NAME_LENGTH = 100

function decodeQueryPart(value) {
  return decodeURIComponent(value.replace(/\+/g, ' '))
}

export function getGuestName(search = globalThis.location?.search ?? '') {
  if (typeof search !== 'string') return DEFAULT_GUEST_NAME

  const query = search.startsWith('?') ? search.slice(1) : search

  for (const field of query.split('&')) {
    const separatorIndex = field.indexOf('=')
    const rawKey = separatorIndex === -1 ? field : field.slice(0, separatorIndex)
    const rawValue = separatorIndex === -1 ? '' : field.slice(separatorIndex + 1)

    let key
    try {
      key = decodeQueryPart(rawKey)
    } catch {
      continue
    }

    if (key !== 'to') continue

    let name
    try {
      name = decodeQueryPart(rawValue)
    } catch {
      return DEFAULT_GUEST_NAME
    }

    const normalizedName = name.replace(/[\u0000-\u001f\u007f-\u009f]/g, '').trim()
    if (!normalizedName) return DEFAULT_GUEST_NAME

    return Array.from(normalizedName).slice(0, MAX_GUEST_NAME_LENGTH).join('')
  }

  return DEFAULT_GUEST_NAME
}
