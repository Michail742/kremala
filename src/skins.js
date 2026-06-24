export const SKINS = [
  {
    id: 'classic',
    name: 'Κλασικό',
    skinColor: '#bfe9d4',
    hairColor: '#21b58e',
    lineColor: '#173a2e',
  },
  {
    id: 'ghost',
    name: 'Φάντασμα',
    skinColor: '#dae5ff',
    hairColor: '#6a8ee0',
    lineColor: '#1a2f6a',
  },
  {
    id: 'skeleton',
    name: 'Σκελετός',
    skinColor: '#f0e6c8',
    hairColor: '#c09030',
    lineColor: '#4a380c',
  },
  {
    id: 'robot',
    name: 'Ρομπότ',
    skinColor: '#b8c8d8',
    hairColor: '#4878a0',
    lineColor: '#152030',
  },
  {
    id: 'vampire',
    name: 'Βαμπίρ',
    skinColor: '#f2e0e8',
    hairColor: '#b01830',
    lineColor: '#280810',
  },
  {
    id: 'alien',
    name: 'Εξωγήινος',
    skinColor: '#c0f080',
    hairColor: '#28a018',
    lineColor: '#0c3205',
  },
]

export function applySkin(skin) {
  const el = document.documentElement
  el.style.setProperty('--char-skin', skin.skinColor)
  el.style.setProperty('--char-hair', skin.hairColor)
  el.style.setProperty('--char-line', skin.lineColor)
}

export function loadSkin() {
  try {
    const saved = JSON.parse(localStorage.getItem('kremala-skin'))
    const skin = SKINS.find(s => s.id === saved) || SKINS[0]
    applySkin(skin)
    return skin.id
  } catch {
    applySkin(SKINS[0])
    return 'classic'
  }
}

export function saveSkin(skinId) {
  localStorage.setItem('kremala-skin', JSON.stringify(skinId))
}
