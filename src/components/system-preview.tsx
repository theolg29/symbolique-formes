import { useState, type CSSProperties } from 'react'
import { ArrowRight, CalendarDays, Check, Clock3, MapPin, MoveUpRight } from 'lucide-react'
import { ShapeGlyph } from './shape-glyph'
import type { ShapeSystem } from '@/lib/model'

export function SystemPreview({ system, mode, label }: { system: ShapeSystem; mode: string; label: string }) {
  const [reserved, setReserved] = useState(false)
  const [email, setEmail] = useState('')
  const decorative = ['organic', 'triangle'].includes(system.family)
  const radius = ['pill', 'circle'].includes(system.family) ? system.height / 2 : system.radius
  const style = { '--sample-radius': `${radius}px`, '--sample-outer': `${system.outer}px`, '--sample-padding': `${system.padding}px`, '--sample-height': `${system.height}px`, '--sample-fg': system.foreground, '--sample-bg': system.background } as CSSProperties

  if (mode === 'brand') return <div className="brand-preview" style={style}>
    <div className="brand-top"><span>studio terre</span><MoveUpRight size={18}/></div>
    <div className="brand-mark"><ShapeGlyph family={system.family}/></div>
    <div className="brand-copy"><h3>La terre<br/>entre vos mains.</h3><p>Atelier d’initiation à la céramique.</p></div>
    <div className="brand-bottom"><span>Chaque samedi · 10 h</span><span>Lyon</span></div>
  </div>

  return <div className="system-preview" style={style}>
    <div className="sample-nav"><span className="sample-logo"><ShapeGlyph family={system.family}/> studio terre</span><span>Réservation</span></div>
    <div className="sample-heading"><h3>Réserver un atelier</h3><p>Une première expérience, les mains dans la terre.</p></div>
    <div className="sample-card">
      <div className="sample-workshop"><span className="sample-workshop-mark"><ShapeGlyph family={system.family}/></span><div><span className="sample-chip">Débutant</span><h4>Initiation à la céramique</h4></div></div>
      <div className="sample-card-body"><p>Modelez votre première pièce. Le matériel et la cuisson sont inclus.</p>
        <div className="sample-session"><div><CalendarDays size={16} aria-hidden="true"/><strong>Samedi matin</strong><span>45 €</span></div><p><Clock3 size={14} aria-hidden="true"/>10 h – 12 h<span>·</span><MapPin size={14} aria-hidden="true"/>Lyon</p></div>
      </div>
    </div>
    <form className="sample-booking" onSubmit={event=>{event.preventDefault();setReserved(true)}}>
      <label className="sample-label" htmlFor={`sample-email-${label}`}>Votre adresse e-mail</label>
      <div className="sample-form"><input id={`sample-email-${label}`} placeholder="vous@exemple.fr" type="email" required autoComplete="email" value={email} onChange={event=>{setEmail(event.target.value);setReserved(false)}}/></div>
      <button className="sample-button" type="submit" disabled={reserved} aria-label={`${reserved ? 'Réservation simulée' : 'Réserver ma place'} dans le système ${label}`}>{reserved ? <><Check size={15}/>Réservation simulée</> : <>Réserver ma place<ArrowRight size={15}/></>}</button>
      <p className="sample-demo-note" role="status">{reserved ? 'Exemple uniquement : aucune réservation n’est envoyée.' : 'Aperçu interactif · réservation fictive'}</p>
    </form>
    {decorative && <p className="sample-note">La forme signe l’identité. Les contrôles gardent des contours réguliers.</p>}
    {system.family==='circle' && <p className="sample-note">Les actions textuelles adoptent une capsule.</p>}
  </div>
}
