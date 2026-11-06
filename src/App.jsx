import { useCallback, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { EditorialLoading } from './components/loading/index.js'
import { EnvelopeCover } from './components/invitation/index.js'
import InvitationLayout from './layouts/InvitationLayout.jsx'
import { getGuestName } from './utils/guestName.js'

export default function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [isCoverOpen, setIsCoverOpen] = useState(false)
  const [guestName] = useState(() => getGuestName())
  const handleLoadingComplete = useCallback(() => setIsLoading(false), [])
  const handleCoverOpened = useCallback(() => setIsCoverOpen(true), [])

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <EditorialLoading key="editorial-loading" onComplete={handleLoadingComplete} />
      ) : isCoverOpen ? (
        <InvitationLayout key="invitation-content" />
      ) : (
        <EnvelopeCover
          key="envelope-cover"
          guestName={guestName}
          onOpenComplete={handleCoverOpened}
        />
      )}
    </AnimatePresence>
  )
}
