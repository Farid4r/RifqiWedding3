import { motion, useReducedMotion } from 'framer-motion'
import { invitationData } from '../../data/invitation.js'
import { invitationAssets } from '../../data/assets.js'
import './profile.css'

const profileEntries = [
  {
    id: 'bride',
    label: 'THE BRIDE',
    relation: 'Putri',
    person: invitationData.couple.bride,
    portrait: invitationAssets.bride,
  },
  {
    id: 'groom',
    label: 'THE GROOM',
    relation: 'Putra',
    person: invitationData.couple.groom,
    portrait: invitationAssets.groom,
  },
]

function Profile({ entry, index, reduceMotion }) {
  const transition = {
    duration: reduceMotion ? 0 : 0.45,
    delay: reduceMotion ? 0 : index * 0.08,
    ease: [0.2, 0, 0, 1],
  }

  return (
    <motion.article
      className={`couple-profile couple-profile--${entry.id}`}
      initial={reduceMotion ? false : { opacity: 1, y: 14 }}
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      variants={{
        visible: { opacity: 1, y: 0, transition },
      }}
      aria-labelledby={`${entry.id}-name`}
    >
      <figure className="couple-profile__portrait">
        <img
          src={entry.portrait.src}
          alt={`Potret ${entry.person.preferredName}`}
          width={entry.portrait.width}
          height={entry.portrait.height}
          loading="lazy"
          decoding="async"
        />
      </figure>

      <div className="couple-profile__details">
        <p className="couple-profile__label">{entry.label}</p>
        <h3 id={`${entry.id}-name`} className="couple-profile__name">
          {entry.person.fullName}
        </h3>
        <p className="couple-profile__parents">
          {entry.relation} dari Bapak {entry.person.parents.father} dan Ibu{' '}
          {entry.person.parents.mother}.
        </p>
        {entry.person.instagram?.username && entry.person.instagram?.url && (
          <a
            className="couple-profile__instagram"
            href={entry.person.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Instagram ${entry.person.preferredName}, ${entry.person.instagram.username}`}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
            </svg>
            <span>@{entry.person.instagram.username}</span>
          </a>
        )}
      </div>
    </motion.article>
  )
}

export default function CoupleProfileSection() {
  const reduceMotion = useReducedMotion()

  return (
    <section id="couple" className="couple-profile-section" aria-labelledby="couple-profile-title">
      <div className="couple-profile-section__inner">
        <header className="couple-profile-section__heading">
          <p className="couple-profile-section__eyebrow">THE COUPLE</p>
          <h2 id="couple-profile-title">Bride &amp; Groom</h2>
        </header>

        <div className="couple-profile-grid">
          {profileEntries.map((entry, index) => (
            <Profile
              key={entry.id}
              entry={entry}
              index={index}
              reduceMotion={reduceMotion}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
