import { useCallback, useState } from 'react'
import { invitationAssets } from '../../data/assets.js'
import GalleryLightbox from './GalleryLightbox.jsx'
import './gallery-section.css'

export default function GallerySection({ onLightboxChange }) {
  const [activeIndex, setActiveIndex] = useState(null)
  const gallery = invitationAssets.gallery

  function openLightbox(index) {
    setActiveIndex(index)
    onLightboxChange?.(true)
  }

  const closeLightbox = useCallback(() => {
    setActiveIndex(null)
    onLightboxChange?.(false)
  }, [onLightboxChange])

  const navigateLightbox = useCallback((nextIndex) => {
    setActiveIndex((currentIndex) =>
      (currentIndex + nextIndex + gallery.length) % gallery.length,
    )
  }, [gallery.length])

  return (
    <section id="gallery" className="gallery-section" aria-labelledby="gallery-title">
      <div className="gallery-section__inner">
        <header className="gallery-section__heading">
          <p className="gallery-section__eyebrow">OUR MOMENTS</p>
          <h2 id="gallery-title">A Collection of Memories</h2>
          <p className="gallery-section__description">
            Beberapa momen yang kami simpan dengan penuh rasa syukur.
          </p>
        </header>

        <div className="gallery-grid">
          {gallery.map((image, index) => (
            <button
              className="gallery-grid__item"
              type="button"
              key={image.src}
              onClick={() => openLightbox(index)}
              aria-label={`Perbesar foto ${index + 1}: ${image.alt}`}
            >
              <img
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </div>
      </div>

      {activeIndex !== null && (
        <GalleryLightbox
          images={gallery}
          activeIndex={activeIndex}
          onClose={closeLightbox}
          onNavigate={navigateLightbox}
        />
      )}
    </section>
  )
}
