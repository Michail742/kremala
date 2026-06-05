export default function Lobby({ room, session, onHome }) {
  const players = room?.players || {}
  const playerCount = Object.keys(players).length
  const isWaiting = playerCount < 2

  let statusMsg = ''
  if (!isWaiting && room?.mode === 'setter-guesser' && room?.status === 'setting-word') {
    const setter = Object.values(players).find(p => p.role === 'setter')
    statusMsg = `${setter?.name || 'Ο setter'} επιλέγει λέξη...`
  }

  return (
    <div className="app t-mint">
      <div className="lobby-content">
        <div className="lobby-code-wrap">
          <p className="lobby-code-label">Κωδικός δωματίου</p>
          <div className="lobby-code">{session?.roomCode}</div>
          {isWaiting && <p className="lobby-code-hint">Μοιράσου τον κωδικό με τον φίλο σου</p>}
        </div>

        <div className="lobby-players">
          {Object.entries(players).map(([id, p]) => (
            <div key={id} className="lobby-player">
              <div className="lobby-dot" />
              <span>{p.name}</span>
              {id === session?.myId && <span className="lobby-you">(εσύ)</span>}
            </div>
          ))}
          {isWaiting && (
            <div className="lobby-player waiting">
              <div className="lobby-dot pulse" />
              <span>Αναμονή...</span>
            </div>
          )}
        </div>

        {statusMsg && <p className="lobby-status">{statusMsg}</p>}

        <button className="btn ghost mt-auto" onClick={onHome}>Έξοδος</button>
      </div>
    </div>
  )
}
