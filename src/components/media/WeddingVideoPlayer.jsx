import { useCallback, useEffect, useRef, useState } from 'react'
import { Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { useReducedMotion } from 'framer-motion'
import { invitationAssets } from '../../data/assets.js'
import './wedding-video-player.css'

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`
}

export default function WeddingVideoPlayer({ onAudioStateChange, onPlaybackEnded }) {
  const playerRef = useRef(null)
  const videoRef = useRef(null)
  const callbacksRef = useRef({ onAudioStateChange, onPlaybackEnded })
  const autoplayAttemptedRef = useRef(false)
  const [isNearViewport, setIsNearViewport] = useState(false)
  const [sourceReady, setSourceReady] = useState(false)
  const [playRequested, setPlayRequested] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [hasError, setHasError] = useState(false)
  const reduceMotion = useReducedMotion()
  const videoAsset = invitationAssets.loveStoryVideo

  useEffect(() => {
    callbacksRef.current = { onAudioStateChange, onPlaybackEnded }
  }, [onAudioStateChange, onPlaybackEnded])

  const reportAudioState = useCallback((active, reason) => {
    callbacksRef.current.onAudioStateChange?.({ active, reason })
  }, [])

  useEffect(() => {
    const target = playerRef.current
    if (!target || typeof IntersectionObserver === 'undefined') return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsNearViewport(entry.isIntersecting)
        if (entry.isIntersecting) {
          setSourceReady(true)
        } else {
          videoRef.current?.pause()
        }
      },
      { rootMargin: '420px 0px', threshold: 0.01 },
    )

    observer.observe(target)
    return () => {
      observer.disconnect()
      videoRef.current?.pause()
    }
  }, [])

  useEffect(() => {
    if (sourceReady) videoRef.current?.load()
  }, [sourceReady])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !sourceReady) return undefined

    const shouldAutoplay =
      isNearViewport && reduceMotion === false && !autoplayAttemptedRef.current

    if (!playRequested && !shouldAutoplay) return undefined

    if (shouldAutoplay) {
      autoplayAttemptedRef.current = true
      video.muted = true
      setIsMuted(true)
    }

    try {
      const playPromise = video.play()
      playPromise?.then(
        () => setHasError(false),
        () => setPlayRequested(false),
      )
    } catch {
      setPlayRequested(false)
    }

    return undefined
  }, [isNearViewport, playRequested, reduceMotion, sourceReady])

  function handlePlaybackToggle() {
    const video = videoRef.current
    if (video && !video.paused) {
      setPlayRequested(false)
      video.pause()
      return
    }

    setHasError(false)
    if (video && video.readyState < HTMLMediaElement.HAVE_FUTURE_DATA && !video.muted) {
      video.muted = true
      setIsMuted(true)
      reportAudioState(false, 'muted')
    }

    if (video && sourceReady && video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      try {
        video.play()?.then(
          () => setHasError(false),
          () => {},
        )
      } catch {
        setPlayRequested(false)
      }
      return
    }

    setSourceReady(true)
    setPlayRequested(true)
  }

  function handleMuteToggle() {
    const video = videoRef.current
    if (!video) return

    video.muted = !video.muted
    setIsMuted(video.muted)
  }

  function handleSeek(event) {
    const video = videoRef.current
    const nextTime = Number(event.currentTarget.value)
    if (!video || !Number.isFinite(nextTime)) return

    video.currentTime = nextTime
    setCurrentTime(nextTime)
  }

  function handleRetry() {
    const video = videoRef.current
    if (!video) return

    if (!video.muted) {
      video.muted = true
      setIsMuted(true)
      reportAudioState(false, 'muted')
    }
    setHasError(false)
    setSourceReady(true)
    setPlayRequested(true)
    video.load()
  }

  const currentLabel = formatTime(currentTime)
  const durationLabel = formatTime(duration)

  return (
    <div ref={playerRef} className="wedding-video-player">
      <div className="wedding-video-player__screen">
        <video
          ref={videoRef}
          className="wedding-video-player__video"
          poster={videoAsset.poster}
          preload="none"
          muted={isMuted}
          playsInline
          loop={false}
          aria-label="Video akad Rifqi dan Natashya"
          onLoadedMetadata={(event) => {
            const videoDuration = event.currentTarget.duration
            setDuration(Number.isFinite(videoDuration) ? videoDuration : 0)
          }}
          onTimeUpdate={(event) => {
            const nextTime = Math.floor(event.currentTarget.currentTime)
            setCurrentTime((previousTime) =>
              previousTime === nextTime ? previousTime : nextTime,
            )
          }}
          onPlay={(event) => {
            setIsPlaying(true)
            setPlayRequested(false)
            if (!event.currentTarget.muted) reportAudioState(true, 'playing')
          }}
          onPause={() => {
            setIsPlaying(false)
            reportAudioState(false, 'paused')
          }}
          onVolumeChange={(event) => {
            const muted = event.currentTarget.muted
            setIsMuted(muted)
            reportAudioState(!muted, muted ? 'muted' : 'unmuted')
          }}
          onEnded={() => {
            setIsPlaying(false)
            setPlayRequested(false)
            reportAudioState(false, 'ended')
            callbacksRef.current.onPlaybackEnded?.()
          }}
          onError={() => {
            setHasError(true)
            setIsPlaying(false)
            reportAudioState(false, 'paused')
          }}
        >
          {sourceReady && <source src={videoAsset.src} type={videoAsset.type} />}
        </video>

        {!isPlaying && !hasError && (
          <button
            className="wedding-video-player__overlay-play"
            type="button"
            onClick={handlePlaybackToggle}
            aria-label="Putar video akad Rifqi dan Natashya"
          >
            <Play size={19} fill="currentColor" aria-hidden="true" />
            <span>Putar video akad</span>
          </button>
        )}

        {hasError && (
          <div className="wedding-video-player__error" role="alert">
            <p>Video belum dapat dimuat.</p>
            <button type="button" onClick={handleRetry}>
              Coba lagi
            </button>
          </div>
        )}
      </div>

      <div
        className="wedding-video-player__controls"
        role="group"
        aria-label="Kontrol video akad"
      >
        <button
          className="wedding-video-player__control"
          type="button"
          onClick={handlePlaybackToggle}
          aria-label={isPlaying ? 'Jeda video akad' : 'Putar video akad'}
        >
          {isPlaying ? (
            <Pause size={19} aria-hidden="true" />
          ) : (
            <Play size={19} fill="currentColor" aria-hidden="true" />
          )}
        </button>

        <label className="wedding-video-player__progress">
          <span className="sr-only">Posisi video</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="1"
            value={Math.min(currentTime, duration)}
            onChange={handleSeek}
            disabled={!duration || hasError}
            aria-valuetext={`${currentLabel} dari ${durationLabel}`}
          />
        </label>

        <span className="wedding-video-player__time" aria-label="Waktu video">
          {currentLabel} <span aria-hidden="true">/</span> {durationLabel}
        </span>

        <button
          className="wedding-video-player__control"
          type="button"
          onClick={handleMuteToggle}
          aria-label={isMuted ? 'Aktifkan suara video' : 'Matikan suara video'}
          aria-pressed={!isMuted}
        >
          {isMuted ? (
            <VolumeX size={19} aria-hidden="true" />
          ) : (
            <Volume2 size={19} aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  )
}
