import HeroSection from '../sections/hero/HeroSection.jsx'
import CoupleProfileSection from '../sections/profile/CoupleProfileSection.jsx'
import LoveStorySection from '../sections/love-story/LoveStorySection.jsx'

export default function InvitationLayout() {
  return (
    <main className="invitation-content">
      <HeroSection />
      <CoupleProfileSection />
      <LoveStorySection />
    </main>
  )
}
