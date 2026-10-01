import { audit, auditButton, usageOptions, shapes, sources, type ButtonMetrics, type Project } from '@/lib/model'
import { ShapeGlyph } from './shape-glyph'

export function PrintReport({project,chosen,buttonMetrics}:{project:Project;chosen:number|null;buttonMetrics:ButtonMetrics|null}) {
  const button=project.button
  const buttonResult=auditButton(button,buttonMetrics ?? {width:0,height:0,radius:0})
  const sector:Record<string,string>={sante:'Santé & bien-être',finance:'Finance & services',culture:'Culture & création',technologie:'Technologie',education:'Éducation'}
  const tone:Record<string,string>={accessible:'Accessible',rigoureux:'Rigoureux',expressif:'Expressif'}
  const audience:Record<string,string>={general:'Grand public',jeune:'Jeune public',expert:'Professionnels',senior:'Public senior'}
  return <section className="print-report" aria-label="Synthèse de l’exploration">
    <div className="print-page">
      <header className="report-header"><img src="/favicon.svg" width="28" height="28" alt=""/><span>Forme</span><span>{new Date().toLocaleDateString('fr-FR')}</span></header>
      <h1>{project.name || 'Exploration de formes'}</h1>
      <h2>Contexte</h2>
      <p>{usageOptions.find(([id])=>id===project.context.usage)?.[1]} · {sector[project.context.sector]} · {tone[project.context.tone]} · {audience[project.context.audience]}</p>
      <h2>Systèmes comparés</h2>
      <div className="report-systems">{project.systems.slice(0,project.comparison.length).map((system,index)=>{
        const shape=shapes.find(shape=>shape.id===system.family)!
        const result=audit(system)
        const radius=['pill','circle'].includes(system.family) ? system.height/2 : system.radius
        return <article className="report-system" key={index}>
          <h3>Option {index===0 ? 'A':'B'} · {shape.name}{chosen===index ? ' · Retenue':''}</h3>
          <ShapeGlyph family={shape.id}/>
          <p>{shape.description}</p>
          <div className="report-sample" style={{borderRadius:system.outer,padding:system.padding}}><div className="report-sample-art" style={{borderRadius:radius}}><ShapeGlyph family={shape.id}/></div><p>Un même contenu, deux contours.</p><div className="report-sample-action" style={{borderRadius:radius,minHeight:system.height,background:system.background,color:system.foreground}}>Commencer</div></div>
          <dl><div><dt>Rayon intérieur</dt><dd>{system.radius} px</dd></div><div><dt>Rayon extérieur</dt><dd>{system.outer} px</dd></div><div><dt>Espacement</dt><dd>{system.padding} px</dd></div><div><dt>Hauteur des cibles</dt><dd>{system.height} px</dd></div><div><dt>Texte / fond</dt><dd>{system.foreground} / {system.background}</dd></div></dl>
          <h4>Contrôles</h4>
          <ul className="report-checks"><li data-status={result.nested===null ? 'manual' : result.nested ? 'success':'warning'}>Imbrication : {result.nested===null ? 'à évaluer visuellement' : result.nested ? 'vérifiée' : `à ajuster (rayon attendu : ${result.expected} px)`}</li><li data-status={result.contrast ? 'success':'warning'}>Texte · RGAA 3.2 : {result.ratio.toFixed(2)}:1, {result.contrast ? 'seuil vérifié':'à ajuster'}</li><li data-status={result.boundary ? 'success':'warning'}>Composants · RGAA 3.3 : {result.boundary ? 'seuil vérifié':'à ajuster'}</li><li data-status={result.target ? 'success':'warning'}>Cibles · WCAG 2.2 : {result.target ? 'seuil de 24 px vérifié':'à agrandir'}</li><li data-status="manual">Clavier, focus et étiquettes : à évaluer.</li></ul>
        </article>
      })}</div>
      <p className="report-note">Vérification partielle : ces calculs ne constituent pas un audit complet de conformité RGAA.</p>
    </div>
    <div className="print-page">
      <h2>Bouton personnalisé</h2>
      <p>Forme de départ : {shapes.find(shape=>shape.id===button.family)?.name}</p>
      <div className="report-button-canvas" style={{background:button.canvas,padding:24,textAlign:'center',border:'1px solid #e8e8eb',borderRadius:12}}><span style={{display:'inline-block',fontSize:button.fontSize,fontWeight:button.fontWeight,lineHeight:1.4,padding:`${button.paddingY}px ${button.paddingX}px`,borderRadius:button.radius,border:`${button.borderWidth}px solid ${button.borderColor}`,background:button.background,color:button.foreground}}>{button.label || 'Sans libellé'}</span></div>
      <p>Texte : {button.fontSize} px · graisse {button.fontWeight}. Padding : {button.paddingX} px horizontal / {button.paddingY} px vertical. Arrondi : {button.radius} px. Bordure : {button.borderWidth} px.</p>
      <p>Texte {button.foreground} · fond {button.background} · bordure {button.borderColor} · aperçu {button.canvas}.</p>
      <ul className="report-checks"><li data-status={buttonResult.contrast ? 'success':'warning'}>Contraste du texte : {buttonResult.ratio.toFixed(2)}:1 / minimum {buttonResult.threshold}:1.</li><li data-status={buttonResult.boundary ? 'success':'warning'}>Repérage du bouton : {buttonResult.boundaryRatio.toFixed(2)}:1 / repère 3:1.</li><li data-status={buttonResult.label ? 'success':'warning'}>Présence du libellé : {buttonResult.label ? 'vérifiée':'à compléter'}.</li>{buttonMetrics && <><li>Dimensions mesurées à l’écran : {buttonMetrics.width.toFixed(1)} × {buttonMetrics.height.toFixed(1)} px.</li><li data-status={buttonResult.target ? 'success':'warning'}>Repère 24 × 24 px : {buttonResult.target ? 'atteint':'à agrandir ou vérifier les exceptions'}.</li><li data-status={buttonResult.comfortable ? 'success':'warning'}>Repère renforcé 44 × 44 px : {buttonResult.comfortable ? 'atteint':'à agrandir'}.</li></>}<li data-status="manual">Clavier, focus, états, sens de l’action et texte agrandi : à vérifier en contexte.</li></ul>
      {!buttonMetrics && <p>Ouvrez l’atelier pour mesurer les dimensions du bouton à l’écran.</p>}
      <p className="report-note">Contrôles partiels au repos. Les dimensions WCAG 2.2 sont complémentaires au RGAA 4.1.2.</p>
    </div>
    <div className="print-page">
      <h2>Justification des familles</h2>
      {project.systems.slice(0,project.comparison.length).map((system,index)=>{
        const shape=shapes.find(shape=>shape.id===system.family)!
        return <article className="report-rationale" key={index}><h3>Option {index===0 ? 'A':'B'} · {shape.name}</h3><p><strong>Émotions et associations possibles :</strong> {shape.associations.join(' · ')}.</p><p>{shape.effect}</p><p><strong>Contextes favorables :</strong> {shape.favorable.join(', ')}.</p><p><strong>À éviter :</strong> {shape.avoid.join(', ')}.</p><p><strong>Attention :</strong> {shape.attention}</p><p><strong>Références :</strong> {shape.sourceIds.map(id=>sources.find(source=>source.id===id)!.authors).join(' ; ')}.</p></article>
      })}
      {project.favorites.length>0 && <><h2>Favoris</h2><p>{project.favorites.map(id=>shapes.find(shape=>shape.id===id)!.name).join(' · ')}</p></>}
      <h2>Références</h2>
      <div className="report-references">{sources.map(source=><p key={source.id}><strong>{source.title}</strong> · {source.authors}, {source.year}<br/><a href={source.url}>{source.url}</a></p>)}</div>
      <p className="report-note">Les suggestions reposent sur une heuristique éditoriale. Les effets perçus sont des tendances à valider dans le contexte du projet. Les seuils de taille WCAG 2.2 ne font pas partie du RGAA 4.1.2.</p>
    </div>
  </section>
}
