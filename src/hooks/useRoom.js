import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { WORDS } from '../data'

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
export const MAX_PLAYERS = 8
const SHARED = 'shared' // pid για το κοινό board στο setter-guesser

export function getPlayerId() {
  let id = localStorage.getItem('kremala-pid')
  if (!id) {
    id = Math.random().toString(36).slice(2, 12)
    localStorage.setItem('kremala-pid', id)
  }
  return id
}

function randomCode() {
  return Array.from({ length: 4 }, () =>
    CHARS[Math.floor(Math.random() * CHARS.length)]
  ).join('')
}

async function makeCode() {
  const code = randomCode()
  const { data } = await supabase.from('rooms').select('code').eq('code', code).maybeSingle()
  return data ? makeCode() : code
}

// ── Σύνθεση του room object (ίδιο σχήμα με πριν, για να μην αλλάξουν τα screens) ──
function composeRoom(roomRow, playerRows, stateRows) {
  if (!roomRow) return null
  const players = {}
  const ready = {}
  for (const p of playerRows || []) {
    players[p.pid] = { name: p.name, role: p.role }
    if (p.ready) ready[p.pid] = true
  }
  const raceStates = {}
  let gameState = null
  for (const s of stateRows || []) {
    const st = { guessed: s.guessed || {}, livesRemaining: s.lives, status: s.status }
    if (s.pid === SHARED) gameState = st
    else raceStates[s.pid] = st
  }
  return {
    code: roomRow.code,
    mode: roomRow.mode,
    status: roomRow.status,
    word: roomRow.word,
    winner: roomRow.winner,
    createdAt: roomRow.created_at,
    players,
    ready,
    gameState,
    raceStates,
  }
}

// ── Mutations ────────────────────────────────────────────────────────────────

export async function createRoom(myId, myName, mode) {
  const code = await makeCode()
  const { error } = await supabase.from('rooms').insert({
    code,
    mode,
    status: 'ready-check',
    created_at: Date.now(),
  })
  if (error) throw new Error('Σφάλμα δημιουργίας δωματίου')
  await supabase.from('players').insert({
    code,
    pid: myId,
    name: myName,
    role: mode === 'setter-guesser' ? 'setter' : 'host',
    joined_at: Date.now(),
  })
  return code
}

export async function joinRoom(myId, myName, code) {
  const { data: room } = await supabase.from('rooms').select('*').eq('code', code).maybeSingle()
  if (!room) throw new Error('Το δωμάτιο δεν βρέθηκε')

  const { data: players } = await supabase.from('players').select('pid,role').eq('code', code)
  if ((players || []).some(p => p.pid === myId)) return // ήδη μέσα (rejoin)
  if ((players || []).length >= MAX_PLAYERS) throw new Error('Το δωμάτιο είναι γεμάτο')
  if (room.status !== 'ready-check') throw new Error('Το παιχνίδι έχει ήδη ξεκινήσει')

  const role = room.mode === 'setter-guesser' ? 'guesser' : 'player'
  const { error } = await supabase.from('players').insert({
    code,
    pid: myId,
    name: myName,
    role,
    joined_at: Date.now(),
  })
  if (error) throw new Error('Σφάλμα συμμετοχής')
}

export async function markReady(code, myId) {
  await supabase.from('players').update({ ready: true }).eq('code', code).eq('pid', myId)
}

// Καλείται μόνο από τον host όταν είναι όλοι έτοιμοι.
export async function startGame(code, mode, playerIds) {
  if (mode === 'race') {
    const rows = playerIds.map(pid => ({ code, pid, guessed: {}, lives: 6, status: 'playing' }))
    await supabase.from('states').upsert(rows)
    await supabase.from('rooms').update({ status: 'playing' }).eq('code', code)
  } else {
    await supabase.from('rooms').update({ status: 'setting-word' }).eq('code', code)
  }
}

export async function setWord(code, word) {
  await supabase.from('states').upsert({
    code, pid: SHARED, guessed: {}, lives: 6, status: 'playing',
  })
  await supabase.from('rooms').update({ word, status: 'playing' }).eq('code', code)
}

// Setter/Guesser — κοινό board
export async function guessLetter(code, letter, word, guessed, lives) {
  const newGuessed = { ...guessed, [letter]: true }
  const hit = word.includes(letter)
  const newLives = hit ? lives : lives - 1
  const allFound = [...new Set(word)].every(l => newGuessed[l])
  const status = allFound ? 'won' : newLives <= 0 ? 'lost' : 'playing'

  await supabase.from('states')
    .update({ guessed: newGuessed, lives: newLives, status })
    .eq('code', code).eq('pid', SHARED)

  if (status !== 'playing') {
    await supabase.from('rooms').update({ status: 'finished' }).eq('code', code)
  }
}

// Race — ο κάθε παίκτης γράφει μόνο τη δική του γραμμή
export async function guessLetterRace(code, myId, letter, word, guessed, lives, raceStates) {
  const newGuessed = { ...guessed, [letter]: true }
  const hit = word.includes(letter)
  const newLives = hit ? lives : lives - 1
  const allFound = [...new Set(word)].every(l => newGuessed[l])
  const myStatus = allFound ? 'won' : newLives <= 0 ? 'lost' : 'playing'

  await supabase.from('states')
    .update({ guessed: newGuessed, lives: newLives, status: myStatus })
    .eq('code', code).eq('pid', myId)

  if (myStatus === 'won') {
    await supabase.from('rooms').update({ status: 'finished', winner: myId }).eq('code', code)
  } else if (myStatus === 'lost') {
    // Τελειώνει μόνο αν δεν έμεινε κανείς άλλος να παίζει
    const stillPlaying = Object.entries(raceStates || {}).some(
      ([id, st]) => id !== myId && (st?.status ?? 'playing') === 'playing'
    )
    if (!stillPlaying) {
      await supabase.from('rooms').update({ status: 'finished' }).eq('code', code)
    }
  }
}

export async function resetRoom(code, mode) {
  await supabase.from('states').delete().eq('code', code)
  await supabase.from('players').update({ ready: false }).eq('code', code)
  await supabase.from('rooms')
    .update({ status: 'ready-check', word: null, winner: null })
    .eq('code', code)
}

// ── Realtime subscription ────────────────────────────────────────────────────
export function useRoomSubscription(roomCode) {
  const [room, setRoom] = useState(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!roomCode) { setRoom(null); setLoaded(true); return }
    setLoaded(false)
    let active = true

    async function refresh() {
      const [roomRes, playersRes, statesRes] = await Promise.all([
        supabase.from('rooms').select('*').eq('code', roomCode).maybeSingle(),
        supabase.from('players').select('*').eq('code', roomCode),
        supabase.from('states').select('*').eq('code', roomCode),
      ])
      if (!active) return
      setRoom(composeRoom(roomRes.data, playersRes.data, statesRes.data))
      setLoaded(true)
    }

    refresh()

    const channel = supabase
      .channel(`room:${roomCode}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms', filter: `code=eq.${roomCode}` }, refresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'players', filter: `code=eq.${roomCode}` }, refresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'states', filter: `code=eq.${roomCode}` }, refresh)
      .subscribe()

    return () => {
      active = false
      supabase.removeChannel(channel)
    }
  }, [roomCode])

  return { room, loaded }
}
