import { useCallback, useEffect, useRef, useState } from 'react'

const PLAYBACK_ERROR = 'Musik belum dapat diputar. Tekan tombol putar untuk mencoba lagi.'

export default function useBackgroundMusic({ src }) {
  const audioRef = useRef(null)
  const playRequestIdRef = useRef(0)
  const playPendingRef = useRef(false)
  const isPlayingRef = useRef(false)
  const isMutedRef = useRef(false)
  const wantsPlaybackRef = useRef(false)
  const isVideoPlayingRef = useRef(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [wantsPlayback, setWantsPlayback] = useState(false)
  const [isStarting, setIsStarting] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState('')
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  const attemptPlayback = useCallback(() => {
    const audio = audioRef.current
    if (!src) {
      setError('Sumber musik belum dikonfigurasi.')
      return
    }
    if (!audio) {
      setError('Pemutar musik belum siap.')
      return
    }
    if (isMutedRef.current || isVideoPlayingRef.current) return
    if (!audio.paused || playPendingRef.current) return
    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return

    const requestId = ++playRequestIdRef.current
    playPendingRef.current = true
    setIsStarting(true)
    setError('')

    try {
      const result = audio.play()
      result?.catch(() => {
        if (requestId !== playRequestIdRef.current) return
        playPendingRef.current = false
        setIsStarting(false)
        setError(PLAYBACK_ERROR)
      })
    } catch {
      if (requestId === playRequestIdRef.current) {
        playPendingRef.current = false
        setIsStarting(false)
        setError(PLAYBACK_ERROR)
      }
    }
  }, [src])

  const startFromEnvelope = useCallback(() => {
    wantsPlaybackRef.current = true
    setWantsPlayback(true)
    setError('')
    attemptPlayback()
  }, [attemptPlayback])

  const togglePlayback = useCallback(() => {
    if (
      wantsPlaybackRef.current &&
      (isPlayingRef.current || isVideoPlayingRef.current || playPendingRef.current)
    ) {
      wantsPlaybackRef.current = false
      setWantsPlayback(false)
      playRequestIdRef.current += 1
      playPendingRef.current = false
      setIsStarting(false)
      audioRef.current?.pause()
      return
    }

    wantsPlaybackRef.current = true
    setWantsPlayback(true)
    setError('')
    attemptPlayback()
  }, [attemptPlayback])

  const toggleMute = useCallback(() => {
    const nextMuted = !isMutedRef.current
    isMutedRef.current = nextMuted
    setIsMuted(nextMuted)
    if (audioRef.current) audioRef.current.muted = nextMuted

    if (nextMuted) {
      playRequestIdRef.current += 1
      playPendingRef.current = false
      setIsStarting(false)
      audioRef.current?.pause()
    } else if (wantsPlaybackRef.current) {
      attemptPlayback()
    }
  }, [attemptPlayback])

  const handleVideoPlaybackStateChange = useCallback(({ isPlaying: videoPlaying }) => {
    if (typeof videoPlaying !== 'boolean' || videoPlaying === isVideoPlayingRef.current) return

    isVideoPlayingRef.current = videoPlaying
    setIsVideoPlaying(videoPlaying)

    if (videoPlaying) {
      playRequestIdRef.current += 1
      playPendingRef.current = false
      setIsStarting(false)
      audioRef.current?.pause()
    } else if (wantsPlaybackRef.current && !isMutedRef.current) {
      attemptPlayback()
    }
  }, [attemptPlayback])

  const handlePlaying = useCallback(() => {
    playPendingRef.current = false
    setIsStarting(false)
    isPlayingRef.current = true
    setIsPlaying(true)
    setError('')

    if (isMutedRef.current || isVideoPlayingRef.current) audioRef.current?.pause()
  }, [])

  const handlePause = useCallback(() => {
    playPendingRef.current = false
    setIsStarting(false)
    isPlayingRef.current = false
    setIsPlaying(false)
  }, [])

  const handleError = useCallback(() => {
    playPendingRef.current = false
    setIsStarting(false)
    isPlayingRef.current = false
    setIsPlaying(false)
    setIsReady(false)
    setError(src ? 'File musik tidak dapat dimuat.' : 'Sumber musik belum dikonfigurasi.')
  }, [src])

  const handleCanPlay = useCallback(() => {
    setIsReady(true)
    setError('')
  }, [])

  useEffect(() => () => {
    playRequestIdRef.current += 1
    playPendingRef.current = false
    audioRef.current?.pause()
  }, [])

  return {
    audioRef,
    isPlaying,
    isMuted,
    wantsPlayback,
    isStarting,
    isReady,
    error,
    isVideoPlaying,
    startFromEnvelope,
    togglePlayback,
    toggleMute,
    handleVideoPlaybackStateChange,
    handleCanPlay,
    handlePlaying,
    handlePause,
    handleError,
  }
}
