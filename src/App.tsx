import { Fragment, useEffect, useRef, useState, type ChangeEvent } from 'react'
import { ArrowRight, ArrowUpRight, Bookmark, Check, CheckCircle2, CircleHelp, Download, ExternalLink, GitCompareArrows, Info, Layers2, MoveRight, RotateCcw, Shapes, SlidersHorizontal, Upload, X, PanelLeftClose, PanelLeftOpen, Plus, MousePointer2, Undo2, Redo2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Separator } from '@/components/ui/separator'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from '@/components/ui/empty'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { EmotionWheel } from '@/components/emotion-wheel'
import { ShapeGlyph } from '@/components/shape-glyph'
import { SystemPreview } from '@/components/system-preview'
import { ButtonWorkshop } from '@/components/button-workshop'
import { SavedButtonCard } from '@/components/saved-button-card'
import { RecommendationPreview } from '@/components/recommendation-preview'
import { ButtonHistory } from '@/lib/button-history'
import { PrintReport } from '@/components/print-report'
import { audit, buttonFromSystem, loadProject, parseProject, preset, rankShapes, usageOptions, shapes, sources, STORAGE_KEY, type ButtonDesign, type ButtonStyle, type ButtonMetrics, type Project, type Shape, type ShapeSystem } from '@/lib/model'
import { cn } from '@/lib/utils'

