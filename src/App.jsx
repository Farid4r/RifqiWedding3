import { useCallback, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { invitationData } from './data/invitation.js'
import { EditorialLoading } from './components/loading/index.js'

export default function App() {
  const { groom, bride } = invitationData.couple
  const [isLoading, setIsLoading] = useState(true)
  const handleLoadingComplete = useCallback(() => setIsLoading(false), [])

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <EditorialLoading key="editorial-loading" onComplete={handleLoadingComplete} />
      ) : (
        <motion.main
          key="temporary-placeholder"
          className="flex min-h-svh items-center justify-center bg-ivory px-6 py-16 text-center text-burgundy"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
        >
          <div className="max-w-reading">
            <p className="font-sans text-xs font-medium tracking-[0.22em] text-maroon">
              {bride.preferredName} &amp; {groom.preferredName}
            </p>
            <h1 className="mt-5 font-display text-2xl font-normal sm:text-3xl">
              Undangan sedang disiapkan
            </h1>
          </div>
        </motion.main>
      )}
    </AnimatePresence>
  )
}
