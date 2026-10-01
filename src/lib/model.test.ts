import { shapePaths } from '../components/shape-glyph'
import { evocations } from '../data/evocations'
import { describe, expect, it } from 'vitest'
import { audit, auditButton, buttonQuality, buttonStates, buttonAppearance, exportButtonCode, defaultButton, contrastRatio, defaultProject, parseProject, preset, rankShapes, shapes, shapeGroups, buttonShapes, usageOptions, buttonFromSystem, sources } from './model'
describe('Recommandations',()=>{
  it('adapte la première piste au contexte sans retirer de familles',()=>{
    expect(rankShapes({usage:'button',sector:'sante',tone:'accessible',audience:'general'})[0].shape.id).toBe('soft')
    expect(rankShapes({usage:'button',sector:'finance',tone:'rigoureux',audience:'expert'})[0].shape.id).toBe('square')
    expect(rankShapes({usage:'identity',sector:'culture',tone:'expressif',audience:'jeune'})[0].shape.id).toBe('triangle')
    expect(rankShapes(defaultProject().context)).toHaveLength(shapes.length)
  })
  it('associe chaque famille à des références existantes',()=>{
    for(const shape of shapes) {
      expect(shape.sourceIds.length).toBeGreaterThan(0)
      for(const id of shape.sourceIds) expect(sources.some(s=>s.id===id)).toBe(true)
    }
  })
})
describe('Contrôles',()=>{
  it('calcule les contrastes de référence sans arrondir avant le seuil',()=>{
    expect(contrastRatio('#000000','#ffffff')).toBeCloseTo(21,8)
    expect(contrastRatio('#ffffff','#ffffff')).toBe(1)
    expect(contrastRatio('#777777','#ffffff')).toBeLessThan(4.5)
    expect(audit({...preset('soft'),background:'#777777'}).contrast).toBe(false)
  })
  it('détecte les imbrications et borne le rayon intérieur à zéro',()=>{
    expect(audit(preset('soft')).nested).toBe(true)
    expect(audit({...preset('soft'),radius:20}).nested).toBe(false)
    expect(audit({...preset('soft'),outer:8,padding:16,radius:0}).expected).toBe(0)
    expect(audit(preset('organic')).nested).toBeNull()
  })
  it('distingue les seuils de taille AA et AAA',()=>{
    expect(audit({...preset('soft'),height:23}).target).toBe(false)
    expect(audit({...preset('soft'),height:24}).target).toBe(true)
    expect(audit({...preset('soft'),height:43}).comfortable).toBe(false)
    expect(audit({...preset('soft'),height:44}).comfortable).toBe(true)
  })
})
describe('Import',()=>{
  it('accepte une exploration exportée',()=>expect(parseProject(JSON.parse(JSON.stringify(defaultProject())))).toEqual(defaultProject()))
  it.each([null,{}, { ...defaultProject(),version:2 },{...defaultProject(),systems:[preset('soft')]},{...defaultProject(),favorites:['missing']},{...defaultProject(),systems:[{...preset('soft'),height:-1},preset('square')]}])('rejette un projet invalide (%j)',value=>expect(()=>parseProject(value)).toThrow())
})


describe('Atelier bouton',()=>{
 it('mesure les deux dimensions et tient compte des angles arrondis',()=>{
  const button=defaultButton()
  expect(auditButton(button,{width:60,height:23,radius:0}).target).toBe(false)
  expect(auditButton(button,{width:23,height:60,radius:0}).target).toBe(false)
  expect(auditButton(button,{width:24,height:24,radius:12}).target).toBe(false)
  expect(auditButton(button,{width:80,height:24,radius:12}).target).toBe(true)
  expect(auditButton(button,{width:80,height:44,radius:12}).comfortable).toBe(true)
 })
 it('adapte le seuil au grand texte sans arrondir le contraste',()=>{
  const button={...defaultButton(),background:'#777777'}
  const box={width:100,height:48,radius:8}
  expect(auditButton(button,box).contrast).toBe(false)
  expect(auditButton({...button,fontSize:24},box).contrast).toBe(true)
  expect(auditButton({...button,fontSize:19,fontWeight:700},box).threshold).toBe(3)
  expect(auditButton({...button,fontSize:18,fontWeight:700},box).threshold).toBe(4.5)
 })
 it('évalue la bordure visible et refuse un libellé vide',()=>{
  const button={...defaultButton(),background:'#ffffff',canvas:'#ffffff',borderColor:'#000000'}
  const box={width:100,height:48,radius:8}
  expect(auditButton(button,box).boundary).toBe(false)
  expect(auditButton({...button,borderWidth:1},box).boundary).toBe(true)
  expect(auditButton({...button,label:'   '},box).label).toBe(false)
 })
 it('migre les anciens exports et rejette les réglages de bouton invalides',()=>{
  const legacy={...defaultProject()} as Partial<ReturnType<typeof defaultProject>>
  delete legacy.button
  expect(parseProject(legacy).button).toEqual(defaultButton('soft'))
  for(const change of [{fontSize:0},{paddingX:Infinity},{foreground:'bad'},{label:'x'.repeat(121)}]) {
   expect(()=>parseProject({...defaultProject(),button:{...defaultButton(),...change}})).toThrow('Bouton invalide')
  }
 })
})


