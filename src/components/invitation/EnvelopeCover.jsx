import { useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import Button from '../ui/Button.jsx'
import Envelope from './Envelope.jsx'
import { invitationData } from '../../data/invitation.js'
import './envelope.css'

function formatInvitationDate(date) {
  return date.split('-').reverse().join('.')
}

export default function EnvelopeCover({ guestName, onOpen, onOpenComplete }) {
  const [isOpening, setIsOpening] = useState(false)
  const openStarted = useRef(false)
  const shouldReduceMotion = useReducedMotion()
  const { bride, groom } = invitationData.couple
  const { reception } = invitationData.wedding

  const handleOpen = () => {
    if (openStarted.current) return
    openStarted.current = true
    setIsOpening(true)
    // Keep the optional audio hook in the user gesture that opens the cover.
    onOpen?.()
  }

  return (
    <motion.main
      className="envelope-cover-background relative isolate grid min-h-svh place-items-center overflow-x-hidden bg-ivory px-5 py-10 text-burgundy sm:px-8 md:px-12 md:py-14"
      aria-busy={isOpening}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
      transition={{ duration: shouldReduceMotion ? 0.18 : 0.5, ease: [0.2, 0, 0, 1] }}
    >
      <div className="envelope-cover-frame pointer-events-none absolute" aria-hidden="true" />

      <div className="relative z-10 mx-auto grid w-full max-w-wide grid-cols-1 items-center gap-5 py-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-x-12 md:gap-y-5 lg:gap-x-20">
        <header className="order-1 text-center md:col-start-1 md:row-start-1 md:text-left">
          <p className="font-sans text-[0.65rem] font-semibold tracking-[0.31em] text-maroon sm:text-xs">
            THE WEDDING OF
          </p>
          <h1 className="mt-4 whitespace-nowrap font-display text-[clamp(2rem,8vw,3rem)] font-normal leading-none tracking-[-0.045em] sm:mt-5 md:whitespace-normal md:text-[clamp(3rem,5vw,5rem)]">
            {bride.preferredName}{' '}
            <span className="italic text-maroon">&amp;</span>{' '}
            {groom.preferredName}
          </h1>
          <p className="mt-4 font-sans text-xs font-medium tracking-[0.25em] text-ink-muted sm:mt-5 sm:text-sm">
            {formatInvitationDate(reception.date)}
          </p>
          <div className="mx-auto mt-5 h-px w-14 bg-champagne md:mx-0 md:mt-7" />
        </header>

        <div className="order-2 flex items-center justify-center py-1 md:col-start-2 md:row-span-2 md:row-start-1 md:py-0">
          <Envelope
            isOpen={isOpening}
            onOpenComplete={onOpenComplete}
            monogram={`${bride.preferredName[0]} · ${groom.preferredName[0]}`}
          />
        </div>

        <section className="order-3 flex flex-col items-center text-center md:col-start-1 md:row-start-2 md:items-start md:text-left">
          <p className="font-sans text-sm text-ink-muted">Kepada Yth.</p>
          <p className="mt-1 font-sans text-sm text-ink-muted">
            Bapak/Ibu/Saudara/i
          </p>
          <p className="mt-2 max-w-full break-words font-display text-xl text-burgundy sm:text-2xl">
            {guestName}
          </p>
          <Button
            className="mt-5 min-w-48 gap-3 rounded-pill px-7 shadow-[0_8px_20px_rgba(100,31,50,0.16)] active:scale-[0.98] md:mt-7"
            onClick={handleOpen}
            disabled={isOpening}
            aria-label={isOpening ? 'Amplop sedang dibuka' : 'Buka Undangan'}
          >
            <span>{isOpening ? 'Membuka Undangan' : 'Buka Undangan'}</span>
            {!isOpening && <ArrowRight size={16} strokeWidth={1.6} aria-hidden="true" />}
          </Button>
        </section>
      </div>
    </motion.main>
  )
}
