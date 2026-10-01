import { Fragment, useId, useState } from 'react'
import { ShapeGlyph } from './shape-glyph'
import { evocations } from '@/data/evocations'
import type { Shape } from '@/lib/model'

const colors=[
  {outer:'#fff2bd',middle:'#ffe17a',inner:'#f5c638',ink:'#81590b'},
  {outer:'#dceaff',middle:'#a9caff',inner:'#6da4ed',ink:'#285c9e'},
  {outer:'#efdefb',middle:'#d8b4ef',inner:'#b780d8',ink:'#754299'},
]
const polar=(radius:number,angle:number)=>{const radians=angle*Math.PI/180;return {x:160+radius*Math.cos(radians),y:160+radius*Math.sin(radians)}}
const center={x:160,y:160}
const cubic=(a:typeof center,b:typeof center,c:typeof center,d:typeof center,t:number)=>({x:(1-t)**3*a.x+3*(1-t)**2*t*b.x+3*(1-t)*t*t*c.x+t**3*d.x,y:(1-t)**3*a.y+3*(1-t)**2*t*b.y+3*(1-t)*t*t*c.y+t**3*d.y})
function petal(index:number){
  const angle=-90+index*120
  const left=polar(100,angle-65),leftTip=polar(132,angle-25),tip=polar(148,angle),rightTip=polar(132,angle+25),right=polar(100,angle+65)
  const points=[center,...Array.from({length:24},(_,i)=>cubic(center,left,leftTip,tip,(i+1)/24)),...Array.from({length:24},(_,i)=>cubic(tip,rightTip,right,center,(i+1)/24))]
  const minX=Math.min(...points.map(point=>point.x)),minY=Math.min(...points.map(point=>point.y))
  const width=Math.max(...points.map(point=>point.x))-minX,height=Math.max(...points.map(point=>point.y))-minY
  const label=polar(99,angle)
  return {
    bounds:{left:`${minX/3.2}%`,top:`${minY/3.2}%`,width:`${width/3.2}%`,height:`${height/3.2}%`},
    viewBox:`${minX} ${minY} ${width} ${height}`,
    path:`M160 160C${left.x} ${left.y} ${leftTip.x} ${leftTip.y} ${tip.x} ${tip.y}C${rightTip.x} ${rightTip.y} ${right.x} ${right.y} 160 160Z`,
    clip:`polygon(${points.map(point=>`${(point.x-minX)/width*100}% ${(point.y-minY)/height*100}%`).join(',')})`,
    label:{x:label.x/3.2,y:label.y/3.2},
  }
}

export function EmotionWheel({shape}:{shape:Shape}) {
  const [selected,setSelected]=useState(0)
  const detailId=useId()
  const wheelId=useId()
  const description=evocations[shape.id][selected]
  return <section className="evocation-section" aria-label={`Émotions et associations de ${shape.name}`}>
    <h4>Émotions et associations</h4><p className="evocation-intro">Explorez les évocations possibles de cette forme.</p>
    <div className="emotion-wheel" role="group" aria-label="Carte des évocations">
      {shape.associations.map((association,index)=>{
        const geometry=petal(index),color=colors[index],clipId=`${wheelId}-${index}`
        return <Fragment key={association}><button type="button" className="emotion-petal" style={{...geometry.bounds,clipPath:geometry.clip}} aria-label={association} aria-pressed={selected===index} aria-controls={detailId} onClick={()=>setSelected(index)}>
          <svg viewBox={geometry.viewBox} aria-hidden="true"><defs><clipPath id={clipId}><path d={geometry.path}/></clipPath></defs><g clipPath={`url(#${clipId})`}><path d={geometry.path} fill={color.outer}/><circle cx="160" cy="160" r="95" fill={color.middle}/><circle cx="160" cy="160" r="54" fill={color.inner}/><circle cx="160" cy="160" r="95" className="emotion-band-line"/><circle cx="160" cy="160" r="54" className="emotion-band-line"/></g><path className="emotion-petal-outline" d={geometry.path} stroke={color.ink}/></svg>
        </button><span aria-hidden="true" className="emotion-petal-label" style={{left:`${geometry.label.x}%`,top:`${geometry.label.y}%`}}>{association}</span>
        </Fragment>
      })}
      <svg viewBox="0 0 320 320" aria-hidden="true" className="emotion-wheel-guides"><circle cx="160" cy="160" r="122"/></svg>
      <div className="emotion-wheel-center" aria-hidden="true"><ShapeGlyph family={shape.id}/></div>
    </div>
    <p className="emotion-wheel-caption" aria-hidden="true">{shape.name}</p>
    <div id={detailId} className="evocation-detail" role="status" aria-live="polite" aria-atomic="true"><strong><span className="evocation-color-dot" style={{background:colors[selected].ink}} aria-hidden="true"/>{shape.associations[selected]}</strong><p>{description.description}</p><p><span>Exemple</span> {description.example}</p></div>
    <p className="evocation-note">Pistes d’interprétation, sans intensité mesurée ni émotion garantie. Les couleurs et les anneaux structurent la roue ; ils ne représentent pas des niveaux d’émotion.</p>
    <div className="shape-associations sr-only">{shape.associations.join(' · ')}</div>
  </section>
}
