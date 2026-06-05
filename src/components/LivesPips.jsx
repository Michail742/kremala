export default function LivesPips({ lives, total = 6 }) {
  return (
    <div className="lives" role="img" aria-label={`${lives} ζωές`}>
      {Array.from({ length: total }, (_, i) => (
        <svg key={i} viewBox="0 0 24 24" className={i < lives ? 'pip' : 'pip lost'}>
          <path d="M12 21s-7-4.4-9.3-8.2C1.1 9.6 2.9 6 6.2 6c2 0 3.2 1.1 3.9 2.4C10.8 7.1 12 6 14 6c3.3 0 5.1 3.6 3.5 6.8C19 16.6 12 21 12 21Z"/>
        </svg>
      ))}
    </div>
  )
}
