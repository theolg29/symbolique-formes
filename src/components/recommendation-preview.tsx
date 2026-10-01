import { ArrowRight, Check } from 'lucide-react'
import { ShapeGlyph } from './shape-glyph'
import type { Shape } from '@/lib/model'

export function RecommendationPreview({shape,usage}:{shape:Shape;usage:string}) {
  const radius=['pill','circle'].includes(shape.id)?999:shape.radius
  return <div className="recommendation-preview" aria-label={`Exemple : ${usage==='button'?'bouton':usage==='card'?'carte':usage==='badge'?'badge':'identité graphique'}`}>
    {usage==='button' && <><span className="recommendation-sample-action" style={{borderRadius:radius}}>Continuer <ArrowRight size={14}/></span><span className="preview-caption">Une action claire</span></>}
    {usage==='card' && <><div className="recommendation-sample-card" style={{borderRadius:radius}}><div className="sample-card-image" style={{borderRadius:Math.max(0,radius-8)}}/><strong>Votre prochain rendez-vous</strong><span>Jeudi · 10:30</span></div><span className="preview-caption">Un bloc de contenu</span></>}
    {usage==='badge' && <><span className="recommendation-sample-badge" style={{borderRadius:radius}}><Check size={14}/> Disponible</span><span className="preview-caption">Un statut identifiable</span></>}
    {usage==='identity' && <><ShapeGlyph family={shape.id}/><span className="preview-caption">Une signature graphique</span></>}
  </div>
}
