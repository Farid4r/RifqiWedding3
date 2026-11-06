import HeroSection from '../sections/hero/HeroSection.jsx'
import CoupleProfileSection from '../sections/profile/CoupleProfileSection.jsx'
import LoveStorySection from '../sections/love-story/LoveStorySection.jsx'
import EventSection from '../sections/event/EventSection.jsx'

export default function InvitationLayout() {
  return (
    <main className="invitation-content">
      <HeroSection />
      <CoupleProfileSection />
      <LoveStorySection />
      <EventSection />
    </main>
  )
}
