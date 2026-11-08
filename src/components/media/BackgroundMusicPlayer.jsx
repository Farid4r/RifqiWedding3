import { useId } from 'react'
import { Pause, Play, Volume2, VolumeX } from 'lucide-react'
import './background-music-player.css'

export default function BackgroundMusicPlayer({ music }) {
  const statusId = useId()
  const isAudiblyPlaying = music.isPlaying && !music.isMuted
  const playbackLabel = music.error
    ? 'Coba putar musik'
    : isAudiblyPlaying
      ? 'Jeda musik'
      : 'Putar musik'

  let status = 'Musik belum diputar.'
  if (music.error) status = music.error
  else if (music.isMuted) status = 'Musik dibisukan.'
  else if (music.isPlaying) status = 'Musik sedang diputar.'
  else if (music.isStarting) status = 'Menghubungkan ke musik…'
  else if (music.wantsPlayback) status = 'Musik dijeda. Tekan putar untuk melanjutkan.'
  else if (music.isReady) status = 'Musik siap diputar.'

  return (
    <aside
      className={`vinyl-player${isAudiblyPlaying ? ' is-playing' : ''}${music.error ? ' has-error' : ''}`}
      aria-label="Pemutar musik undangan"
    >
      <button
        className="vinyl-player__record"
        type="button"
        onClick={music.togglePlayback}
        aria-label={playbackLabel}
        aria-describedby={statusId}
        aria-pressed={isAudiblyPlaying}
        disabled={music.isMuted && !music.error}
      >
        <img src="/piring-hitam.png" alt="" draggable="false" />
        <span className="vinyl-player__playback-icon" aria-hidden="true">
          {isAudiblyPlaying ? <Pause size={13} /> : <Play size={13} fill="currentColor" />}
        </span>
      </button>

      <button
        className="vinyl-player__mute"
        type="button"
        onClick={music.toggleMute}
        aria-label={music.isMuted ? 'Nyalakan suara musik' : 'Bisukan musik'}
        aria-pressed={music.isMuted}
        aria-describedby={statusId}
      >
        {music.isMuted ? (
          <VolumeX size={18} aria-hidden="true" />
        ) : (
          <Volume2 size={18} aria-hidden="true" />
        )}
      </button>

      {isAudiblyPlaying && (
        <span className="vinyl-player__playing-indicator" aria-hidden="true" />
      )}
      <p className="vinyl-player__status" id={statusId} role="status" aria-live="polite">
        {status}
      </p>
    </aside>
  )
}
