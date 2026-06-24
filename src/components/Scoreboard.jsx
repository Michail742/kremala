// Βαθμολογία δωματίου: μαζεύει πόντους σε όλους τους γύρους. Ταξινόμηση φθίνουσα.
export default function Scoreboard({ players, scores, myId }) {
  const rows = Object.entries(players || {})
    .map(([pid, p]) => ({ pid, name: p.name, score: (scores && scores[pid]) || 0 }))
    .sort((a, b) => b.score - a.score)

  if (rows.length === 0) return null
  const anyPoints = rows.some(r => r.score > 0)

  return (
    <div className="scoreboard">
      <div className="scoreboard-title">Βαθμολογία</div>
      <div className="scoreboard-list">
        {rows.map((r, i) => (
          <div key={r.pid} className={`scoreboard-row${r.pid === myId ? ' me' : ''}`}>
            <span className="scoreboard-rank">{anyPoints ? `${i + 1}.` : '·'}</span>
            <span className="scoreboard-name">{r.name}{r.pid === myId ? ' (εσύ)' : ''}</span>
            <span className="scoreboard-pts">{r.score}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
