# Invitation media

`WeddingVideoPlayer` accepts `onPlaybackStateChange({ isPlaying, isMuted,
reason })`. The snapshot reports playback and mute state independently. A
playing muted video still takes playback priority over background music.

`BackgroundMusicPlayer` is presentation-only. The `useBackgroundMusic` hook,
owned by `App`, owns the single audio element and playback intent. `EnvelopeCover`
calls its start action from the opening click gesture. Video state is passed
through `InvitationLayout` and `LoveStorySection` to the video player.

The local track is configured in `src/data/assets.js`; whether music is enabled
is configured in `src/data/invitation.js`. The audio element uses
`preload="none"` and is not played until the envelope is opened. Playback errors
are reported to the player, and browser tab visibility changes do not trigger
automatic replay.

The ceremony video remains on its configured Cloudinary source. It starts muted,
loads after its Intersection Observer warm-up boundary, preserves its playback
position when paused outside that boundary, and respects reduced motion for
autoplay.
