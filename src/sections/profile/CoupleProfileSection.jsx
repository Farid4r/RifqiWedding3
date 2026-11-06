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
    duration: reduceMotion ? 0 : 0.55,
    delay: reduceMotion ? 0 : index * 0.12,
    ease: [0.2, 0, 0, 1],
  }

  return (
    <motion.article
      className={`couple-profile couple-profile--${entry.id}`}
      initial={reduceMotion ? 'visible' : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      variants={{
        hidden: { opacity: 0, y: reduceMotion ? 0 : 18 },
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
      </div>
    </motion.article>
  )
}

export default function CoupleProfileSection() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="couple-profile-section" aria-labelledby="couple-profile-title">
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
