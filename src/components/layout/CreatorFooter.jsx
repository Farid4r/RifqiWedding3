import { creatorData } from '../../data/creator.js'
import './creator-footer.css'

function validSocialUrl(value, platform) {
  if (typeof value !== 'string' || !value.trim()) return null
  try {
    const url = new URL(value)
    const hostname = url.hostname.toLowerCase()
    const validHost = platform === 'instagram'
      ? hostname === 'instagram.com' || hostname.endsWith('.instagram.com')
      : hostname === 'tiktok.com' || hostname.endsWith('.tiktok.com')
    return url.protocol === 'https:' && validHost ? url.href : null
  } catch {
    return null
  }
}

function getContactLinks() {
  const phone = typeof creatorData.whatsapp === 'string'
    ? creatorData.whatsapp.replace(/[^\d]/g, '')
    : ''
  const links = []

  if (/^[1-9]\d{7,14}$/.test(phone)) {
    links.push({ label: 'WhatsApp', href: `https://wa.me/${phone}` })
  }

  const instagram = validSocialUrl(creatorData.instagram, 'instagram')
  const tiktok = validSocialUrl(creatorData.tiktok, 'tiktok')
  if (instagram) links.push({ label: 'Instagram', href: instagram })
  if (tiktok) links.push({ label: 'TikTok', href: tiktok })
  return links
}

export default function CreatorFooter() {
  const contacts = getContactLinks()

  return (
    <footer className="creator-footer" aria-label="Informasi kreator undangan">
      <p className="creator-footer__credit">CREATED BY {creatorData.brandName.toUpperCase()}</p>
      {contacts.length > 0 && (
        <nav className="creator-footer__links" aria-label="Kontak Kreatipisan">
          {contacts.map(({ label, href }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`${label} Kreatipisan`}>
              {label}
            </a>
          ))}
        </nav>
      )}
      <small className="creator-footer__copyright">
        © {creatorData.copyrightYear} {creatorData.brandName}. All rights reserved.
      </small>
    </footer>
  )
}
