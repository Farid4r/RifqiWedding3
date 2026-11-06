import { useReducedMotion } from 'framer-motion'
import { CalendarDays, Clock3, MapPin } from 'lucide-react'
import { invitationData } from '../../data/invitation.js'
import CountdownTimer from './CountdownTimer.jsx'
import './event-section.css'

function formatReceptionDate(date) {
  const [year, month, day] = date.split('-').map(Number)
  const utcDate = new Date(Date.UTC(year, month - 1, day, 12))

  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(utcDate)
}

export default function EventSection() {
  const reduceMotion = useReducedMotion()
  const { reception } = invitationData.wedding
  const motionClass = reduceMotion ? '' : 'event-section--animate'

  return (
    <section className={`event-section ${motionClass}`} aria-labelledby="event-title">
      <div className="event-section__inner">
        <header className="event-section__heading">
          <p className="event-section__eyebrow">SAVE THE DATE</p>
          <h2 id="event-title">The Wedding Day</h2>
          <p className="event-section__intro">
            Dengan penuh syukur, kami menantikan kehadiran Anda di hari istimewa kami.
          </p>
        </header>

        <CountdownTimer />

        <div className="event-section__details">
          <p className="event-section__event-name">{reception.type}</p>
          <dl className="event-section__list">
            <div className="event-section__item">
              <dt><CalendarDays size={20} aria-hidden="true" />Tanggal</dt>
              <dd>{formatReceptionDate(reception.date)}</dd>
            </div>
            <div className="event-section__item">
              <dt><Clock3 size={20} aria-hidden="true" />Waktu</dt>
              <dd>
                {reception.startTime.replace(':', '.')} WIB –{' '}
                {reception.endTime ? `${reception.endTime.replace(':', '.')} WIB` : 'selesai'}
              </dd>
            </div>
            <div className="event-section__item event-section__item--address">
              <dt><MapPin size={20} aria-hidden="true" />Lokasi</dt>
              <dd>{invitationData.location.address}</dd>
            </div>
          </dl>

          <a
            className="event-section__location-link"
            href={invitationData.location.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Location
          </a>
        </div>
      </div>
    </section>
  )
}
