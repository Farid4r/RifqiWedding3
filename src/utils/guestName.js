export const DEFAULT_GUEST_NAME = 'Tamu Undangan'

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

    const normalizedName = name.replace(/[\u0000-\u001f\u007f]/g, '').trim()
    return normalizedName || DEFAULT_GUEST_NAME
  }

  return DEFAULT_GUEST_NAME
}
