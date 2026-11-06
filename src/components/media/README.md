# Wedding video player

`WeddingVideoPlayer` accepts two optional callbacks for a future independent
music player:

- `onAudioStateChange({ active, reason })` reports when the video should own
  audio (`active: true`) or when background audio can be considered again
  (`active: false`). Reasons are `unmuted`, `playing`, `muted`, `paused`, and
  `ended`.
- `onPlaybackEnded()` fires when the akad video reaches its end.

The website music player can pause itself while `active` is true and resume
according to its own playback state when `active` becomes false. No music player
is assumed or created by this component.

The player starts muted. It adds the video source only after its Intersection
Observer warm-up boundary is reached (or the visitor presses Play), keeps
`preload="none"`, and pauses when it leaves that boundary. Pausing does not
reset the playback position. Reduced-motion preference disables autoplay.

The video source and poster are configured in `src/data/assets.js`. The local
original is retained in `src/assets/source/akad.mp4` for reference and is not
served as a static production asset.
