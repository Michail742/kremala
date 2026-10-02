function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 5l-7 7 7 7"/>
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18"/>
    </svg>
  )
}

// Top bar του design system (pp-topbar): πίσω/κλείσιμο αριστερά, τίτλος στο κέντρο, μία ενέργεια δεξιά.
export default function TopBar({ href, onBack, back = 'back', backLabel = 'Πίσω', title, sub, right }) {
  const icon = back === 'close' ? <CloseIcon /> : <BackIcon />
  const cls = 'pp-iconbtn' + (back === 'close' ? ' pp-iconbtn--flat' : '')
  let left = <span className="pp-topbar__spacer" />
  if (href) left = <a className={cls} href={href} aria-label={backLabel}>{icon}</a>
  else if (onBack) left = <button type="button" className={cls} onClick={onBack} aria-label={backLabel}>{icon}</button>

  return (
    <header className="pp-topbar">
      {left}
      {title
        ? <h1 className="pp-topbar__title">{title}{sub && <span className="pp-topbar__sub">{sub}</span>}</h1>
        : <span />}
      {right ?? <span className="pp-topbar__spacer" />}
    </header>
  )
}
