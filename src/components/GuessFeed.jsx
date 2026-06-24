import { useEffect, useRef, useState } from 'react'

// Δείχνει ΠΟΙΟΣ έπαιξε ποιο γράμμα ως προσωρινή ειδοποίηση: εμφανίζεται και
// εξαφανίζεται μετά από 2 δευτερόλεπτα (δεν παραμένει στο board).
const SHOW_MS = 2000

export default function GuessFeed({ log, players }) {
  const [toasts, setToasts] = useState([])
  const seenRef = useRef(0)
  const initedRef = useRef(false)
  const idRef = useRef(0)

  useEffect(() => {
    const len = log?.length || 0
    // Πρώτο render (π.χ. join μεσοβέζικα): μη δείξεις το ιστορικό, ξεκίνα από εδώ.
    if (!initedRef.current) {
      initedRef.current = true
      seenRef.current = len
      return
    }
    // Reset log (νέος γύρος): καθάρισε.
    if (len < seenRef.current) {
      seenRef.current = len
      setToasts([])
      return
    }
    if (len > seenRef.current) {
      const fresh = log.slice(seenRef.current).map(g => ({ ...g, id: idRef.current++ }))
      seenRef.current = len
      setToasts(t => [...t, ...fresh])
      fresh.forEach(n => {
        setTimeout(() => setToasts(t => t.filter(x => x.id !== n.id)), SHOW_MS)
      })
    }
  }, [log])

  if (toasts.length === 0) return null
  return (
    <div className="guess-feed" aria-live="polite">
      {toasts.map(g => (
        <div key={g.id} className={`guess-feed-item${g.hit ? ' hit' : ' miss'}`}>
          <span className="guess-feed-name">{players?.[g.pid]?.name || '?'}</span>
          <span className="guess-feed-letter">{g.letter}</span>
        </div>
      ))}
    </div>
  )
}
