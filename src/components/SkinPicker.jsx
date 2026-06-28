import Character from './Character'
import { SKINS, applySkin, saveSkin } from '../skins'

export default function SkinPicker({ activeSkinId, onChange }) {
  function handleSelect(skin) {
    applySkin(skin)
    saveSkin(skin.id)
    onChange(skin.id)
  }

  return (
    <div className="skin-picker">
      <div className="skin-picker-grid">
        {SKINS.map(skin => (
          <button
            key={skin.id}
            className={`skin-btn${activeSkinId === skin.id ? ' active' : ''}`}
            onClick={() => handleSelect(skin)}
            title={skin.name}
          >
            <div className="skin-btn-preview">
              <Character wrongGuesses={6} skinId={skin.id} />
            </div>
            <span className="skin-btn-name">{skin.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
