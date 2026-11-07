import HeroSection from '../sections/hero/HeroSection.jsx'
import CoupleProfileSection from '../sections/profile/CoupleProfileSection.jsx'
import LoveStorySection from '../sections/love-story/LoveStorySection.jsx'
import EventSection from '../sections/event/EventSection.jsx'
import GallerySection from '../sections/gallery/GallerySection.jsx'
import RSVPSection from '../sections/rsvp/RSVPSection.jsx'
import DigitalGiftSection from '../sections/digital-gift/DigitalGiftSection.jsx'
import FloatingNavigation from '../components/navigation/FloatingNavigation.jsx'
import BackgroundMusicPlayer from '../components/media/BackgroundMusicPlayer.jsx'
import { useCallback, useState } from 'react'

export default function InvitationLayout({ music, showMusic }) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false)
  const handleLightboxChange = useCallback((isOpen) => setIsLightboxOpen(isOpen), [])
  const handleMoreMenuChange = useCallback((isOpen) => setIsMoreMenuOpen(isOpen), [])

  return (
    <>
      <main className="invitation-content">
        <HeroSection />
        <CoupleProfileSection />
        <LoveStorySection onPlaybackStateChange={music.handleVideoPlaybackStateChange} />
        <EventSection />
        <GallerySection onLightboxChange={handleLightboxChange} />
        <RSVPSection />
        <DigitalGiftSection />
      </main>
      {!isLightboxOpen && (
        <>
          <FloatingNavigation onMoreMenuChange={handleMoreMenuChange} />
          {showMusic && !isMoreMenuOpen && <BackgroundMusicPlayer music={music} />}
        </>
      )}
    </>
  )
}
