import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { colord } from 'colord'
import { X } from 'lucide-react'
import { Button } from './ui/button'
import { Field, FieldLabel } from './ui/field'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { normalizeHex } from '@/lib/color'

type Hsv={h:number;s:number;v:number}
const swatches=[['Violet','#a855f7'],['Indigo','#6366f1'],['Bleu','#3b82f6'],['Cyan','#06b6d4'],['Turquoise','#14b8a6'],['Vert','#22c55e'],['Citron','#84cc16'],['Jaune','#eab308'],['Orange','#f97316'],['Rouge','#ef4444'],['Rose','#ec4899'],['Blanc','#ffffff'],['Gris','#94a3b8'],['Noir','#18181b']]

export function ColorControl({id,label,value,onChange}:{id:string;label:string;value:string;onChange:(value:string)=>void}) {
  const [open,setOpen]=useState(false)
  const [draft,setDraft]=useState<string|null>(null)
  const [error,setError]=useState(false)
  const [hsv,setHsv]=useState<Hsv>(()=>colord(value).toHsv())
  const hsvRef=useRef(hsv)
  const emitted=useRef(value.toLowerCase())
  const initial=useRef(value)
  const cancelled=useRef(false)
  useEffect(()=>{
    if(value.toLowerCase()===emitted.current)return
    const parsed=colord(value).toHsv()
    const next={h:parsed.s===0?hsvRef.current.h:parsed.h,s:parsed.s,v:parsed.v}
    hsvRef.current=next
    emitted.current=value.toLowerCase()
    setHsv(next)
  },[value])
  const change=(next:Hsv)=>{
    hsvRef.current=next;setHsv(next)
    const hex=colord(next).toHex()
    emitted.current=hex
    onChange(hex)
    setError(false)
  }
  const pick=(hex:string)=>{
    const next=colord(hex).toHsv()
    hsvRef.current=next;setHsv(next);emitted.current=hex;onChange(hex);setError(false)
  }
  const commit=()=>{
    if(cancelled.current){cancelled.current=false;setDraft(null);return}
    const next=draft===null?null:normalizeHex(draft)
    if(next){onChange(next);setError(false)}
    else if(draft!==null)setError(true)
    setDraft(null)
  }
  const point=(event:PointerEvent<HTMLDivElement>)=>{
    const rect=event.currentTarget.getBoundingClientRect()
    change({...hsvRef.current,s:Math.max(0,Math.min(100,(event.clientX-rect.left)/rect.width*100)),v:Math.max(0,Math.min(100,100-(event.clientY-rect.top)/rect.height*100))})
  }
  return <Field className="color-control-field" data-invalid={error}>
    <div className="bits-control color-control-row"><FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}><PopoverTrigger asChild><Button variant="ghost" size="icon-sm" className="color-swatch-trigger" aria-label={`Choisir la couleur : ${label}`} style={{backgroundColor:value}}/></PopoverTrigger>
        <PopoverContent className="color-picker" align="end" sideOffset={10} collisionPadding={12} aria-label={`Couleur : ${label}`}>
          <div className="color-picker-head"><strong>{label}</strong><span>{value.toUpperCase()}</span><Button variant="ghost" size="icon-sm" aria-label="Fermer le sélecteur de couleur" onClick={()=>setOpen(false)}><X/></Button></div>
          <div className="color-plane" aria-hidden="true" style={{background:`linear-gradient(to top,#000,transparent),linear-gradient(to right,#fff,hsl(${hsv.h},100%,50%))`}} onPointerDown={event=>{event.preventDefault();event.currentTarget.setPointerCapture(event.pointerId);point(event)}} onPointerMove={event=>{if(event.currentTarget.hasPointerCapture(event.pointerId))point(event)}} onPointerUp={event=>{if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId)}}><span className="color-plane-thumb" style={{left:`${hsv.s}%`,top:`${100-hsv.v}%`}}/></div>
          <label className="sr-only" htmlFor={`${id}-hue`}>Teinte : {label}</label><input id={`${id}-hue`} className="color-hue" type="range" min={0} max={360} step={1} value={hsv.h} aria-valuetext={`${Math.round(hsv.h)} degrés`} onChange={event=>change({...hsvRef.current,h:Number(event.target.value)})}/>
          <div className="color-presets" role="group" aria-label="Couleurs prédéfinies">{swatches.map(([name,hex])=><button key={hex} type="button" style={{backgroundColor:hex}} aria-label={name} aria-pressed={value.toLowerCase()===hex} title={name} onClick={()=>pick(hex)}/>)}</div>
          <details className="color-precise"><summary>Réglages précis</summary><label htmlFor={`${id}-saturation`}>Saturation <span>{Math.round(hsv.s)} %</span></label><input id={`${id}-saturation`} type="range" min={0} max={100} value={hsv.s} aria-label={`Saturation : ${label}`} onChange={event=>change({...hsvRef.current,s:Number(event.target.value)})}/><label htmlFor={`${id}-brightness`}>Luminosité <span>{Math.round(hsv.v)} %</span></label><input id={`${id}-brightness`} type="range" min={0} max={100} value={hsv.v} aria-label={`Luminosité : ${label}`} onChange={event=>change({...hsvRef.current,v:Number(event.target.value)})}/></details>
        </PopoverContent>
      </Popover>
      <input id={id} type="text" className="color-hex-input" aria-invalid={error} aria-describedby={error?`${id}-error`:undefined} value={draft??value} maxLength={7} spellCheck={false} autoComplete="off" onFocus={event=>{initial.current=value;setDraft(value);event.currentTarget.select()}} onChange={event=>{const raw=event.target.value;setDraft(raw);setError(false);const next=normalizeHex(raw);if(next && raw.replace(/^#/,'').length===6)onChange(next)}} onBlur={commit} onKeyDown={event=>{if(event.key==='Enter'){event.preventDefault();event.currentTarget.blur()}if(event.key==='Escape'){event.preventDefault();cancelled.current=true;onChange(initial.current);event.currentTarget.blur()}}}/>
    </div>
    {error && <p id={`${id}-error`} className="color-control-error" role="alert">Couleur invalide : utilisez #RRGGBB. La dernière valeur valide est conservée.</p>}
  </Field>
}
