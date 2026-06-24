// Feed κινήσεων στο κοινό board: ποιος παίκτης έπαιξε ποιο γράμμα (νεότερα πρώτα).
export default function GuessFeed({ log, players }) {
  if (!log || log.length === 0) return null
  const recent = [...log].slice(-12).reverse()
  return (
    <div className="guess-feed" aria-live="polite">
      {recent.map((g, i) => (
        <div key={`${g.pid}-${g.letter}-${i}`} className={`guess-feed-item${g.hit ? ' hit' : ' miss'}`}>
          <span className="guess-feed-name">{players?.[g.pid]?.name || '?'}</span>
          <span className="guess-feed-letter">{g.letter}</span>
        </div>
      ))}
    </div>
  )
}