describe('Usage et styles sauvegardés',()=>{
 it('fait passer l’usage avant les associations de ton',()=>{
  const context={sector:'culture',tone:'expressif',audience:'jeune',usage:'button'}
  expect(['square','soft','pill']).toContain(rankShapes(context)[0].shape.id)
  expect(rankShapes({...context,usage:'card'})[0].shape.id).toBe('square')
  expect(rankShapes({...context,usage:'identity'})[0].shape.id).toBe('triangle')
  expect(rankShapes({...context,usage:'badge'})[0].shape.id).toBe('pill')
 })
 it('préserve les styles et migre les anciens contextes',()=>{
  const project=defaultProject()
  project.buttonStyles=[{id:'one',name:'Action principale',design:{...project.button,paddingX:32}}]
  const restored=parseProject(JSON.parse(JSON.stringify(project)))
  expect(restored.buttonStyles[0].design.paddingX).toBe(32)
  expect(restored.buttonStyles[0].design).not.toBe(project.buttonStyles[0].design)
  const legacy={...project,context:{sector:'sante',tone:'accessible',audience:'general'}}
  expect(parseProject(legacy).context.usage).toBe('button')
  expect(()=>parseProject({...project,buttonStyles:[{id:'one',name:'',design:project.button}]})).toThrow('Styles de bouton invalides')
 })
})

describe('États et export de bouton',()=>{
 it('conserve les anciens boutons et valide les couleurs de chaque état',()=>{
  const legacy=defaultProject()
  expect(parseProject(legacy).button.states).toBeUndefined()
  const states=buttonStates(legacy.button)
  expect(states.hover.background).not.toBe(legacy.button.background)
  expect(buttonAppearance({...legacy.button,states},'disabled').background).toBe('#e4e4e7')
  expect(()=>parseProject({...legacy,button:{...legacy.button,states:{...states,focusRing:'bad'}}})).toThrow('Bouton invalide')
  expect(()=>parseProject({...legacy,buttonStyles:[{id:'one',name:'Test',design:{...legacy.button,states:{...states,hover:{...states.hover,background:'red'}}}}]})).toThrow('Styles de bouton invalides')
  const saved=parseProject({...legacy,button:{...legacy.button,states}})
  expect(saved.button.states).toEqual(states)
  expect(saved.button.states).not.toBe(states)
 })
 it('exporte les réglages et états et échappe le libellé HTML',()=>{
  const button={...defaultButton(),label:'<script>alert("test")</script> & Continuer',paddingX:32}
  const code=exportButtonCode({...button,states:{...buttonStates(button),hover:{foreground:'#000000',background:'#ffffff',borderColor:'#000000'}}})
  expect(code).toContain('padding: 14px 32px')
  expect(code).toContain(':hover:not(:disabled) { color: #000000; background: #ffffff;')
  expect(code).toContain(':focus-visible')
  expect(code).toContain(':disabled')
  expect(code).toContain('prefers-reduced-motion')
  expect(code).toContain('&lt;script&gt;')
  expect(code).not.toContain('<script>')
 })
})


