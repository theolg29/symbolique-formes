import { useRef, useState, type CSSProperties } from 'react'

export function ParameterSlider({id,label,value,min,max,step=1,unit='px',onChange}:{id:string;label:string;value:number;min:number;max:number;step?:number;unit?:string;onChange:(value:number)=>void}) {
  const [editing,setEditing]=useState<string|null>(null)
  const cancelled=useRef(false)
  const initial=useRef(value)
  const shown=Number(value.toFixed(1))
  const normalize=(next:number)=>Math.min(max,Math.max(min,Math.round((next-min)/step)*step+min))
  const commit=()=>{
    if(!cancelled.current && editing!==null && editing.trim()!=='' && Number.isFinite(Number(editing))) onChange(normalize(Number(editing)))
    cancelled.current=false
    setEditing(null)
  }
  return <div className="parameter-slider" style={{'--parameter-progress':`${(value-min)/(max-min)*100}%`} as CSSProperties}>
    <div className="parameter-track">
      <span className="parameter-fill" aria-hidden="true"/>
      <span className="parameter-ticks" aria-hidden="true"/>
      <label htmlFor={id} className="parameter-label">{label}</label>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={event=>onChange(Number(event.target.value))}/>
    </div>
    <div className="parameter-value"><input type="text" inputMode="decimal" aria-label={`Valeur : ${label}`} value={editing ?? String(shown)} onFocus={event=>{initial.current=value;setEditing(String(shown));event.currentTarget.select()}} onChange={event=>{const raw=event.target.value;setEditing(raw);const next=Number(raw);if(raw.trim()!=='' && Number.isFinite(next) && next>=min && next<=max) onChange(normalize(next))}} onBlur={commit} onKeyDown={event=>{if(event.key==='Enter'){event.preventDefault();event.currentTarget.blur()}if(event.key==='Escape'){event.preventDefault();cancelled.current=true;onChange(initial.current);event.currentTarget.blur()}}}/>{unit && <span aria-hidden="true">{unit}</span>}</div>
  </div>
}
