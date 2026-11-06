import { Heart } from 'lucide-react'

export default function App() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-ivory px-6 py-16 text-burgundy">
      <div className="w-full max-w-content text-center">
        <p className="font-sans text-xs font-semibold tracking-[0.2em] text-maroon">
          RIFKI & NATASHA · VERSI 2.0
        </p>
        <div
          aria-hidden="true"
          className="mx-auto my-8 flex size-12 items-center justify-center rounded-full border border-champagne"
        >
          <Heart size={18} strokeWidth={1.5} />
        </div>
        <h1 className="font-display text-4xl font-normal leading-tight sm:text-5xl">
          Fondasi proyek siap dikembangkan
        </h1>
        <p className="mx-auto mt-5 max-w-reading font-sans text-base leading-7 text-ink-muted">
          Struktur aplikasi dan design system sudah disiapkan. Isi undangan akan
          dibangun pada tahap berikutnya.
        </p>
      </div>
    </main>
  )
}
