import { motion, useReducedMotion } from 'framer-motion'
import { invitationData } from '../../data/invitation.js'
import WeddingVideoPlayer from '../../components/media/WeddingVideoPlayer.jsx'
import './love-story.css'

export default function LoveStorySection({ onPlaybackStateChange }) {
  const reduceMotion = useReducedMotion()
  const story = invitationData.sections.loveStory
  const revealTransition = {
    duration: reduceMotion ? 0 : 0.45,
    ease: [0.2, 0, 0, 1],
  }

  return (
    <section id="story" className="love-story" aria-labelledby="love-story-title">
      <div className="love-story__inner">
        <div className="love-story__introduction">
          <motion.header
            className="love-story__heading"
            initial={reduceMotion ? false : { opacity: 1, y: 12 }}
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              visible: { opacity: 1, y: 0, transition: revealTransition },
            }}
          >
            <p className="love-story__eyebrow">{story.eyebrow}</p>
            <h2 id="love-story-title">{story.title}</h2>
          </motion.header>

          <motion.p
            className="love-story__narrative"
            initial={reduceMotion ? false : { opacity: 1, y: 12 }}
            whileInView="visible"
            viewport={{ once: true, amount: 0.18 }}
            variants={{
              visible: {
                opacity: 1,
                y: 0,
                transition: { ...revealTransition, delay: reduceMotion ? 0 : 0.06 },
              },
            }}
          >
            {story.narrative}
          </motion.p>
        </div>

        <div className="love-story__film">
          <WeddingVideoPlayer onPlaybackStateChange={onPlaybackStateChange} />
        </div>

        <footer className="love-story__closing">
          <span className="love-story__closing-rule" aria-hidden="true" />
          <p>{story.closing}</p>
        </footer>
      </div>
    </section>
  )
}
