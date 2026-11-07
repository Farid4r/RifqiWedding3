import { useId } from 'react'
import { Music2, Pause, Play, Volume2, VolumeX } from 'lucide-react'
import './background-music-player.css'

export default function BackgroundMusicPlayer({ music }) {
  const statusId = useId()
  const playbackLabel = music.error
    ? 'Coba putar musik'
    : music.isStarting
      ? 'Memulai musik'
      : music.wantsPlayback && (music.isPlaying || music.isVideoPlaying)
        ? 'Jeda musik'
        : 'Putar musik'

  let status = 'Musik belum diputar.'
  if (music.error) status = music.error
  else if (music.isVideoPlaying) status = 'Musik menunggu video akad selesai.'
  else if (music.isMuted) status = 'Musik dibisukan.'
  else if (music.isPlaying) status = 'Musik sedang diputar.'
  else if (music.isStarting) status = 'Menghubungkan ke musik…'
  else if (music.wantsPlayback) status = 'Musik dijeda. Tekan putar untuk melanjutkan.'
  else if (music.isReady) status = 'Musik siap diputar.'

  return (
    <aside className="background-music" aria-label="Pemutar musik undangan">
      <div className="background-music__identity" aria-hidden="true">
        <span className={`background-music__mark${music.isPlaying && !music.isMuted ? ' background-music__mark--playing' : ''}`}>
          <Music2 size={16} strokeWidth={1.7} />
        </span>
        <span className="background-music__title">Our Song</span>
      </div>

      <div className="background-music__controls" role="group" aria-label="Kontrol musik undangan">
        <button
          className="background-music__button"
          type="button"
          onClick={music.togglePlayback}
          aria-label={playbackLabel}
          aria-describedby={statusId}
          aria-pressed={music.isPlaying && !music.isMuted}
          disabled={music.isMuted && !music.error}
        >
          {music.wantsPlayback && (music.isPlaying || music.isVideoPlaying) ? (
            <Pause size={18} aria-hidden="true" />
          ) : (
            <Play size={18} fill="currentColor" aria-hidden="true" />
          )}
        </button>
        <button
          className="background-music__button"
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
      </div>

      <p className="background-music__status" id={statusId} role="status" aria-live="polite">
        {status}
      </p>
    </aside>
  )
}
