import { useRef, useState } from 'react'
import {
  createGuestbookEntry,
  getGuestbookErrorDebugDetails,
  getGuestbookErrorMessage,
  GUESTBOOK_ATTENDANCE_OPTIONS,
  GUESTBOOK_MESSAGE_MAX_LENGTH,
  GUESTBOOK_NAME_MAX_LENGTH,
} from '../../services/guestbookService.js'

export default function RSVPForm({ onCreated, isConfigured }) {
  const submitLockRef = useRef(false)
  const [name, setName] = useState('')
  const [attendance, setAttendance] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()
    if (submitLockRef.current || !isConfigured) return

    const payload = { name: name.trim(), attendance, message: message.trim() }
    if (!payload.name || !payload.message || !payload.attendance) {
      setFeedback({ type: 'error', text: 'Lengkapi nama, kehadiran, dan ucapan terlebih dahulu.' })
      return
    }

    submitLockRef.current = true
    setIsSubmitting(true)
    setFeedback(null)

    try {
      const entry = await createGuestbookEntry(payload)
      onCreated(entry)
      setName('')
      setAttendance('')
      setMessage('')
      setFeedback({ type: 'success', text: 'Terima kasih. Konfirmasi dan ucapan Anda telah tersimpan.' })
    } catch (error) {
      setFeedback({
        type: 'error',
        text: getGuestbookErrorMessage(error),
        debug: getGuestbookErrorDebugDetails(error),
      })
    } finally {
      submitLockRef.current = false
      setIsSubmitting(false)
    }
  }

  return (
    <form className="rsvp-form" onSubmit={handleSubmit}>
      <div className="rsvp-form__field">
        <label htmlFor="guest-name">Nama</label>
        <input
          id="guest-name"
          name="name"
          type="text"
          autoComplete="name"
          maxLength={GUESTBOOK_NAME_MAX_LENGTH}
          value={name}
          onChange={(event) => setName(event.currentTarget.value)}
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="rsvp-form__field">
        <label htmlFor="guest-attendance">Konfirmasi kehadiran</label>
        <select
          id="guest-attendance"
          name="attendance"
          value={attendance}
          onChange={(event) => setAttendance(event.currentTarget.value)}
          required
          disabled={isSubmitting}
        >
          <option value="" disabled>Pilih konfirmasi</option>
          {GUESTBOOK_ATTENDANCE_OPTIONS.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <div className="rsvp-form__field">
        <label htmlFor="guest-message">Ucapan</label>
        <textarea
          id="guest-message"
          name="message"
          rows="4"
          maxLength={GUESTBOOK_MESSAGE_MAX_LENGTH}
          value={message}
          onChange={(event) => setMessage(event.currentTarget.value)}
          required
          disabled={isSubmitting}
        />
        <span className="rsvp-form__counter">
          {message.length}/{GUESTBOOK_MESSAGE_MAX_LENGTH}
        </span>
      </div>

      {feedback && (
        <p
          className={`rsvp-form__feedback rsvp-form__feedback--${feedback.type}`}
          role={feedback.type === 'error' ? 'alert' : 'status'}
          aria-live={feedback.type === 'error' ? 'assertive' : 'polite'}
        >
          {feedback.text}
        </p>
      )}

      <button
        className="rsvp-form__submit"
        type="submit"
        disabled={!isConfigured || isSubmitting}
      >
        {isSubmitting ? 'Mengirim…' : 'Kirim Konfirmasi & Ucapan'}
      </button>
    </form>
  )
}
