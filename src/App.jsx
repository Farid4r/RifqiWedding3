import { useCallback, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { EditorialLoading } from './components/loading/index.js'
import { EnvelopeCover } from './components/invitation/index.js'
import InvitationLayout from './layouts/InvitationLayout.jsx'
import { getGuestName } from './utils/guestName.js'
import { invitationData } from './data/invitation.js'
import { invitationAssets } from './data/assets.js'
import useBackgroundMusic from './hooks/useBackgroundMusic.js'

export default function App() {
  const musicEnabled = invitationData.sections.music?.enabled === true
  const musicSource = musicEnabled ? invitationAssets.music?.src : null
  const music = useBackgroundMusic({ src: musicSource })
  const [isLoading, setIsLoading] = useState(true)
  const [isCoverOpen, setIsCoverOpen] = useState(false)
  const [guestName] = useState(() => getGuestName())
  const handleLoadingComplete = useCallback(() => setIsLoading(false), [])
  const handleCoverOpened = useCallback(() => setIsCoverOpen(true), [])

  return (
    <>
      <audio
        ref={music.audioRef}
        src={musicSource ?? undefined}
        preload="none"
        loop
        muted={music.isMuted}
        onCanPlay={music.handleCanPlay}
        onPlaying={music.handlePlaying}
        onPause={music.handlePause}
        onError={music.handleError}
      />
      <AnimatePresence mode="wait">
        {isLoading ? (
          <EditorialLoading key="editorial-loading" onComplete={handleLoadingComplete} />
        ) : isCoverOpen ? (
          <InvitationLayout
            key="invitation-content"
            music={music}
            showMusic={musicEnabled}
          />
        ) : (
          <EnvelopeCover
            key="envelope-cover"
            guestName={guestName}
            onOpen={music.startFromEnvelope}
            onOpenComplete={handleCoverOpened}
          />
        )}
      </AnimatePresence>
    </>
  )
}
