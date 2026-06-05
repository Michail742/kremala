import { useEffect, useState } from 'react'
import { ref, get, set, update, onValue, off } from 'firebase/database'
import { db } from '../firebase'
import { WORDS } from '../data'

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function getPlayerId() {
  let id = localStorage.getItem('kremala-pid')
  if (!id) {
    id = Math.random().toString(36).slice(2, 12)
    localStorage.setItem('kremala-pid', id)
  }
  return id
}

async function makeCode() {
  const code = Array.from({ length: 4 }, () =>
    CHARS[Math.floor(Math.random() * CHARS.length)]
  ).join('')
  const snap = await get(ref(db, `rooms/${code}`))
  return snap.exists() ? makeCode() : code
}

export async function createRoom(myId, myName, mode) {
  const code = await makeCode()
  await set(ref(db, `rooms/${code}`), {
    mode,
    status: 'waiting',
    createdAt: Date.now(),
    players: {
      [myId]: { name: myName, role: mode === 'setter-guesser' ? 'setter' : 'player1' },
    },
  })
  return code
}

export async function joinRoom(myId, myName, code) {
  const snap = await get(ref(db, `rooms/${code}`))
  if (!snap.exists()) throw new Error('Το δωμάτιο δεν βρέθηκε')
  const room = snap.val()
  const players = room.players || {}
  if (Object.keys(players).length >= 2) throw new Error('Το δωμάτιο είναι γεμάτο')
  if (players[myId]) return
  const role = room.mode === 'setter-guesser' ? 'guesser' : 'player2'
  await update(ref(db, `rooms/${code}`), {
    [`players/${myId}`]: { name: myName, role },
    status: room.mode === 'setter-guesser' ? 'setting-word' : 'ready-check',
  })
}

export async function setWord(code, word) {
  await update(ref(db, `rooms/${code}`), {
    word,
    status: 'playing',
    'gameState/guessed': {},
    'gameState/livesRemaining': 6,
    'gameState/status': 'playing',
  })
}

export async function guessLetter(code, letter, word, guessed, lives) {
  const newGuessed = { ...guessed, [letter]: true }
  const hit = word.includes(letter)
  const newLives = hit ? lives : lives - 1
  const allFound = [...new Set(word)].every(l => newGuessed[l])
  const status = allFound ? 'won' : newLives <= 0 ? 'lost' : 'playing'
  const updates = {
    'gameState/guessed': newGuessed,
    'gameState/livesRemaining': newLives,
    'gameState/status': status,
  }
  if (status !== 'playing') updates.status = 'finished'
  await update(ref(db, `rooms/${code}`), updates)
}

export async function markReady(code, myId) {
  await update(ref(db, `rooms/${code}/ready`), { [myId]: true })
}

export async function startRace(code, players) {
  const raceStates = {}
  Object.keys(players).forEach(id => {
    raceStates[id] = { guessed: {}, livesRemaining: 6, status: 'playing' }
  })
  await update(ref(db, `rooms/${code}`), { status: 'playing', raceStates })
}

export async function guessLetterRace(code, myId, letter, word, guessed, lives) {
  const newGuessed = { ...guessed, [letter]: true }
  const hit = word.includes(letter)
  const newLives = hit ? lives : lives - 1
  const allFound = [...new Set(word)].every(l => newGuessed[l])
  const status = allFound ? 'won' : newLives <= 0 ? 'lost' : 'playing'
  const updates = {
    [`raceStates/${myId}/guessed`]: newGuessed,
    [`raceStates/${myId}/livesRemaining`]: newLives,
    [`raceStates/${myId}/status`]: status,
  }
  if (status !== 'playing') {
    updates.status = 'finished'
    if (status === 'won') updates.winner = myId
  }
  await update(ref(db, `rooms/${code}`), updates)
}

export async function resetRoom(code, mode) {
  if (mode === 'setter-guesser') {
    await update(ref(db, `rooms/${code}`), {
      status: 'setting-word',
      word: null,
      gameState: null,
    })
  } else {
    await update(ref(db, `rooms/${code}`), {
      status: 'ready-check',
      ready: null,
      raceStates: null,
      winner: null,
    })
  }
}

export function useRoomSubscription(roomCode) {
  const [room, setRoom] = useState(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!roomCode) { setRoom(null); setLoaded(true); return }
    setLoaded(false)
    const roomRef = ref(db, `rooms/${roomCode}`)
    onValue(roomRef, snap => {
      setRoom(snap.val())
      setLoaded(true)
    })
    return () => off(roomRef)
  }, [roomCode])

  return { room, loaded }
}
