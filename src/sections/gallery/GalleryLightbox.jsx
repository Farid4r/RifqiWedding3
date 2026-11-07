import { useEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'

export default function GalleryLightbox({ images, activeIndex, onClose, onNavigate }) {
  const dialogRef = useRef(null)
  const closeButtonRef = useRef(null)
  const reduceMotion = useReducedMotion()
  const activeImage = images[activeIndex]

  useEffect(() => {
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    closeButtonRef.current?.focus()
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        onNavigate(-1)
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        onNavigate(1)
      } else if (event.key === 'Tab') {
        const buttons = dialogRef.current?.querySelectorAll('button:not([disabled])')
        if (!buttons?.length) return

        const first = buttons[0]
        const last = buttons[buttons.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      previousFocus?.focus()
    }
  }, [onClose, onNavigate])

  return (
    <div
      className="gallery-lightbox"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        className="gallery-lightbox__dialog"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Galeri foto"
      >
        <button
          className="gallery-lightbox__close"
          type="button"
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Tutup galeri"
        >
          <X size={22} aria-hidden="true" />
        </button>

        <button
          className="gallery-lightbox__navigation gallery-lightbox__navigation--previous"
          type="button"
          onClick={() => onNavigate(-1)}
          aria-label="Foto sebelumnya"
        >
          <ArrowLeft size={22} aria-hidden="true" />
        </button>

        <figure className="gallery-lightbox__figure">
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={activeImage.src}
              src={activeImage.src}
              alt={activeImage.alt}
              width={activeImage.width}
              height={activeImage.height}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
            />
          </AnimatePresence>
          <figcaption>
            {activeImage.alt} <span aria-hidden="true">·</span> {activeIndex + 1} / {images.length}
          </figcaption>
        </figure>

        <button
          className="gallery-lightbox__navigation gallery-lightbox__navigation--next"
          type="button"
          onClick={() => onNavigate(1)}
          aria-label="Foto berikutnya"
        >
          <ArrowRight size={22} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
