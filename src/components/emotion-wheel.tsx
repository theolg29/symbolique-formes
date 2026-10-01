import { useId, useState } from 'react'
import { ShapeGlyph } from './shape-glyph'
import { evocations } from '@/data/evocations'
import type { Shape } from '@/lib/model'

const colors=[{fill:'#fff0dc',active:'#ffe0ad',ink:'#92520f'},{fill:'#e9efff',active:'#cddcff',ink:'#345ba0'},{fill:'#eee9fa',active:'#dbcef4',ink:'#7153a2'}]
const polar=(radius:number,angle:number)=>{const radians=angle*Math.PI/180;return {x:150+radius*Math.cos(radians),y:150+radius*Math.sin(radians)}}
function petal(index:number){
  const angle=-90+index*120
  const left=polar(60,angle-48),right=polar(60,angle+48),outerLeft=polar(126,angle-35),outerRight=polar(126,angle+35),tipLeft=polar(139,angle-18),tipRight=polar(139,angle+18),tip=polar(140,angle)
  return `M${left.x},${left.y} C${outerLeft.x},${outerLeft.y} ${tipLeft.x},${tipLeft.y} ${tip.x},${tip.y} C${tipRight.x},${tipRight.y} ${outerRight.x},${outerRight.y} ${right.x},${right.y} A60,60 0 0 0 ${left.x},${left.y} Z`
}

export function EmotionWheel({shape}:{shape:Shape}) {
  const [selected,setSelected]=useState(0)
  const [hovered,setHovered]=useState<number|null>(null)
  const detailId=useId()
  const description=evocations[shape.id][selected]
  return <section className="evocation-section" aria-label={`Émotions et associations de ${shape.name}`}>
    <h4>Émotions et associations</h4><p className="evocation-intro">Explorez les évocations possibles de cette forme.</p>
    <div className="emotion-wheel" role="group" aria-label="Carte des évocations">
      <svg viewBox="0 0 300 300" aria-hidden="true" className="emotion-wheel-sectors"><circle cx="150" cy="150" r="102" fill="none" stroke="#e4e4e7" strokeDasharray="3 6"/>{shape.associations.map((association,index)=><path key={association} d={petal(index)} fill={selected===index || hovered===index?colors[index].active:colors[index].fill} stroke={selected===index?colors[index].ink:'#ffffff'} strokeWidth={selected===index?2:1.5}/>)}</svg>
      <div className="emotion-wheel-center" aria-hidden="true"><ShapeGlyph family={shape.id}/><span>{shape.name}</span></div>
      {shape.associations.map((association,index)=>{const position=polar(101,-90+index*120);return <button key={association} type="button" className="emotion-wheel-word" style={{left:`${position.x/3}%`,top:`${position.y/3}%`}} aria-pressed={selected===index} aria-controls={detailId} onMouseEnter={()=>setHovered(index)} onMouseLeave={()=>setHovered(null)} onClick={()=>setSelected(index)}>{association}</button>})}
    </div>
    <div id={detailId} className="evocation-detail" role="status" aria-live="polite" aria-atomic="true"><strong><span className="evocation-color-dot" style={{background:colors[selected].ink}} aria-hidden="true"/>{shape.associations[selected]}</strong><p>{description.description}</p><p><span>Exemple</span> {description.example}</p></div>
    <p className="evocation-note">Pistes d’interprétation, sans intensité mesurée ni émotion garantie. Les couleurs distinguent les évocations ; elles ne représentent pas une classification scientifique.</p>
    <div className="shape-associations sr-only">{shape.associations.join(' · ')}</div>
  </section>
}
