# Source media

`akad.mp4` is the local original used to verify the media format and metadata.
The website streams its optimized Cloudinary delivery URL from
`src/data/assets.js`, so this 100 MB source is kept outside Vite's `public/`
directory and is not copied into `dist/`.
