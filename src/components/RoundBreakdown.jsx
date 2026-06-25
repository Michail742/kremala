// Εξήγηση κατανομής: δείχνει στο τέλος του γύρου πόσους πόντους πήρε ο καθένας
// και από πού (σωστά γράμματα / νίκη / setter). Δέχεται έτοιμες γραμμές από το roundPoints.
export default function RoundBreakdown({ rows }) {
  if (!rows || rows.length === 0) return null
  return (
    <div className="breakdown">
      <div className="breakdown-title">Πόντοι του γύρου</div>
      <div className="breakdown-list">
        {rows.map(r => (
          <div key={r.pid} className={`breakdown-row${r.isMe ? ' me' : ''}`}>
            <div className="breakdown-head">
              <span className="breakdown-name">{r.name}{r.isMe ? ' (εσύ)' : ''}</span>
              <span className="breakdown-total">+{r.total}</span>
            </div>
            <div className="breakdown-parts">{r.parts.join(' · ')}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