const sectorOptions = [['sante','Santé & bien-être'],['finance','Finance & services'],['culture','Culture & création'],['technologie','Technologie'],['education','Éducation']]
const toneOptions = [['accessible','Accessible'],['rigoureux','Rigoureux'],['expressif','Expressif']]
const audienceOptions = [['general','Grand public'],['jeune','Jeune public'],['expert','Professionnels'],['senior','Public senior']]
function SourceLinks({ shape }: { shape: Shape }) {
  return <div className="source-links">{shape.sourceIds.map(id=>{const source=sources.find(s=>s.id===id)!;return <a key={id} href={source.url} target="_blank" rel="noreferrer">{source.authors}, {source.year}<ArrowUpRight size={12}/></a>})}</div>
}
function SystemEditor({system, index, update, mode, selected, choose, remove}: {system: ShapeSystem; index: number; update: (system: ShapeSystem)=>void; mode: string; selected: boolean; choose: ()=>void; remove: ()=>void}) {
  const label = index===0 ? 'A' : 'B'
  const shape = shapes.find(s=>s.id===system.family)!
  const result = audit(system)
  const numberField = (key: 'radius'|'outer'|'padding'|'height', title: string, min: number, max: number) => <Field key={key}>
    <FieldLabel htmlFor={`${label}-${key}`}>{title}<span>{system[key]} px</span></FieldLabel>
    <input id={`${label}-${key}`} aria-label={`${title} ${label}`} type="range" min={min} max={max} value={system[key]} onChange={e=>update({...system,[key]:Number(e.target.value)})}/>
  </Field>
  return <section className="system-panel" aria-label={`Système ${label}`}>
    <div className="system-panel-head"><div><span className="system-letter">{label}</span><h3>Système {label}</h3></div><select aria-label={`Famille du système ${label}`} value={system.family} onChange={e=>update(preset(e.target.value))}>{shapes.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select><Button variant="remove" size="icon" onClick={remove} aria-label={`Retirer ${shape.name} de la comparaison`}><X/></Button></div>
    <SystemPreview system={system} mode={mode} label={label}/>
    <div className="system-choice"><Button variant={selected ? 'secondary' : 'outline'} onClick={choose} aria-pressed={selected}>{selected && <Check data-icon="inline-start"/>}{selected ? `Option ${label} retenue` : `Retenir l’option ${label}`}</Button></div><details className="advanced-settings"><summary><SlidersHorizontal size={14}/> Ajuster les rayons et les couleurs</summary><div className="system-settings"><div className="section-title"><h4><SlidersHorizontal size={14}/> Paramètres</h4><Button variant="ghost" size="sm" onClick={()=>update(preset(system.family))} aria-label={`Réinitialiser le système ${label}`}><RotateCcw data-icon="inline-start"/>Réinitialiser</Button></div>
      <FieldGroup className="parameter-grid">{numberField('radius','Rayon intérieur',0,64)}{numberField('outer','Rayon extérieur',0,64)}{numberField('padding','Espacement intérieur',0,32)}{numberField('height','Hauteur des cibles',16,64)}</FieldGroup>
      <FieldGroup className="color-fields"><Field><FieldLabel htmlFor={`${label}-bg`}>Fond de l’action</FieldLabel><div><input id={`${label}-bg`} type="color" value={system.background} onChange={e=>update({...system,background:e.target.value})}/><span>{system.background}</span></div></Field><Field><FieldLabel htmlFor={`${label}-fg`}>Texte de l’action</FieldLabel><div><input id={`${label}-fg`} type="color" value={system.foreground} onChange={e=>update({...system,foreground:e.target.value})}/><span>{system.foreground}</span></div></Field></FieldGroup>
      <Separator/>
      <div className="system-summary"><span><span className={cn('status-dot',(!result.contrast || !result.target || result.nested===false) && 'status-warning')}/>{result.nested===false ? 'Imbrication à ajuster' : !result.contrast ? 'Contraste à ajuster' : !result.target ? 'Cibles à agrandir' : 'Paramètres vérifiés'}</span><span>{result.ratio.toFixed(2)}:1</span></div>
      {result.nested===false && <Button variant="outline" size="sm" onClick={()=>update({...system,radius:result.expected})}>Aligner le rayon intérieur sur {result.expected} px</Button>}
      {['triangle','organic','circle','pill'].includes(shape.id) && <p className="helper">La formule d’imbrication n’est pas appliquée à cette famille. Vérifiez les contours visuellement.</p>}
      {result.radiusClamped && <p className="helper">Le rayon affiché sur les actions est limité à la demi-hauteur ({system.height/2} px).</p>}
    </div></details>
  </section>
}
export default function App() {
  const [project,setProject] = useState<Project>(loadProject)
  const [collapsed,setCollapsed] = useState(()=>window.matchMedia('(max-width: 640px)').matches)
  const [tab,setTab] = useState('context')
  const [chosen,setChosen] = useState<number | null>(null)
  const [mode,setMode] = useState('ui')
  const [buttonMetrics,setButtonMetrics] = useState<ButtonMetrics | null>(null)
  const history=useRef(new ButtonHistory())
  const [editingStyleId,setEditingStyleId]=useState<string|null>(null)
  const [deletedStyle,setDeletedStyle]=useState<{style:ButtonStyle;index:number}|null>(null)
  const loadButton=(button:ButtonDesign,id:string|null=null)=>{history.current.clear();setEditingStyleId(id);setButtonMetrics(null);setProject(p=>({...p,button:structuredClone(button)}))}
  const changeButton=(button:ButtonDesign,group='edit')=>{history.current.record(project.button,button,group);setButtonMetrics(null);setProject(p=>({...p,button}))}
  const undoButton=()=>{const button=history.current.undo(project.button);if(button){setButtonMetrics(null);setProject(p=>({...p,button}))}}
  const redoButton=()=>{const button=history.current.redo(project.button);if(button){setButtonMetrics(null);setProject(p=>({...p,button}))}}
  useEffect(()=>{
    const keydown=(event:KeyboardEvent)=>{
      if(tab!=='audit' || !(event.ctrlKey || event.metaKey) || event.altKey || event.target instanceof HTMLElement && event.target.closest('input,textarea,select,[contenteditable="true"]'))return
      const key=event.key.toLowerCase()
      if(key==='z' || key==='y'){event.preventDefault();if(key==='y' || event.shiftKey)redoButton();else undoButton()}
    }
    window.addEventListener('keydown',keydown);return()=>window.removeEventListener('keydown',keydown)
  },[tab,project.button])
  const [recommendationVisible,setRecommendationVisible] = useState(false)
  const recommendationTitle = useRef<HTMLHeadingElement>(null)
  const [message,setMessage] = useState('')
  const [storageError,setStorageError] = useState(false)
  const importInput = useRef<HTMLInputElement>(null)
  const recommendation = rankShapes(project.context)[0]
  useEffect(()=>{if(recommendationVisible) recommendationTitle.current?.focus()},[recommendationVisible])
  const updateSystem = (index: number, system: ShapeSystem) => { if(project.comparison.some((id,i)=>i!==index && id===system.family)){setMessage('Cette famille est déjà dans la comparaison.');return} setChosen(null); setProject(p=>({...p,comparison:p.comparison.map((id,i)=>i===index ? system.family : id),systems:p.systems.map((s,i)=>i===index ? system : s) as Project['systems']})) }
  useEffect(()=>{
    try { localStorage.setItem(STORAGE_KEY,JSON.stringify(project)); setStorageError(false) }
    catch { setStorageError(true) }
  },[project])
  useEffect(()=>{if(message){const timer=setTimeout(()=>{setMessage('');setDeletedStyle(null)},7000);return ()=>clearTimeout(timer)}},[message])
  const favorite = (id: string) => setProject(p=>({...p,favorites:p.favorites.includes(id) ? p.favorites.filter(f=>f!==id) : [...p.favorites,id]}))
  const toggleComparison = (shape: Shape) => {
    const index=project.comparison.indexOf(shape.id)
    if(index<0 && project.comparison.length>=2) { setMessage('La comparaison contient déjà deux familles. Retirez-en une pour en ajouter une autre.');return }
    setChosen(null)
    setProject(p=>{
      if(index>=0) {
        const kept=p.systems.filter((_,i)=>i!==index)
        return {...p,comparison:p.comparison.filter(id=>id!==shape.id),systems:[kept[0] ?? preset('soft'),kept[1] ?? preset('square')]}
      }
      const systems=[...p.systems] as Project['systems']
      systems[p.comparison.length]=preset(shape.id)
      return {...p,comparison:[...p.comparison,shape.id],systems}
    })
  }
  const exportProject = () => {
    const blob = new Blob([JSON.stringify(project,null,2)],{type:'application/json'})
    const url=URL.createObjectURL(blob), a=document.createElement('a')
    a.href=url;a.download='forme-exploration.json';a.click();URL.revokeObjectURL(url);setMessage('Exploration exportée.')
  }
  const importProject = async (e: ChangeEvent<HTMLInputElement>) => {
    const file=e.target.files?.[0];if(!file)return
    try {
      if(file.size>1024*1024) throw new Error('Choisissez un fichier de moins de 1 Mo.')
      const next=parseProject(JSON.parse(await file.text()));history.current.clear();setEditingStyleId(null);setDeletedStyle(null);setProject(next);setButtonMetrics(null);setMessage('Exploration importée.')
    } catch(error){setMessage(error instanceof SyntaxError ? 'Le fichier n’est pas un JSON valide.' : error instanceof Error ? error.message : 'Import impossible.')}
    e.target.value=''
  }
  const familyCard = (shape: Shape,reasons?: string[]) => <article key={shape.id} className="family-card">
    <div className="family-art">{reasons ? <RecommendationPreview shape={shape} usage={project.context.usage}/> : <ShapeGlyph family={shape.id}/>}<Button variant="ghost" size="icon" className="favorite-button" aria-label={`${project.favorites.includes(shape.id) ? 'Retirer' : 'Ajouter'} ${shape.name} ${project.favorites.includes(shape.id) ? 'des' : 'aux'} favoris`} aria-pressed={project.favorites.includes(shape.id)} onClick={()=>favorite(shape.id)}><Bookmark fill={project.favorites.includes(shape.id) ? 'currentColor':'none'}/></Button></div>
    <div className="family-content"><div className="family-title"><h3>{shape.name}</h3><span>{shape.associations.join(' · ')}</span></div><p>{shape.description}</p>
      {reasons && <ul className="recommendation-reasons">{reasons.map(reason=><li key={reason}>{reason}</li>)}</ul>}
      <Dialog><DialogTrigger asChild><Button variant="ghost" size="sm" className="family-explanation" aria-label={`Pourquoi cette forme : ${shape.name} ?`}>Pourquoi cette forme ? <CircleHelp size={13}/></Button></DialogTrigger><DialogContent className="family-modal"><DialogHeader><DialogTitle>{shape.name} : pourquoi cette forme ?</DialogTitle><DialogDescription>{shape.description}</DialogDescription></DialogHeader><div className="details-body"><Badge variant="outline">{shape.evidence}</Badge><EmotionWheel shape={shape}/><p>{shape.effect}</p><p>Ces évocations sont des pistes d’interprétation, sensibles à la culture, aux couleurs et au contexte. Elles ne sont pas des émotions garanties par la forme.</p><h4>Contextes favorables</h4><ul>{shape.favorable.map(v=><li key={v}>{v}</li>)}</ul><h4>À éviter</h4><ul>{shape.avoid.map(v=><li key={v}>{v}</li>)}</ul><h4>Points d’attention</h4><p>{shape.attention}</p><h4>Variantes</h4><p>{shape.variants.join(' · ')}</p><h4>Exemple à consulter</h4>{shape.examples.map(example=><a className="example-link" key={example.url} href={example.url} target="_blank" rel="noreferrer">{example.name}<ExternalLink size={12}/></a>)}<h4>Références</h4><SourceLinks shape={shape}/></div></DialogContent></Dialog>
      <div className="family-actions"><Button variant="comparison" size="sm" onClick={()=>toggleComparison(shape)} aria-label={`${project.comparison.includes(shape.id) ? 'Retirer' : 'Ajouter'} ${shape.name} ${project.comparison.includes(shape.id) ? 'de' : 'à'} la comparaison`} aria-pressed={project.comparison.includes(shape.id)}>{project.comparison.includes(shape.id) ? <Check data-icon="inline-start"/> : <Plus data-icon="inline-start"/>}{project.comparison.includes(shape.id) ? 'Retirer de la comparaison' : 'Ajouter à la comparaison'}</Button></div>
    </div>
  </article>
  return <div className="app-shell">
    <a className="skip-link" href="#main">Aller au contenu</a>
    <Tabs value={tab} onValueChange={value=>{setTab(value);if(window.matchMedia('(max-width: 640px)').matches)setCollapsed(true)}} className={cn('tool-layout',collapsed && 'sidebar-collapsed')}>
      <aside className="tool-sidebar">
        <div className="sidebar-top"><img className="sidebar-logo" src="/favicon.svg" alt="Forme" width="32" height="32"/><Button variant="ghost" size="icon" className="sidebar-toggle" aria-label={collapsed ? 'Développer la barre latérale' : 'Réduire la barre latérale'} aria-expanded={!collapsed} aria-controls="tool-navigation" onClick={()=>setCollapsed(value=>!value)}>{collapsed ? <PanelLeftOpen/> : <PanelLeftClose/>}</Button></div>
        <TabsList id="tool-navigation" className="tool-rail" aria-label="Boîte à outils">
          {[
            {id:'context',label:'Recommander',icon:Shapes},
            {id:'explore',label:'Familles',icon:Layers2},
            {id:'compare',label:'Comparer',icon:GitCompareArrows},
            {id:'audit',label:'Créer un bouton',icon:MousePointer2},
            {id:'sources',label:'Référentiels',icon:CircleHelp},
            {id:'favorites',label:'Favoris',icon:Bookmark},
          ].map(({id,label,icon:Icon})=><Fragment key={id}>{(id==='context' || id==='sources') && <span className="sidebar-section" aria-hidden="true">{id==='context' ? 'Outils' : 'Ressources'}</span>}<TabsTrigger value={id} aria-label={label} title={label}><span className="rail-icon"><Icon/>{id==='compare' && project.comparison.length>0 && <span className="comparison-count" aria-label={`${project.comparison.length} familles dans la comparaison`}>{project.comparison.length}</span>}</span><span className="rail-label">{label}</span></TabsTrigger></Fragment>)}
        </TabsList>
        <details className="file-menu"><summary aria-label="Importer ou exporter" title="Importer ou exporter"><Download size={18}/><span className="file-label">Fichier</span></summary><div><Button onClick={async()=>{await document.fonts.ready;window.print()}}><Download data-icon="inline-start"/>Exporter en PDF</Button><Button variant="outline" onClick={exportProject}><Download data-icon="inline-start"/>Exporter</Button><Button variant="outline" onClick={()=>importInput.current?.click()}><Upload data-icon="inline-start"/>Importer</Button></div></details>
        <input type="file" accept=".json,application/json" className="sr-only" ref={importInput} onChange={importProject} aria-label="Importer une exploration JSON" tabIndex={-1}/>
      </aside>
    <div className="workspace">
      <main id="main" className={cn('main-content',tab==='context' && 'start-view',tab==='audit' && 'audit-view')}>
        <div className={cn("page-heading",tab==='audit' && "workshop-page-heading")}><div className="page-heading-copy"><h1>{({context:'Choisir une forme',explore:'Familles de formes',compare:'Comparer deux systèmes',audit:'Créer un bouton',favorites:'Favoris',sources:'Références et référentiels'} as Record<string,string>)[tab]}</h1><p>{({context:'Décrivez votre projet pour trouver la forme la plus adaptée.',explore:'Explorez les six familles et leurs caractéristiques.',compare:'Le même contenu, deux géométries.',audit:'Personnalisez votre bouton et vérifiez ses critères en direct.',favorites:'Les formes et les boutons que vous avez enregistrés.',sources:'Les sources de recherche et les repères d’accessibilité.'} as Record<string,string>)[tab]}</p></div>{tab==='audit' && <div className="page-history" role="group" aria-label="Historique du bouton"><Button variant="ghost" size="sm" disabled={history.current.past.length===0} onClick={undoButton} title="Ctrl/Cmd + Z"><Undo2/>Annuler</Button><span className="history-separator" aria-hidden="true"/><Button variant="ghost" size="sm" disabled={history.current.future.length===0} onClick={redoButton} title="Ctrl/Cmd + Maj + Z"><Redo2/>Rétablir</Button></div>}</div>
        {storageError && <Alert variant="destructive"><AlertTitle>Sauvegarde indisponible</AlertTitle><AlertDescription>Exportez votre exploration pour la conserver.</AlertDescription></Alert>}
          <TabsContent value="context"><section className="context-start">
        <Field className="usage-field"><FieldLabel htmlFor="usage">Usage prévu</FieldLabel><select id="usage" value={project.context.usage} onChange={event=>setProject(p=>({...p,context:{...p.context,usage:event.target.value}}))}>{usageOptions.map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></Field>
        <FieldGroup className="context-fields">
          
          <Field><FieldLabel htmlFor="sector">Secteur</FieldLabel><select id="sector" value={project.context.sector} onChange={e=>setProject(p=>({...p,context:{...p.context,sector:e.target.value}}))}>{sectorOptions.map(([id,name])=><option value={id} key={id}>{name}</option>)}</select></Field>
          <Field><FieldLabel>Ton de marque</FieldLabel><ToggleGroup type="single" variant="outline" value={project.context.tone} onValueChange={value=>{if(value)setProject(p=>({...p,context:{...p.context,tone:value}}))}} className="tone-group" aria-label="Ton de marque">{toneOptions.map(([id,name])=><ToggleGroupItem value={id} key={id}>{name}</ToggleGroupItem>)}</ToggleGroup></Field>
          <Field><FieldLabel htmlFor="audience">Public</FieldLabel><select id="audience" value={project.context.audience} onChange={e=>setProject(p=>({...p,context:{...p.context,audience:e.target.value}}))}>{audienceOptions.map(([id,name])=><option value={id} key={id}>{name}</option>)}</select></Field>
        </FieldGroup>
            <p className="tone-help">Accueillant, structuré ou singulier : quelle impression recherchez-vous ?</p>
            <Button className="context-submit" onClick={()=>{setRecommendationVisible(true);if(recommendationVisible) recommendationTitle.current?.focus()}}>Recommander une forme<ArrowRight data-icon="inline-end"/></Button>
          </section>{recommendationVisible && <section className="recommendation-result" aria-labelledby="recommendation-title"><div className="section-heading"><div><h2 id="recommendation-title" ref={recommendationTitle} tabIndex={-1}>La forme recommandée</h2></div></div>{familyCard(recommendation.shape,recommendation.reasons)}{project.comparison.includes(recommendation.shape.id) && <Button variant="ghost" className="recommendation-compare" onClick={()=>setTab('compare')}>Voir la comparaison<ArrowRight data-icon="inline-end"/></Button>}</section>}</TabsContent>
          <TabsContent value="explore"><div className="section-heading"><div><h2>Les six familles</h2><p>Ajoutez deux familles pour comparer leurs rendus.</p></div></div><div className="family-grid all-families">{shapes.map(shape=>familyCard(shape))}</div><div className="explore-footer"><Info size={15}/><p>Les effets perçus sont des tendances, sensibles à la culture et au contexte. Les associations proposées ne sont pas universelles.</p><Button variant="ghost" size="sm" onClick={()=>setTab('sources')}>Voir les sources<ArrowUpRight data-icon="inline-end"/></Button></div><div className="next-step"><div><GitCompareArrows size={21}/><div><h3>{project.comparison.length} / 2 familles sélectionnées</h3><p>Ajoutez deux familles à la comparaison.</p></div></div><Button disabled={project.comparison.length===0} onClick={()=>setTab('compare')}>Passer à la comparaison<ArrowRight data-icon="inline-end"/></Button></div></TabsContent>
          <TabsContent value="compare"><div className="section-heading"><div><h2>{mode==='ui' ? 'Un exemple d’interface' : 'Un exemple d’affiche'}</h2><p>{mode==='ui' ? 'Comparez les contours des cartes, des champs et des boutons.' : 'Comparez la forme comme élément d’identité graphique.'}</p></div><ToggleGroup type="single" variant="outline" value={mode} onValueChange={v=>{if(v)setMode(v)}} aria-label="Type d’aperçu"><ToggleGroupItem value="ui">Interface</ToggleGroupItem><ToggleGroupItem value="brand">Identité</ToggleGroupItem></ToggleGroup></div><div className="comparison-grid">{project.systems.slice(0,project.comparison.length).map((system,index)=><SystemEditor key={index} system={system} index={index} update={s=>updateSystem(index,s)} mode={mode} selected={chosen===index} choose={()=>setChosen(index)} remove={()=>toggleComparison(shapes.find(shape=>shape.id===system.family)!)}/>)}{project.comparison.length<2 && <Empty className="comparison-empty"><EmptyHeader><EmptyMedia variant="icon"><GitCompareArrows/></EmptyMedia><EmptyTitle>{project.comparison.length===0 ? 'Choisissez deux familles' : 'Ajoutez une seconde famille'}</EmptyTitle><EmptyDescription>Sélectionnez les formes depuis l’onglet Familles.</EmptyDescription></EmptyHeader><Button onClick={()=>setTab('explore')}>Choisir une famille<Plus data-icon="inline-end"/></Button></Empty>}</div><div className="next-step"><div><CheckCircle2 size={21}/><div><h3>{chosen===null ? 'Créer à partir de cette comparaison' : `Vous retenez ${shapes.find(s=>s.id===project.systems[chosen].family)?.name}.`}</h3><p>{chosen===null ? 'L’option A sert de point de départ si vous n’en retenez aucune.' : 'Personnalisez un bouton à partir de cette forme.'}</p></div></div><Button disabled={project.comparison.length===0} onClick={()=>{loadButton(buttonFromSystem(project.systems[chosen ?? 0]));setTab('audit')}}>Créer mon bouton<ArrowRight data-icon="inline-end"/></Button></div></TabsContent>
          <TabsContent value="audit"><ButtonWorkshop design={project.button} onChange={changeButton} onMeasure={setButtonMetrics} styles={project.buttonStyles} savedStyle={project.buttonStyles.find(style=>style.id===editingStyleId)} onEndEdit={()=>history.current.end()} onSave={(name,design,copy)=>{
            const existing=project.buttonStyles.find(style=>style.id===editingStyleId)
            if((!existing || copy) && project.buttonStyles.length>=100){setMessage('La limite de 100 styles est atteinte.');return}
            const id=existing && !copy ? existing.id : crypto.randomUUID()
            const saved={id,name,design:structuredClone(design)}
            setProject(p=>({...p,buttonStyles:existing && !copy ? p.buttonStyles.map(style=>style.id===id ? saved : style) : [...p.buttonStyles,saved]}));setEditingStyleId(id);setMessage(existing && !copy ? 'Bouton mis à jour dans Favoris.' : 'Bouton enregistré dans Favoris.')
          }}/></TabsContent>
          <TabsContent value="favorites"><div className="section-heading"><div><h2>Votre collection</h2></div><Button variant="outline" size="sm" onClick={exportProject}><Download data-icon="inline-start"/>Exporter l’exploration</Button></div>
            <section className="favorite-section" aria-labelledby="favorite-shapes-title"><h2 id="favorite-shapes-title">Formes enregistrées</h2>{project.favorites.length ? <div className="family-grid">{shapes.filter(s=>project.favorites.includes(s.id)).map(s=>familyCard(s))}</div> : <div className="favorite-empty"><p>Aucune forme enregistrée.</p><Button variant="ghost" size="sm" onClick={()=>setTab('explore')}>Explorer les formes<ArrowRight data-icon="inline-end"/></Button></div>}</section>
            <section className="favorite-section" aria-labelledby="favorite-buttons-title"><h2 id="favorite-buttons-title">Boutons enregistrés</h2>{project.buttonStyles.length ? <div className="saved-buttons-grid">{project.buttonStyles.map((style,index)=><SavedButtonCard key={style.id} style={style} canDuplicate={project.buttonStyles.length<100} onEdit={()=>{loadButton(style.design,style.id);setTab('audit')}} onRename={name=>setProject(p=>({...p,buttonStyles:p.buttonStyles.map(saved=>saved.id===style.id ? {...saved,name} : saved)}))} onDuplicate={()=>{setProject(p=>({...p,buttonStyles:[...p.buttonStyles,{...style,id:crypto.randomUUID(),name:`${style.name.slice(0,71)} (copie)`,design:structuredClone(style.design)}]}));setMessage('Bouton dupliqué.')}} onRemove={()=>{setDeletedStyle({style:structuredClone(style),index});setProject(p=>({...p,buttonStyles:p.buttonStyles.filter(saved=>saved.id!==style.id)}));setMessage('Bouton supprimé.')}}/>)}</div> : <div className="favorite-empty"><p>Aucun bouton enregistré.</p><Button variant="ghost" size="sm" onClick={()=>setTab('audit')}>Créer un bouton<Plus data-icon="inline-end"/></Button></div>}</section>
          </TabsContent>
          <TabsContent value="sources">
            <section className="reference-group"><h2>Accessibilité</h2><div className="sources-list accessibility-cards">{sources.filter(source=>source.id==='rgaa' || source.id.startsWith('wcag')).sort((a,b)=>a.id==='rgaa' ? -1 : b.id==='rgaa' ? 1 : 0).map(source=><article className="source-card reference-card" key={source.id}><img className="reference-logo" src={source.id==='rgaa' ? '/logos/numerique-gouv.svg' : '/logos/w3c.svg'} alt={source.id==='rgaa' ? 'numérique.gouv' : 'W3C'} width="110" height="44"/><div><h3>{source.title}</h3><p>{source.summary}</p></div><Button variant="outline" size="sm" asChild><a href={source.url} target="_blank" rel="noreferrer">Consulter<ExternalLink data-icon="inline-end"/></a></Button></article>)}</div></section>
            <section className="reference-group"><h2>Guides et outils d’audit</h2><div className="sources-list">{sources.filter(source=>source.id==='orange').map(source=><article className="source-card" key={source.id}><img className="audit-guide-logo" src="/logos/orange.svg" alt="Orange" width="44" height="44"/><div><h3>{source.title}</h3><p>{source.summary}</p></div><Button variant="outline" size="sm" asChild><a href={source.url} target="_blank" rel="noreferrer">Consulter<ExternalLink data-icon="inline-end"/></a></Button></article>)}</div></section>
            <section className="reference-group"><h2>Perception des formes</h2><div className="sources-list">{sources.filter(source=>source.id==='contour' || source.id==='logo').map(source=><article className="source-card" key={source.id}><div><span className="quiet-label">{source.authors} · {source.year}</span><h3>{source.title}</h3><p>{source.summary}</p></div><Button variant="outline" size="sm" asChild><a href={source.url} target="_blank" rel="noreferrer">Consulter<ExternalLink data-icon="inline-end"/></a></Button></article>)}</div></section>
            <details className="research-method"><summary>Comment sont calculées les suggestions ?</summary><p>Le classement est une heuristique éditoriale : usage (8), ton (3), secteur (2), public (1). L’usage est prioritaire ; les autres choix départagent les formes adaptées. Les travaux sur les contours et les logos ne définissent pas une règle universelle pour les composants UI. Les exemples illustrent des usages, sans prouver les effets perceptifs.</p></details>
          </TabsContent>
      </main>
    </div>
    </Tabs>
    <PrintReport project={project} chosen={chosen} buttonMetrics={buttonMetrics}/>
    {message && <div className="notification" role="status"><span>{message}</span>{deletedStyle && message==='Bouton supprimé.' && <Button variant="ghost" size="sm" disabled={project.buttonStyles.length>=100} onClick={()=>{setProject(p=>{const buttonStyles=[...p.buttonStyles];buttonStyles.splice(deletedStyle.index,0,deletedStyle.style);return {...p,buttonStyles}});setDeletedStyle(null);setMessage('Suppression annulée.')}}>Annuler</Button>}<Button variant="ghost" size="icon" onClick={()=>setMessage('')} aria-label="Fermer le message"><X/></Button></div>}
  </div>
}
