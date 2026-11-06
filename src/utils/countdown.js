import { invitationData } from '../data/invitation.js'

function getTimeZoneOffset(timestamp, timezone) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  })

  const parts = Object.fromEntries(
    formatter
      .formatToParts(new Date(timestamp))
      .filter(({ type }) => type !== 'literal')
      .map(({ type, value }) => [type, Number(value)]),
  )

  const zonedTimeAsUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  )

  return zonedTimeAsUtc - Math.floor(timestamp / 1000) * 1000
}

export function getReceptionTimestamp(reception = invitationData.wedding.reception) {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(reception.date ?? '')
  const timeMatch = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(reception.startTime ?? '')

  if (!dateMatch || !timeMatch || !reception.timezone) {
    throw new TypeError('Resepsi harus memiliki tanggal, waktu mulai, dan timezone yang valid.')
  }

  const [, yearText, monthText, dayText] = dateMatch
  const [, hourText, minuteText] = timeMatch
  const [year, month, day, hour, minute] = [
    yearText,
    monthText,
    dayText,
    hourText,
    minuteText,
  ].map(Number)
  const wallTimeAsUtc = Date.UTC(year, month - 1, day, hour, minute)
  const wallTime = new Date(wallTimeAsUtc)

  if (
    wallTime.getUTCFullYear() !== year ||
    wallTime.getUTCMonth() + 1 !== month ||
    wallTime.getUTCDate() !== day
  ) {
    throw new TypeError('Tanggal resepsi tidak valid.')
  }

  let timestamp = wallTimeAsUtc
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const adjustedTimestamp = wallTimeAsUtc - getTimeZoneOffset(timestamp, reception.timezone)
    if (adjustedTimestamp === timestamp) break
    timestamp = adjustedTimestamp
  }

  return timestamp
}

export function getReceptionCountdown(now = Date.now()) {
  const nowTimestamp = now instanceof Date ? now.getTime() : Number(now)
  if (!Number.isFinite(nowTimestamp)) {
    throw new TypeError('Waktu saat ini harus berupa Date atau timestamp yang valid.')
  }

  let remainingSeconds = Math.max(
    0,
    Math.floor((getReceptionTimestamp() - nowTimestamp) / 1000),
  )

  const days = Math.floor(remainingSeconds / 86_400)
  remainingSeconds %= 86_400
  const hours = Math.floor(remainingSeconds / 3_600)
  remainingSeconds %= 3_600
  const minutes = Math.floor(remainingSeconds / 60)
  const seconds = remainingSeconds % 60

  return { days, hours, minutes, seconds }
}
