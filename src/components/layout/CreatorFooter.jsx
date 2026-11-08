import { creatorData } from '../../data/creator.js'
import './creator-footer.css'

function validSocialUrl(value, platform) {
  if (typeof value !== 'string' || !value.trim()) return null
  try {
    const url = new URL(value)
    const hostname = url.hostname.toLowerCase()
    const validHost = platform === 'instagram'
      ? hostname === 'instagram.com' || hostname.endsWith('.instagram.com')
      : platform === 'tiktok'
        ? hostname === 'tiktok.com' || hostname.endsWith('.tiktok.com')
        : hostname === 'wa.me'
    return url.protocol === 'https:' && validHost ? url.href : null
  } catch {
    return null
  }
}

function getContactLinks() {
  const links = []

  const whatsapp = validSocialUrl(creatorData.whatsapp, 'whatsapp')
  if (whatsapp) links.push({ label: 'WhatsApp', href: whatsapp })

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
            <a className="creator-footer__link" key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`${label} Kreatipisan`}>
              {label === 'WhatsApp' && (
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M20 11.7a8 8 0 0 1-11.8 7L4 20l1.3-4A8 8 0 1 1 20 11.7Z" />
                  <path d="M9 8.5c.3-.5.6-.5.9-.1l.8 1.2c.2.3.1.5-.2.8l-.5.5c.6 1.2 1.5 2.1 2.8 2.7l.5-.6c.2-.3.5-.3.8-.1l1.2.7c.4.2.4.6.1 1-.4.6-1.1 1-1.9.9-2.8-.5-5.6-3.2-6-5.7-.1-.5.4-1.1 1.5-1.3Z" />
                </svg>
              )}
              {label === 'Instagram' && (
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle className="creator-footer__icon-dot" cx="17.5" cy="6.5" r="0.8" />
                </svg>
              )}
              {label === 'TikTok' && (
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M14 3v11.1a4.1 4.1 0 1 1-3-3.9" />
                  <path d="M14 3c.4 2.6 2.1 4.4 5 4.8" />
                </svg>
              )}
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
