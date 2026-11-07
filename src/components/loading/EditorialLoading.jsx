import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { invitationAssets } from '../../data/assets.js'
import { invitationData } from '../../data/invitation.js'
import LoadingProgress from './LoadingProgress.jsx'
import LoadingSlideshow from './LoadingSlideshow.jsx'
import './loading.css'

const IMAGE_TIMEOUT_MS = 5_000
const FONT_TIMEOUT_MS = 2_500
const IMAGE_CONCURRENCY = 3
const MAX_LOADING_IMAGES = 6

function normalizeSlide(asset, order) {
  if (typeof asset === 'string' && asset.trim()) {
    return { src: asset, objectPosition: 'center center', order }
  }

  if (asset && typeof asset.src === 'string' && asset.src.trim()) {
    return {
      src: asset.src,
      objectPosition: asset.objectPosition ?? 'center center',
      order,
    }
  }

  return null
}

const loadingSlides = invitationAssets.loading
  .map(normalizeSlide)
  .filter(Boolean)
  .slice(0, MAX_LOADING_IMAGES)

function preloadImage(slide, signal) {
  return new Promise((resolve) => {
    const image = new Image()
    let settled = false

    const finish = (loaded) => {
      if (settled) return
      settled = true
      window.clearTimeout(timeoutId)
      signal.removeEventListener('abort', handleAbort)
      image.onload = null
      image.onerror = null
      if (!loaded) image.src = ''
      resolve({ slide, loaded })
    }

    const handleAbort = () => finish(false)
    const timeoutId = window.setTimeout(() => finish(false), IMAGE_TIMEOUT_MS)

    image.decoding = 'async'
    image.fetchPriority = slide.order === 0 ? 'high' : 'low'
    image.onload = async () => {
      try {
        if (typeof image.decode === 'function') await image.decode()
        finish(image.naturalWidth > 0)
      } catch {
        finish(false)
      }
    }
    image.onerror = () => finish(false)
    signal.addEventListener('abort', handleAbort, { once: true })

    if (signal.aborted) {
      finish(false)
      return
    }

    image.src = slide.src
    if (image.complete) {
      if (image.naturalWidth > 0) {
        image.onload()
      } else {
        finish(false)
      }
    }
  })
}

function waitForFonts(signal) {
  if (!document.fonts?.load) return Promise.resolve()

  return new Promise((resolve) => {
    let settled = false

    const finish = () => {
      if (settled) return
      settled = true
      window.clearTimeout(timeoutId)
      signal.removeEventListener('abort', finish)
      resolve()
    }

    const timeoutId = window.setTimeout(finish, FONT_TIMEOUT_MS)
    signal.addEventListener('abort', finish, { once: true })

    Promise.allSettled([
      document.fonts.load('400 16px "Playfair Display"'),
      document.fonts.load('400 16px "DM Sans"'),
    ]).then(finish)
  })
}

export default function EditorialLoading({ onComplete }) {
  const [completedImages, setCompletedImages] = useState(0)
  const [readySlides, setReadySlides] = useState([])
  const [fontsReady, setFontsReady] = useState(false)
  const [entranceComplete, setEntranceComplete] = useState(false)
  const completedRef = useRef(false)
  const shouldReduceMotion = useReducedMotion()
  const totalTasks = loadingSlides.length + 1
  const progress = Math.round(
    ((completedImages + Number(fontsReady)) / totalTasks) * 100,
  )
  const isReady = fontsReady && completedImages === loadingSlides.length

  useEffect(() => {
    const controller = new AbortController()
    let nextSlideIndex = 0

    const loadWorker = async () => {
      while (nextSlideIndex < loadingSlides.length && !controller.signal.aborted) {
        const slide = loadingSlides[nextSlideIndex]
        nextSlideIndex += 1
        const result = await preloadImage(slide, controller.signal)

        if (controller.signal.aborted) return
        setCompletedImages((count) => count + 1)
        if (result.loaded) {
          setReadySlides((slides) =>
            [...slides, result.slide].sort((first, second) => first.order - second.order),
          )
        }
      }
    }

    const workerCount = Math.min(IMAGE_CONCURRENCY, loadingSlides.length)
    void Promise.all(Array.from({ length: workerCount }, loadWorker))

    void waitForFonts(controller.signal).then(() => {
      if (!controller.signal.aborted) setFontsReady(true)
    })

    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (!isReady || !entranceComplete || completedRef.current) return
    completedRef.current = true
    onComplete()
  }, [entranceComplete, isReady, onComplete])

  const { bride, groom } = invitationData.couple
  const { reception } = invitationData.wedding
  const exitDuration = shouldReduceMotion ? 0 : 0.55

  return (
    <motion.main
      className="relative isolate grid min-h-svh place-items-center overflow-hidden bg-burgundy px-6 py-16 text-ivory"
      aria-label="Preparing the wedding invitation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: exitDuration, ease: [0.2, 0, 0, 1] }}
      onAnimationComplete={() => {
        if (!completedRef.current) setEntranceComplete(true)
      }}
    >
      <LoadingSlideshow slides={readySlides} />
      <div className="editorial-loading-content relative z-10 flex w-full flex-col items-center text-center">
        <motion.p
          className="mb-6 font-sans text-[0.65rem] font-medium tracking-[0.34em] text-champagne sm:mb-8 sm:text-xs"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.45,
            delay: shouldReduceMotion ? 0 : 0.05,
          }}
        >
          THE WEDDING OF
        </motion.p>
        <motion.h1
          className="whitespace-nowrap font-display text-[clamp(1.8rem,8.5vw,7.5rem)] font-normal leading-[0.98] tracking-[-0.045em] text-ivory"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.55,
            delay: shouldReduceMotion ? 0 : 0.1,
          }}
        >
          {bride.preferredName} <span className="font-display italic text-champagne">&amp;</span>{' '}
          {groom.preferredName}
        </motion.h1>
        <motion.p
          className="mt-5 font-sans text-xs font-medium tracking-[0.28em] text-ivory/85 sm:mt-7 sm:text-sm"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.45,
            delay: shouldReduceMotion ? 0 : 0.15,
          }}
        >
          {reception.date.split('-').reverse().join('.')}
        </motion.p>
      </div>
      <div className="absolute inset-x-6 bottom-[max(2rem,calc(env(safe-area-inset-bottom)+1.25rem))] z-10 flex justify-center sm:bottom-[max(3rem,calc(env(safe-area-inset-bottom)+1.5rem))]">
        <LoadingProgress progress={progress} />
      </div>
    </motion.main>
  )
}
