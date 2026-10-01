import { CircleHelp } from 'lucide-react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { buttonQuality, type ButtonDesign, type ButtonMetrics } from '@/lib/model'

export function ButtonQuality({design,metrics}:{design:ButtonDesign;metrics:ButtonMetrics}) {
  const score=buttonQuality(design,metrics)
  const measured=metrics.width>0 && metrics.height>0
  const level=score.value>=90?'good':score.value>=60?'medium':'low'
  return <Dialog><DialogTrigger asChild><Button variant="ghost" size="sm" className="button-quality-trigger" data-level={measured?level:'pending'} aria-label={`Score de qualité du bouton : ${measured?`${score.value} sur 100`:'mesure en cours'}`}><span>Qualité</span><strong>{measured?score.value:'—'}<span> / 100</span></strong><CircleHelp size={13}/></Button></DialogTrigger>
    <DialogContent className="quality-modal"><DialogHeader><DialogTitle>Score de qualité du bouton</DialogTitle><DialogDescription>Un repère sur la lisibilité et les propriétés mesurables des états repos, survol et focus. L’état désactivé est exclu.</DialogDescription></DialogHeader>
      <div className="quality-total" data-level={level}><strong>{measured?score.value:'—'}<span> / 100</span></strong><p>Score indicatif selon une pondération propre à Forme. Il ne mesure ni la conversion, ni la performance technique, ni la conformité complète au RGAA.</p></div>
      {score.limits.length>0 && <div className="quality-limits"><h3>Score plafonné à {score.ceiling}/100</h3><p>{score.raw} points calculés avant plafonnement. Les points forts ne compensent pas ces limites :</p><ul>{score.limits.map(limit=><li key={limit.reason}>{limit.reason} Plafond : {limit.max}/100.</li>)}</ul></div>}
      <div className="quality-breakdown">{score.groups.map(group=><div className="quality-criterion" key={group.label}><div><strong>{group.label}</strong><span>{group.points} / {group.max}</span></div><p>{group.detail}</p><div className="quality-track" aria-hidden="true"><span style={{width:`${group.points/group.max*100}%`}}/></div></div>)}</div>
      {score.priorities.length>0 && <div className="quality-priorities"><h3>À améliorer</h3><ul>{score.priorities.map(priority=><li key={priority}>{priority}</li>)}</ul></div>}
      <p className="quality-note">Même avec 100/100, testez la compréhension de l’action, le clavier, le focus dans la page et l’efficacité auprès de vos utilisateurs.</p>
    </DialogContent>
  </Dialog>
}
