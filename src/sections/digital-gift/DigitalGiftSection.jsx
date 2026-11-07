import { invitationData } from '../../data/invitation.js'
import GiftAccountCard from './GiftAccountCard.jsx'
import './digital-gift-section.css'

export default function DigitalGiftSection() {
  const gift = invitationData.sections.digitalGift

  if (!gift?.enabled) return null

  return (
    <section className="digital-gift" aria-labelledby="digital-gift-title">
      <div className="digital-gift__inner">
        <header className="digital-gift__heading">
          <p className="digital-gift__eyebrow">A TOKEN OF APPRECIATION</p>
          <h2 id="digital-gift-title">{gift.title}</h2>
          <p className="digital-gift__description">{gift.description}</p>
        </header>

        <div className="digital-gift__accounts">
          {gift.accounts.map((account) => (
            <GiftAccountCard account={account} key={account.id} />
          ))}
        </div>
      </div>
    </section>
  )
}
