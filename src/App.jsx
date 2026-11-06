import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { invitationData } from './data/invitation.js'
import { EditorialLoading } from './components/loading/index.js'
import { EnvelopeCover } from './components/invitation/index.js'
import { getGuestName } from './utils/guestName.js'

function InvitationPlaceholder() {
  const headingRef = useRef(null)
  const { bride, groom } = invitationData.couple

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  return (
    <motion.main
      key="invitation-placeholder"
      className="flex min-h-svh items-center justify-center bg-ivory px-6 py-16 text-center text-burgundy"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <div className="max-w-reading">
        <p className="font-sans text-xs font-medium tracking-[0.22em] text-maroon">
          {bride.preferredName} &amp; {groom.preferredName}
        </p>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="mt-5 font-display text-2xl font-normal sm:text-3xl"
        >
          Undangan resepsi
        </h1>
        <p className="mt-3 font-sans text-sm leading-6 text-ink-muted">
          Detail undangan akan disiapkan pada tahap berikutnya.
        </p>
      </div>
    </motion.main>
  )
}

export default function App() {
  const { groom, bride } = invitationData.couple
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
        <InvitationPlaceholder key="invitation-placeholder" />
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