describe('Score de qualité du bouton',()=>{
 const metrics={width:120,height:48,radius:8}
 it('atteint 100 uniquement lorsque tous les repères pondérés sont atteints',()=>{
  const result=buttonQuality({...defaultButton(),fontSize:16},metrics)
  expect(result.value).toBe(100)
  expect(result.groups.reduce((sum,group)=>sum+group.max,0)).toBe(100)
  expect(result.priorities).toEqual([])
  const small=buttonQuality(defaultButton(),{width:20,height:20,radius:8})
  expect(small.value).toBe(49)
  expect(small.priorities).toContain('Augmentez le padding pour atteindre une cible de 24 × 24 px, ou vérifiez les exceptions en contexte.')
 })
 it('vérifie tous les états actifs et exclut les couleurs désactivées',()=>{
  const button={...defaultButton(),fontSize:16},states=buttonStates(button)
  const badHover={...button,states:{...states,hover:{...states.hover,foreground:states.hover.background}}}
  expect(buttonQuality(badHover,metrics).value).toBe(59)
  expect(buttonQuality(badHover,metrics).priorities.join(' ')).toContain('survol')
  expect(buttonQuality({...button,states:{...states,disabled:{foreground:'#ffffff',background:'#ffffff',borderColor:'#ffffff'}}},metrics).value).toBe(100)
  expect(buttonQuality({...button,label:'  '},metrics).value).toBe(20)
  expect(buttonQuality({...button,states:{...states,focusRing:'#ffffff'}},metrics).value).toBe(79)
 })
})

describe('Lisibilité et plafonds du score',()=>{
 const metrics={width:200,height:60,radius:8}
 it.each([[8,25],[10,45],[12,65],[14,90],[16,100]])('pénalise un texte à %i px malgré une grande cible et un bon contraste',(fontSize,expected)=>{
  const result=buttonQuality({...defaultButton(),fontSize},metrics)
  expect(result.value).toBe(expected)
  if(fontSize<16){expect(result.limits.length).toBeGreaterThan(0);expect(result.priorities.join(' ')).toContain('taille du texte')}
 })
 it('empêche la graisse et le padding de compenser un texte trop petit',()=>{
  expect(buttonQuality({...defaultButton(),fontSize:8,fontWeight:900,paddingX:64,paddingY:48},metrics).value).toBe(25)
  const thin=buttonQuality({...defaultButton(),fontSize:16,fontWeight:300},metrics)
  expect(thin.value).toBe(70)
  expect(thin.limits[0].reason).toContain('Texte très fin')
 })
})


describe('Catalogue complet et usages',()=>{
 it('couvre chaque silhouette, ses évocations et ses variantes sans référence orpheline',()=>{
  expect(shapes).toHaveLength(30)
  expect(new Set(shapes.map(shape=>shape.id)).size).toBe(shapes.length)
  for(const shape of shapes){
   expect(shapePaths[shape.id],shape.id).toBeTruthy()
   expect(shapeGroups.some(([id])=>id===shape.group),shape.id).toBe(true)
   expect(shape.variants.length,shape.id).toBeGreaterThan(0)
   expect(shape.associations,shape.id).toHaveLength(3)
   expect(evocations[shape.id],shape.id).toHaveLength(3)
   expect(shape.usages.length,shape.id).toBeGreaterThan(0)
   expect(shape.usages.every(usage=>usageOptions.some(([id])=>id===usage)),shape.id).toBe(true)
  }
 })
 it('donne toujours la priorité à une forme compatible avec l’usage',()=>{
  for(const [usage] of usageOptions)for(const tone of ['accessible','rigoureux','expressif'])for(const sector of ['sante','finance','culture','technologie','education'])for(const audience of ['general','jeune','expert','senior']){
   const recommendation=rankShapes({usage,tone,sector,audience})[0]
   expect(recommendation.shape.usages,`${usage}/${tone}/${sector}/${audience}`).toContain(usage)
   expect(recommendation.reasons.length).toBeGreaterThan(0)
  }
 })
 it('conserve les favoris nouveaux et historiques dans un export',()=>{
  const project={...defaultProject(),favorites:shapes.map(shape=>shape.id),comparison:['line','star'],systems:[preset('line'),preset('star')]}
  const restored=parseProject(JSON.parse(JSON.stringify(project)))
  expect(restored.favorites).toHaveLength(30)
  expect(restored.systems.map(system=>system.family)).toEqual(['line','star'])
 })
 it('crée un bouton régulier à partir des couleurs d’une forme décorative',()=>{
  expect(buttonShapes.map(shape=>shape.id)).toEqual(['square','soft','pill','rectangle'])
  const button=buttonFromSystem({...preset('line'),foreground:'#123456',background:'#abcdef'})
  expect(button.family).toBe('soft')
  expect(button.foreground).toBe('#123456')
  expect(button.background).toBe('#abcdef')
  expect(buttonFromSystem(preset('rectangle')).family).toBe('rectangle')
 })
})
