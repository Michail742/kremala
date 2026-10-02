// Φύλλο αποτελέσματος του design system (pp-sheet): τίτλος, μήνυμα, η λέξη και οι ενέργειες.
export default function ResultSheet({ label, title, msg, word, wordLabel = 'Η λέξη', loss = false, extra, children }) {
  return (
    <div className="pp-scrim">
      <section className={'pp-sheet' + (loss ? ' is-loss' : '')} role="dialog" aria-modal="true" aria-labelledby="kr-result-title">
        <div className="pp-sheet__grip" aria-hidden="true" />
        <div className="pp-sheet__head">
          {label && <span className="pp-label">{label}</span>}
          <h2 className="pp-sheet__title" id="kr-result-title">{title}</h2>
          {msg && <p className="pp-sheet__msg">{msg}</p>}
        </div>
        {word && (
          <div className="pp-sheet__reveal">
            <span className="pp-label">{wordLabel}</span>
            <span className="pp-sheet__word">{word}</span>
          </div>
        )}
        {extra}
        <div className="pp-sheet__actions">{children}</div>
      </section>
    </div>
  )
}
