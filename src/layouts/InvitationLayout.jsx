import HeroSection from '../sections/hero/HeroSection.jsx'
import CoupleProfileSection from '../sections/profile/CoupleProfileSection.jsx'
import LoveStorySection from '../sections/love-story/LoveStorySection.jsx'
import EventSection from '../sections/event/EventSection.jsx'
import GallerySection from '../sections/gallery/GallerySection.jsx'
import RSVPSection from '../sections/rsvp/RSVPSection.jsx'

export default function InvitationLayout() {
  return (
    <main className="invitation-content">
      <HeroSection />
      <CoupleProfileSection />
      <LoveStorySection />
      <EventSection />
      <GallerySection />
      <RSVPSection />
    </main>
  )
}
