import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Check, Code2, Copy, RotateCcw, Save } from 'lucide-react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Field, FieldLabel } from './ui/field'
import { ColorControl } from './color-control'
import { ParameterSlider } from './parameter-slider'
import { ButtonQuality } from './button-quality'
import { ScrollHint } from './scroll-hint'
import { AuditRow } from './audit-row'
import { auditButton, buttonAppearance, buttonStates, contrastRatio, defaultButton, exportButtonCode, shapes, buttonShapes, isButtonShape, sources, type ButtonDesign, type ButtonMetrics, type ButtonStyle, type ButtonState } from '@/lib/model'

export function ButtonWorkshop({design,onChange,onMeasure,styles,onSave,savedStyle,onEndEdit}:{design:ButtonDesign;onChange:(design:ButtonDesign,group?:string)=>void;onMeasure:(metrics:ButtonMetrics)=>void;styles:ButtonStyle[];onSave:(name:string,design:ButtonDesign,copy:boolean)=>void;savedStyle?:ButtonStyle;onEndEdit:()=>void}) {
  const [state,setState]=useState<ButtonState>('rest')
  const [simulate,setSimulate]=useState(false)
  const [interaction,setInteraction]=useState<ButtonState>('rest')
  const [codeOpen,setCodeOpen]=useState(false)
  const [copyMessage,setCopyMessage]=useState('')
  const [saved,setSaved]=useState(false)
  const [saveCopy,setSaveCopy]=useState(false)
  const codeField=useRef<HTMLTextAreaElement>(null)
  useEffect(()=>{if(saved){const timer=setTimeout(()=>setSaved(false),1800);return()=>clearTimeout(timer)}},[saved])
  const states=buttonStates(design)
  const activeState=state==='disabled' || simulate ? state : interaction
  const appearance=buttonAppearance(design,activeState)
  const editing=buttonAppearance(design,state)
  const copyCode=async()=>{
    try { await navigator.clipboard.writeText(exportButtonCode(design));setCopyMessage('Code copié.') }
    catch {codeField.current?.focus();codeField.current?.select();setCopyMessage('Sélectionnez puis copiez le code avec Ctrl/Cmd + C.')}
  }
  const [saveOpen,setSaveOpen]=useState(false)
  const [styleName,setStyleName]=useState('')
  const preview=useRef<HTMLButtonElement>(null)
  const [metrics,setMetrics]=useState<ButtonMetrics>({width:0,height:0,radius:0})
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
  const update=(next:Partial<ButtonDesign>,group=Object.keys(next).join(','))=>{onChange({...design,...next},group)}
  const updateColor=(key:'foreground'|'background'|'borderColor',value:string)=>{if(state==='rest')update({[key]:value});else update({states:{...states,[state]:{...states[state],[key]:value}}},`${state}-${key}`)}
  const result=auditButton(appearance,metrics)
  const numeric=(key:'fontSize'|'fontWeight'|'paddingX'|'paddingY'|'radius'|'borderWidth',label:string,min:number,max:number,step=1,unit='px')=> <ParameterSlider key={key} id={`button-${key}`} label={label} value={design[key]} min={min} max={max} step={step} unit={unit} onChange={value=>update({[key]:value})}/>
  const color=(key:'foreground'|'background'|'canvas'|'borderColor',label:string)=><ColorControl key={key} id={`button-${key}`} label={label} value={key==='canvas' ? design.canvas : editing[key]} onChange={value=>key==='canvas' ? update({canvas:value}) : updateColor(key,value)}/>

  return <div className="button-workshop" onPointerUp={onEndEdit} onBlurCapture={onEndEdit}>
    <section className="workshop-settings" aria-labelledby="workshop-settings-title">
      <div className="workshop-section-head"><h2 id="workshop-settings-title">Réglages</h2><div className="workshop-save-actions"><Button variant="ghost" size="icon-sm" aria-label="Enregistrer le bouton dans les favoris" disabled={!savedStyle && styles.length>=100} onClick={()=>{setStyleName(savedStyle?.name ?? (design.label.trim() || 'Mon bouton'));setSaveCopy(false);setSaveOpen(true)}}>{saved ? <Check className="save-confirmation"/> : <Save/>}</Button><Button variant="ghost" size="icon-sm" aria-label="Réinitialiser le bouton" onClick={()=>{onEndEdit();onChange(defaultButton(design.family),'reset');onEndEdit()}}><RotateCcw/></Button></div></div>
      {savedStyle && <p className="helper">Modification de « {savedStyle.name} »</p>}
      <Dialog open={saveOpen} onOpenChange={setSaveOpen}><DialogContent><DialogHeader><DialogTitle>Enregistrer dans Favoris</DialogTitle><DialogDescription>Retrouvez ce bouton et ses réglages dans la section « Boutons enregistrés » des Favoris.</DialogDescription></DialogHeader><form className="save-style-form" onSubmit={event=>{event.preventDefault();if(!styleName.trim())return;onSave(styleName.trim(),design,saveCopy);setSaveOpen(false);setSaved(true)}}><Field><FieldLabel htmlFor="style-name">Nom du bouton</FieldLabel><input id="style-name" type="text" maxLength={80} required value={styleName} onChange={event=>setStyleName(event.target.value)}/></Field>{savedStyle && <label className="save-copy-option"><input type="checkbox" checked={saveCopy} disabled={styles.length>=100} onChange={event=>setSaveCopy(event.target.checked)}/>Enregistrer une copie</label>}<Button type="submit" disabled={!styleName.trim()}>{savedStyle && !saveCopy ? 'Mettre à jour le bouton' : 'Enregistrer le bouton'}</Button></form></DialogContent></Dialog>
      <Field orientation="horizontal" className="bits-control"><FieldLabel htmlFor="button-family">Forme</FieldLabel><select aria-label="Forme de départ" id="button-family" value={design.family} onChange={event=>{const preset=defaultButton(event.target.value);update({family:preset.family,radius:preset.radius})}}>{!isButtonShape(design.family) && <option value={design.family}>{shapes.find(shape=>shape.id===design.family)?.name} · ancien style</option>}{buttonShapes.map(shape=><option key={shape.id} value={shape.id}>{shape.name}</option>)}</select></Field>
      <Field orientation="horizontal" className="bits-control"><FieldLabel htmlFor="button-label">Texte</FieldLabel><input aria-label="Texte du bouton" id="button-label" type="text" maxLength={120} value={design.label} onChange={event=>update({label:event.target.value})}/></Field>
      <div className="workshop-parameters">{numeric('fontSize','Taille du texte',8,48)}{numeric('fontWeight','Graisse',300,900,50,'')}{numeric('paddingX','Padding horizontal',0,64)}{numeric('paddingY','Padding vertical',0,48)}{numeric('radius','Arrondi',0,96)}{numeric('borderWidth','Bordure',0,8)}</div>
      {!isButtonShape(design.family) && <p className="helper">Cette famille inspire l’identité ; le bouton garde un contour régulier pour le texte.</p>}
      <fieldset className="button-state-picker"><legend>État à personnaliser</legend><div>{([['rest','Repos'],['hover','Survol'],['focus','Focus'],['disabled','Désactivé']] as const).map(([id,label])=><Button key={id} variant="ghost" size="sm" aria-pressed={state===id} onClick={()=>{setState(id);setInteraction('rest');onEndEdit()}}>{label}</Button>)}</div></fieldset>
      {state==='hover' && states.hover.background===design.background && states.hover.foreground===design.foreground && (design.borderWidth===0 || states.hover.borderColor===design.borderColor) && <p className="helper">Le survol a les mêmes couleurs que le repos. Changez le fond ou le texte pour distinguer les deux états.</p>}
      <h3>Couleurs · {({rest:'repos',hover:'survol',focus:'focus',disabled:'désactivé'})[state]}</h3><div className="workshop-fields">{color('foreground','Texte')}{color('background','Fond du bouton')}{color('canvas','Fond de l’aperçu')}{color('borderColor','Bordure')}{state==='focus' && <ColorControl id="button-focus-ring" label="Focus" value={states.focusRing} onChange={value=>update({states:{...states,focusRing:value}},'focus-ring')}/>}</div>
      <ScrollHint/>
    </section>
    <div className="workshop-output">
      <section className="workshop-preview" aria-labelledby="workshop-preview-title"><div className="workshop-section-head"><div className="workshop-preview-title"><h2 id="workshop-preview-title">Votre bouton</h2><ButtonQuality design={design} metrics={metrics}/></div><span className="workshop-dimensions">{metrics.width.toFixed(1)} × {metrics.height.toFixed(1)} px</span><Button variant="ghost" size="sm" onClick={()=>{setCopyMessage('');setCodeOpen(true)}}><Code2/>Exporter le code</Button></div>
        <div className="workshop-canvas" style={{background:design.canvas}}><button ref={preview} className="draft-button" type="button" disabled={state==='disabled'} data-state={activeState} onMouseEnter={()=>setInteraction(preview.current?.matches(':focus-visible') ? 'focus' : 'hover')} onMouseLeave={()=>setInteraction(preview.current?.matches(':focus-visible') ? 'focus' : 'rest')} onFocus={event=>{if(event.currentTarget.matches(':focus-visible'))setInteraction('focus')}} onBlur={()=>setInteraction('rest')} aria-label={design.label.trim() || 'Bouton sans libellé'} style={{padding:`${design.paddingY}px ${design.paddingX}px`,fontSize:design.fontSize,fontWeight:design.fontWeight,borderRadius:design.radius,border:`${design.borderWidth}px solid ${appearance.borderColor}`,color:appearance.foreground,background:appearance.background,outline:activeState==='focus' ? `3px solid ${states.focusRing}` : undefined,outlineOffset:4}}>{design.label || '\u00a0'}</button></div>
        <div className="workshop-preview-mode"><label><input type="checkbox" checked={simulate} onChange={event=>{setSimulate(event.target.checked);setInteraction('rest')}}/>Afficher l’état sélectionné</label><span className="preview-state" role="status">{({rest:'Repos',hover:'Survol',focus:'Focus',disabled:'Désactivé'})[activeState]}</span></div>
        {(simulate || state==='disabled') && <p className="workshop-interaction" role="status">{state==='disabled' ? 'État désactivé : le bouton ne peut pas être activé.' : 'Aperçu figé sur l’état sélectionné.'}</p>}
      </section>
      <section className="workshop-checks" tabIndex={0} aria-labelledby="workshop-checks-title"><div className="workshop-section-head"><h2 id="workshop-checks-title">Contrôles en direct</h2><span className="quiet-label">RGAA 4.1.2</span></div>
        <AuditRow good={activeState==='disabled'?null:result.contrast} title="Contraste du texte · RGAA 3.2" detail={`${result.ratio.toFixed(2)}:1 · minimum ${result.threshold}:1 pour ${result.large ? 'ce grand texte' : 'ce texte courant'}.`}/>
        <AuditRow good={activeState==='disabled'?null:result.boundary} title="Repérage du bouton · RGAA 3.3" detail={`${result.boundaryRatio.toFixed(2)}:1 entre le fond ou la bordure et le fond de l’aperçu. Repère : 3:1 lorsque le contour est nécessaire.`}/>
        <AuditRow good={result.label} title="Présence du libellé" detail={result.label ? 'Le bouton contient du texte. Vérifiez qu’il décrit clairement l’action.' : 'Ajoutez un texte pour nommer l’action du bouton.'}/>
        {activeState==='disabled' && <p className="workshop-note">Les composants inactifs sont exemptés des exigences de contraste. Les ratios sont fournis à titre indicatif.</p>}
        {activeState==='focus' && <AuditRow good={contrastRatio(states.focusRing,design.canvas)>=3} title="Contraste du contour de focus" detail={`${contrastRatio(states.focusRing,design.canvas).toFixed(2)}:1 contre le fond de l’aperçu · repère 3:1. Vérifiez aussi sa visibilité et l’absence de masquage dans l’interface finale.`}/>}
        <h3>Dimensions · WCAG 2.2</h3>
        <AuditRow good={result.target} title="Cible minimale · 24 × 24 px" detail={result.target ? 'Un carré de 24 × 24 px tient dans la cible, en tenant compte de l’arrondi.' : 'Agrandissez le bouton ou vérifiez les exceptions, notamment l’espacement des cibles dans l’interface finale.'}/>
        <AuditRow good={result.comfortable} title="Cible renforcée · 44 × 44 px" detail={result.comfortable ? 'Le bouton atteint le repère renforcé, en tenant compte de l’arrondi.' : 'Augmentez le padding pour atteindre ce repère renforcé (AAA). Ce seuil ne fait pas partie du RGAA 4.1.2.'}/>
        <h3>À vérifier en contexte</h3>
        <AuditRow good={null} title="Clavier, focus et états" detail="Testez Tab, Entrée et Espace. Vérifiez le focus visible et les contrastes au survol, après activation et dans votre interface finale."/>
        <AuditRow good={null} title="Sens de l’action et agrandissement" detail="Vérifiez le libellé, puis le texte à 200 % dans la mise en page finale. Une taille de police n’est pas, à elle seule, une preuve de lisibilité."/>
        <p className="workshop-note">Contrôles partiels sur l’état affiché du bouton. Les dimensions WCAG sont complémentaires au RGAA.</p>
        <div className="source-links">{sources.filter(source=>source.id==='rgaa' || source.id.startsWith('wcag')).map(source=><a key={source.id} href={source.url} target="_blank" rel="noreferrer">{source.title}</a>)}</div>
        <ScrollHint/>
      </section>
    </div>
    <Dialog open={codeOpen} onOpenChange={setCodeOpen}><DialogContent className="code-modal"><DialogHeader><DialogTitle>Exporter le bouton</DialogTitle><DialogDescription>HTML et CSS avec les états survol, focus et désactivé. La police Satoshi est chargée depuis Fontshare. Le fond du conteneur reste à intégrer dans votre page.</DialogDescription></DialogHeader><label className="sr-only" htmlFor="button-code">Code HTML et CSS</label><textarea ref={codeField} id="button-code" readOnly spellCheck={false} value={exportButtonCode(design)}/><div className="code-modal-actions"><p role="status">{copyMessage}</p><Button onClick={copyCode}><Copy/>Copier le code</Button></div></DialogContent></Dialog>
  </div>
}
