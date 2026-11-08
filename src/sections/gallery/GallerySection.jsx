import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { invitationAssets } from '../../data/assets.js'
import GalleryLightbox from './GalleryLightbox.jsx'
import './gallery-section.css'

export default function GallerySection({ onLightboxChange }) {
  const [activeIndex, setActiveIndex] = useState(null)
  const [visible, setVisible] = useState(false)
  const [tabActive, setTabActive] = useState(!document.hidden)
  const [coverIndex, setCoverIndex] = useState(0)
  const sectionRef = useRef(null)
  const railRef = useRef(null)
  const coverGesture = useRef(null)
  const skipCoverClick = useRef(false)
  const reduceMotion = useReducedMotion()
  const gallery = invitationAssets.gallery
  const coverImage = gallery[coverIndex]
  const carouselImages = gallery.slice(1, 5)

  useEffect(() => {
    const sectionObserver = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.01 })
    if (sectionRef.current) sectionObserver.observe(sectionRef.current)
    const handleVisibility = () => setTabActive(!document.hidden)
    document.addEventListener('visibilitychange', handleVisibility)
    return () => { sectionObserver.disconnect(); document.removeEventListener('visibilitychange', handleVisibility) }
  }, [])

  useEffect(() => {
    if (!visible || !tabActive || activeIndex !== null || reduceMotion || gallery.length < 2) return undefined
    const timer = window.setTimeout(() => {
      setCoverIndex((current) => (current + 1) % gallery.length)
    }, 5500)
    return () => window.clearTimeout(timer)
  }, [visible, tabActive, activeIndex, reduceMotion, coverIndex, gallery.length])

  function startCoverGesture(event) {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    coverGesture.current = { x: event.clientX, y: event.clientY }
    skipCoverClick.current = false
  }

  function endCoverGesture(event) {
    if (!coverGesture.current) return
    const deltaX = event.clientX - coverGesture.current.x
    const deltaY = event.clientY - coverGesture.current.y
    coverGesture.current = null
    if (Math.abs(deltaX) < 44 || Math.abs(deltaX) < Math.abs(deltaY)) return
    skipCoverClick.current = true
    setCoverIndex((current) => (current + (deltaX < 0 ? 1 : -1) + gallery.length) % gallery.length)
    window.setTimeout(() => { skipCoverClick.current = false }, 0)
  }

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
    <section id="gallery" ref={sectionRef} className="gallery-section" aria-labelledby="gallery-title">
      <div className="gallery-section__inner">
        <motion.header className="gallery-section__heading" initial={reduceMotion ? false : { opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.2, 0, 0, 1] }}>
          <p className="gallery-section__eyebrow">OUR MOMENTS</p>
          <h2 id="gallery-title">A Collection of Memories</h2>
          <p className="gallery-section__description">
            Beberapa momen yang kami simpan dengan penuh rasa syukur.
          </p>
        </motion.header>

        {coverImage && (
          <motion.div className="gallery-cover" initial={reduceMotion ? false : { opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.2, 0, 0, 1] }}>
            <button
              className="gallery-grid__item gallery-cover__item"
              type="button"
              onClick={() => { if (!skipCoverClick.current) openLightbox(coverIndex) }}
              onPointerDown={startCoverGesture}
              onPointerUp={endCoverGesture}
              onPointerCancel={() => { coverGesture.current = null }}
              aria-label={`Perbesar foto ${coverIndex + 1}: ${coverImage.alt}. Geser untuk mengganti foto.`}
            >
              <span className="gallery-cover__stack" aria-live="polite">
                <AnimatePresence initial={false} mode="sync">
                  <motion.img key={coverImage.src} src={coverImage.src} alt={coverImage.alt} width={coverImage.width} height={coverImage.height} loading="lazy" decoding="async" initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={reduceMotion ? undefined : { opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }} />
                </AnimatePresence>
              </span>
            </button>
          </motion.div>
        )}

        {carouselImages.length > 0 && (
          <>
            <p className="gallery-section__hint">Geser untuk melihat foto lainnya</p>
            <div
              className="gallery-carousel"
              ref={railRef}
              role="region"
              aria-label="Carousel foto galeri"
              tabIndex={0}
            >
              {carouselImages.map((image, index) => (
                <button
                  className="gallery-grid__item gallery-carousel__item"
                  type="button"
                  key={image.src}
                  onClick={() => openLightbox(index + 1)}
                  aria-label={`Perbesar foto ${index + 2}: ${image.alt}`}
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
          </>
        )}
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
