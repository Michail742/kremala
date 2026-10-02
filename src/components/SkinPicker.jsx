import Character from './Character'
import { SKINS, applySkin, saveSkin } from '../skins'

export default function SkinPicker({ activeSkinId, onChange }) {
  function handleSelect(skin) {
    applySkin(skin)
    saveSkin(skin.id)
    onChange(skin.id)
  }

  return (
    <div className="kr-skins">
      <span className="pp-label">Ο χαρακτήρας σου</span>
      <div className="kr-skins__grid">
        {SKINS.map(skin => (
          <button
            key={skin.id}
            type="button"
            className="kr-skin"
            aria-pressed={activeSkinId === skin.id}
            onClick={() => handleSelect(skin)}
          >
            <span className="kr-skin__preview" aria-hidden="true">
              <Character wrongGuesses={6} skinId={skin.id} />
            </span>
            <span className="kr-skin__name">{skin.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
