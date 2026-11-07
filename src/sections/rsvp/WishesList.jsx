import { UserRound } from 'lucide-react'

function formatCreatedAt(value) {
  if (typeof value !== 'string') return null
  const timestamp = Date.parse(value)
  if (!Number.isFinite(timestamp)) return null

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Jakarta',
  }).format(timestamp)
}

export default function WishesList({ entries, isLoading, error }) {
  return (
    <section className="wishes-list" aria-labelledby="wishes-title">
      <h3 id="wishes-title">Ucapan &amp; Doa</h3>

      {isLoading && <p className="wishes-list__state" role="status">Memuat ucapan…</p>}
      {!isLoading && error && <p className="wishes-list__state" role="alert">{error}</p>}
      {!isLoading && !error && entries.length === 0 && (
        <p className="wishes-list__state">Belum ada ucapan. Jadilah yang pertama menyampaikan doa.</p>
      )}

      {!isLoading && !error && entries.length > 0 && (
        <ol className="wishes-list__entries">
          {entries.map((entry, index) => {
            const sentAt = formatCreatedAt(entry.created_at)
            return (
              <li className="wishes-list__entry" key={entry.id ?? `${entry.name}-${index}`}>
                <div className="wishes-list__sender">
                  <UserRound size={18} aria-hidden="true" />
                  <span>{entry.name}</span>
                </div>
                <p>{entry.message}</p>
                <div className="wishes-list__meta">
                  <span>{entry.attendance}</span>
                  {sentAt && <time dateTime={entry.created_at}>{sentAt}</time>}
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}
