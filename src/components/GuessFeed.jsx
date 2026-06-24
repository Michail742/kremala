import { useEffect, useRef, useState } from 'react'

// Δείχνει ΠΟΙΟΣ έπαιξε ποιο γράμμα ως προσωρινή ειδοποίηση (εμφανίζεται ~2s και φεύγει).
// Βασίζεται στο server timestamp (t) κάθε κίνησης: κάθε client δείχνει ό,τι έγινε τα
// τελευταία SHOW_MS — έτσι το toast φαίνεται σε ΟΛΟΥΣ, άσχετα πότε φόρτωσε η οθόνη του
// (και χωρίς να παίζει ρόλο τυχόν διαφορά ώρας client/server, αφού η αναφορά είναι το
// πιο πρόσφατο server timestamp στο log).
const SHOW_MS = 2000

export default function GuessFeed({ log, players }) {
  const [toasts, setToasts] = useState([])
  const shownRef = useRef(new Set())

  useEffect(() => {
    const arr = log || []
    if (arr.length === 0) return
    const ref = Math.max(...arr.map(g => g.t || 0)) // πιο πρόσφατη κίνηση = «τώρα»
    for (const g of arr) {
      if (!g.t) continue // legacy χωρίς timestamp — αγνόησε
      const id = `${g.t}|${g.pid}|${g.letter}`
      if (shownRef.current.has(id)) continue
      shownRef.current.add(id)
      const age = ref - g.t
      if (age < SHOW_MS) {
        setToasts(t => [...t, { ...g, id }])
        setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), Math.max(250, SHOW_MS - age))
      }
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
