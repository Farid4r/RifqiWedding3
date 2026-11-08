import { useEffect, useState } from 'react'
import {
  CalendarDays,
  Home,
  MessageCircle,
} from 'lucide-react'
import './floating-navigation.css'

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'event', label: 'Event', icon: CalendarDays },
  { id: 'rsvp', label: 'RSVP', icon: MessageCircle },
]

function setIfChanged(setter, nextValue) {
  setter((currentValue) => currentValue === nextValue ? currentValue : nextValue)
}

export default function FloatingNavigation({ visible = true, onMoreMenuChange }) {
  const [activeId, setActiveId] = useState('home')

  useEffect(() => {
    if (!visible) return undefined

    const targets = NAV_ITEMS
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean)
    if (targets.length === 0) return undefined

    const activeAtViewport = () => {
      const viewportHeight = window.innerHeight
      const activationLine = viewportHeight * 0.38
      const sectionsAtLine = targets.filter((target) => {
        const rect = target.getBoundingClientRect()
        return rect.top <= activationLine && rect.bottom > activationLine
      })

      if (sectionsAtLine.length > 0) {
        const nearest = sectionsAtLine.reduce((selected, target) =>
          target.getBoundingClientRect().top > selected.getBoundingClientRect().top
            ? target
            : selected,
        )
        setIfChanged(setActiveId, nearest.id)
        return
      }

      const visibleTargets = targets
        .map((target) => ({ target, rect: target.getBoundingClientRect() }))
        .filter(({ rect }) => rect.bottom > 0 && rect.top < viewportHeight)
      if (visibleTargets.length === 0) return

      const nearest = visibleTargets.reduce((selected, entry) => {
        const selectedDistance = Math.abs(selected.rect.top - activationLine)
        const entryDistance = Math.abs(entry.rect.top - activationLine)
        return entryDistance < selectedDistance ? entry : selected
      })
      setIfChanged(setActiveId, nearest.target.id)
    }

    const observer = new IntersectionObserver(activeAtViewport, {
      rootMargin: '-28% 0px -55% 0px',
      threshold: 0,
    })
    targets.forEach((target) => observer.observe(target))

    const handleScrollToEnd = () => {
      const atPageEnd =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2
      if (atPageEnd) setIfChanged(setActiveId, 'rsvp')
    }
    const handleResize = () => {
      activeAtViewport()
      onMoreMenuChange?.(false)
    }
    window.addEventListener('scroll', handleScrollToEnd, { passive: true })
    window.addEventListener('resize', handleResize, { passive: true })
    window.addEventListener('orientationchange', handleResize, { passive: true })

    activeAtViewport()
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScrollToEnd)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [visible, onMoreMenuChange])

  if (!visible) return null

  function renderLink({ id, label, icon: Icon }) {
    const isActive = activeId === id
    return (
      <a
        className={`floating-navigation__link${isActive ? ' is-active' : ''}`}
        href={`#${id}`}
        key={id}
        aria-current={isActive ? 'location' : undefined}
      >
        <Icon size={17} strokeWidth={1.7} aria-hidden="true" />
        <span>{label}</span>
      </a>
    )
  }

  return (
    <div className="floating-navigation-shell">
      <nav className="floating-navigation" aria-label="Navigasi undangan">
        <div className="floating-navigation__desktop-links">{NAV_ITEMS.map(renderLink)}</div>
      </nav>
    </div>
  )
}
