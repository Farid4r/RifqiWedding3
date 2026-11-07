import HeroSection from '../sections/hero/HeroSection.jsx'
import CoupleProfileSection from '../sections/profile/CoupleProfileSection.jsx'
import LoveStorySection from '../sections/love-story/LoveStorySection.jsx'
import EventSection from '../sections/event/EventSection.jsx'
import GallerySection from '../sections/gallery/GallerySection.jsx'
import RSVPSection from '../sections/rsvp/RSVPSection.jsx'
import DigitalGiftSection from '../sections/digital-gift/DigitalGiftSection.jsx'
import BackgroundMusicPlayer from '../components/media/BackgroundMusicPlayer.jsx'

export default function InvitationLayout({ music, showMusic }) {
  return (
    <main className="invitation-content">
      <HeroSection />
      <CoupleProfileSection />
      <LoveStorySection onPlaybackStateChange={music.handleVideoPlaybackStateChange} />
      <EventSection />
      <GallerySection />
      <RSVPSection />
      <DigitalGiftSection />
      {showMusic && <BackgroundMusicPlayer music={music} />}
    </main>
  )
}
