import { WIN_BONUS } from './hooks/useRoom'

// Φτιάχνει & ταξινομεί τις γραμμές ανάλυσης (μόνο όσοι πήραν πόντους τον γύρο).
function buildRows(players, myId, fn) {
  return Object.entries(players || {})
    .map(([pid, p]) => {
      const { total, parts } = fn(pid)
      return { pid, name: p.name, total, parts, isMe: pid === myId }
    })
    .filter(r => r.total > 0)
    .sort((a, b) => b.total - a.total)
}

// Setter/Guesser: πώς μοιράστηκαν οι πόντοι του γύρου, από το κοινό log + τον setter.
//  - guesser: +1 ανά σωστό γράμμα
//  - όποιος κλείνει τη λέξη: +WIN_BONUS
//  - setter: +1 ανά λάθος γράμμα των guessers (ανταμοιβή για δύσκολη λέξη)
export function setterRoundRows(log = [], players = {}, setterPid, status, myId) {
  const correct = {}
  let wrong = 0
  for (const e of log) {
    if (e.hit) correct[e.pid] = (correct[e.pid] || 0) + 1
    else wrong += 1
  }
  const winnerPid = status === 'won' && log.length ? log[log.length - 1].pid : null

  return buildRows(players, myId, (pid) => {
    const parts = []
    let total = 0
    const c = correct[pid] || 0
    if (c > 0) { parts.push(`γράμματα +${c}`); total += c }
    if (pid === winnerPid) { parts.push(`νίκη +${WIN_BONUS}`); total += WIN_BONUS }
    if (pid === setterPid && wrong > 0) { parts.push(`setter: λάθη +${wrong}`); total += wrong }
    return { total, parts }
  })
}

// Race: πώς μοιράστηκαν οι πόντοι του γύρου, από τα ξεχωριστά boards.
//  - +1 ανά σωστό γράμμα που βρήκε ο καθένας
//  - ο νικητής: +WIN_BONUS
export function raceRoundRows(raceStates = {}, word = '', players = {}, winnerPid, myId) {
  const unique = [...new Set(word)].filter(Boolean)

  return buildRows(players, myId, (pid) => {
    const g = raceStates[pid]?.guessed || {}
    const c = unique.filter(l => g[l]).length
    const parts = []
    let total = 0
    if (c > 0) { parts.push(`γράμματα +${c}`); total += c }
    if (pid === winnerPid) { parts.push(`νίκη +${WIN_BONUS}`); total += WIN_BONUS }
    return { total, parts }
  })
}
