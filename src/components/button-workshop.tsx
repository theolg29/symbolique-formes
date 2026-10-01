import { useLayoutEffect, useRef, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { Button } from './ui/button'
import { Field, FieldLabel } from './ui/field'
import { AuditRow } from './audit-row'
import { auditButton, defaultButton, shapes, sources, type ButtonDesign, type ButtonMetrics } from '@/lib/model'

export function ButtonWorkshop({design,onChange,onMeasure}:{design:ButtonDesign;onChange:(design:ButtonDesign)=>void;onMeasure:(metrics:ButtonMetrics)=>void}) {
  const preview=useRef<HTMLButtonElement>(null)
  const [metrics,setMetrics]=useState<ButtonMetrics>({width:0,height:0,radius:0})
  const [activated,setActivated]=useState(false)
  useLayoutEffect(()=>{
    const element=preview.current
    if(!element) return
    let active=true
    const measure=()=>{
      if(!active) return
      const rect=element.getBoundingClientRect()
      const next={width:rect.width,height:rect.height,radius:Math.min(parseFloat(getComputedStyle(element).borderTopLeftRadius),rect.width/2,rect.height/2)}
      setMetrics(previous=>previous.width===next.width && previous.height===next.height && previous.radius===next.radius ? previous : next)
      onMeasure(next)
    }
    measure()
    const observer=new ResizeObserver(measure)
    observer.observe(element)
    document.fonts.ready.then(measure)
    document.fonts.addEventListener('loadingdone',measure)
    return ()=>{active=false;observer.disconnect();document.fonts.removeEventListener('loadingdone',measure)}
  },[design,onMeasure])
  const update=(next:Partial<ButtonDesign>)=>{setActivated(false);onChange({...design,...next})}
  const result=auditButton(design,metrics)
  const numeric=(key:'fontSize'|'paddingX'|'paddingY'|'radius'|'borderWidth',label:string,min:number,max:number)=> <Field key={key}>
    <FieldLabel htmlFor={`button-${key}`}>{label}<span>{design[key]} px</span></FieldLabel>
    <input id={`button-${key}`} type="range" min={min} max={max} step={1} value={design[key]} onChange={event=>update({[key]:Number(event.target.value)})}/>
  </Field>
  const color=(key:'foreground'|'background'|'canvas'|'borderColor',label:string)=><Field key={key}><FieldLabel htmlFor={`button-${key}`}>{label}</FieldLabel><div className="workshop-color"><input id={`button-${key}`} type="color" value={design[key]} onChange={event=>update({[key]:event.target.value})}/><span>{design[key].toUpperCase()}</span></div></Field>
  return <div className="button-workshop">
    <section className="workshop-settings" aria-labelledby="workshop-settings-title">
      <div className="workshop-section-head"><h2 id="workshop-settings-title">Réglages</h2><Button variant="ghost" size="icon-sm" aria-label="Réinitialiser le bouton" onClick={()=>onChange(defaultButton(design.family))}><RotateCcw/></Button></div>
      <Field><FieldLabel htmlFor="button-family">Forme de départ</FieldLabel><select id="button-family" value={design.family} onChange={event=>{const preset=defaultButton(event.target.value);update({family:preset.family,radius:preset.radius})}}>{shapes.map(shape=><option key={shape.id} value={shape.id}>{shape.name}</option>)}</select></Field>
      <Field><FieldLabel htmlFor="button-label">Texte du bouton</FieldLabel><input id="button-label" type="text" maxLength={120} value={design.label} onChange={event=>update({label:event.target.value})}/></Field>
      <div className="workshop-fields">{numeric('fontSize','Taille du texte',8,48)}<Field><FieldLabel htmlFor="button-weight">Graisse du texte</FieldLabel><select id="button-weight" value={design.fontWeight} onChange={event=>update({fontWeight:Number(event.target.value)})}>{[300,400,500,600,650,700,800,900].map(weight=><option key={weight} value={weight}>{weight}</option>)}</select></Field>{numeric('paddingX','Padding horizontal',0,64)}{numeric('paddingY','Padding vertical',0,48)}{numeric('radius','Arrondi',0,96)}{numeric('borderWidth','Épaisseur de bordure',0,8)}</div>
      {['organic','triangle'].includes(design.family) && <p className="helper">Cette famille inspire l’identité ; le bouton garde un contour régulier pour le texte.</p>}
      <h3>Couleurs</h3><div className="workshop-fields">{color('foreground','Texte')}{color('background','Fond du bouton')}{color('canvas','Fond de l’aperçu')}{color('borderColor','Bordure')}</div>
    </section>
    <div className="workshop-output">
      <section className="workshop-preview" aria-labelledby="workshop-preview-title"><div className="workshop-section-head"><h2 id="workshop-preview-title">Votre bouton</h2><span className="workshop-dimensions">{metrics.width.toFixed(1)} × {metrics.height.toFixed(1)} px</span></div>
        <div className="workshop-canvas" style={{background:design.canvas}}><button ref={preview} className="draft-button" type="button" aria-label={design.label.trim() || 'Bouton sans libellé'} style={{padding:`${design.paddingY}px ${design.paddingX}px`,fontSize:design.fontSize,fontWeight:design.fontWeight,borderRadius:design.radius,border:`${design.borderWidth}px solid ${design.borderColor}`,color:design.foreground,background:design.background}} onClick={()=>setActivated(true)}>{design.label || '\u00a0'}</button></div>
        <p className="workshop-interaction" role="status">{activated ? 'Bouton activé. Vous pouvez aussi le tester avec Entrée ou Espace.' : 'Cliquez sur le bouton ou testez-le au clavier.'}</p>
      </section>
      <section className="workshop-checks" aria-labelledby="workshop-checks-title"><div className="workshop-section-head"><h2 id="workshop-checks-title">Contrôles en direct</h2><span className="quiet-label">RGAA 4.1.2</span></div>
        <AuditRow good={result.contrast} title="Contraste du texte · RGAA 3.2" detail={`${result.ratio.toFixed(2)}:1 · minimum ${result.threshold}:1 pour ${result.large ? 'ce grand texte' : 'ce texte courant'}.`}/>
        <AuditRow good={result.boundary} title="Repérage du bouton · RGAA 3.3" detail={`${result.boundaryRatio.toFixed(2)}:1 entre le fond ou la bordure et le fond de l’aperçu. Repère : 3:1 lorsque le contour est nécessaire.`}/>
        <AuditRow good={result.label} title="Présence du libellé" detail={result.label ? 'Le bouton contient du texte. Vérifiez qu’il décrit clairement l’action.' : 'Ajoutez un texte pour nommer l’action du bouton.'}/>
        <h3>Dimensions · WCAG 2.2</h3>
        <AuditRow good={result.target} title="Cible minimale · 24 × 24 px" detail={result.target ? 'Un carré de 24 × 24 px tient dans la cible, en tenant compte de l’arrondi.' : 'Agrandissez le bouton ou vérifiez les exceptions, notamment l’espacement des cibles dans l’interface finale.'}/>
        <AuditRow good={result.comfortable} title="Cible renforcée · 44 × 44 px" detail={result.comfortable ? 'Le bouton atteint le repère renforcé, en tenant compte de l’arrondi.' : 'Augmentez le padding pour atteindre ce repère renforcé (AAA). Ce seuil ne fait pas partie du RGAA 4.1.2.'}/>
        <h3>À vérifier en contexte</h3>
        <AuditRow good={null} title="Clavier, focus et états" detail="Testez Tab, Entrée et Espace. Vérifiez le focus visible et les contrastes au survol, après activation et dans votre interface finale."/>
        <AuditRow good={null} title="Sens de l’action et agrandissement" detail="Vérifiez le libellé, puis le texte à 200 % dans la mise en page finale. Une taille de police n’est pas, à elle seule, une preuve de lisibilité."/>
        <p className="workshop-note">Contrôles partiels sur le bouton affiché au repos. Les dimensions WCAG sont complémentaires au RGAA.</p>
        <div className="source-links">{sources.filter(source=>source.id==='rgaa' || source.id.startsWith('wcag')).map(source=><a key={source.id} href={source.url} target="_blank" rel="noreferrer">{source.title}</a>)}</div>
      </section>
    </div>
  </div>
}
