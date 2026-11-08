import HeroSection from '../sections/hero/HeroSection.jsx'
import CoupleProfileSection from '../sections/profile/CoupleProfileSection.jsx'
import LoveStorySection from '../sections/love-story/LoveStorySection.jsx'
import EventSection from '../sections/event/EventSection.jsx'
import GallerySection from '../sections/gallery/GallerySection.jsx'
import RSVPSection from '../sections/rsvp/RSVPSection.jsx'
import DigitalGiftSection from '../sections/digital-gift/DigitalGiftSection.jsx'
import ThankYouSection from '../sections/thank-you/ThankYouSection.jsx'
import CreatorFooter from '../components/layout/CreatorFooter.jsx'
import FloatingNavigation from '../components/navigation/FloatingNavigation.jsx'
import BackgroundMusicPlayer from '../components/media/BackgroundMusicPlayer.jsx'
import { useCallback, useEffect, useState } from 'react'

function useInvitationColorMorph() {
  useEffect(() => {
    const layer = document.querySelector('.invitation-color-morph')
    const sections = ['home', 'couple', 'story', 'event', 'gallery', 'rsvp', 'gift']
      .map((id) => document.getElementById(id)).filter(Boolean)
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    const ivory = [245, 239, 232]
    const burgundy = [100, 31, 50]
    const colors = [ivory, ivory, burgundy, ivory, burgundy, ivory, ivory]
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        if (!layer || reducedMotion.matches) {
          layer?.style.setProperty('--morph-color', '#F5EFE8')
          return
        }
        if (sections.length === 0) {
          layer.style.setProperty('--morph-color', '#F5EFE8')
          return
        }

        const viewportHeight = window.innerHeight
        const marker = viewportHeight * 0.52
        let activeIndex = -1
        const sectionTops = sections.map((section) => section.getBoundingClientRect().top)

        for (let index = 0; index < sectionTops.length; index += 1) {
          if (sectionTops[index] <= marker) activeIndex = index
          else break
        }

        if (activeIndex < 0) activeIndex = 0
        const activeColor = colors[activeIndex]
        let nextColorIndex = activeIndex + 1

        while (nextColorIndex < colors.length &&
          colors[nextColorIndex].every((channel, index) => channel === activeColor[index])) {
          nextColorIndex += 1
        }

        let color = activeColor
        if (nextColorIndex < sections.length && viewportHeight > marker) {
          const nextTop = sectionTops[nextColorIndex]
          if (nextTop < viewportHeight && nextTop > marker) {
            const progress = Math.max(0, Math.min(1,
              (viewportHeight - nextTop) / (viewportHeight - marker),
            ))
            color = activeColor.map((channel, index) => Math.round(
              channel + (colors[nextColorIndex][index] - channel) * progress,
            ))
          }
        }

        layer.style.setProperty('--morph-color', `rgb(${color.join(' ')})`)
      })
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    reducedMotion.addEventListener?.('change', update)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      reducedMotion.removeEventListener?.('change', update)
    }
  }, [])
}

export default function InvitationLayout({ music, showMusic }) {
  useInvitationColorMorph()
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false)
  const handleLightboxChange = useCallback((isOpen) => setIsLightboxOpen(isOpen), [])
  const handleMoreMenuChange = useCallback((isOpen) => setIsMoreMenuOpen(isOpen), [])

  return (
    <>
      <div className="invitation-color-morph" aria-hidden="true" />
      <main className="invitation-content">
        <HeroSection />
        <CoupleProfileSection />
        <LoveStorySection />
        <EventSection />
        <GallerySection onLightboxChange={handleLightboxChange} />
        <RSVPSection />
        <DigitalGiftSection />
        <ThankYouSection />
      </main>
      <CreatorFooter />
      {!isLightboxOpen && (
        <>
          <FloatingNavigation onMoreMenuChange={handleMoreMenuChange} />
          {showMusic && !isMoreMenuOpen && <BackgroundMusicPlayer music={music} />}
        </>
      )}
    </>
  )
}
