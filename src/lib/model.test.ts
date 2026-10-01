import { describe, expect, it } from 'vitest'
import { audit, auditButton, defaultButton, contrastRatio, defaultProject, parseProject, preset, rankShapes, shapes, sources } from './model'
describe('Recommandations',()=>{
  it('adapte la première piste au contexte sans retirer de familles',()=>{
    expect(rankShapes({sector:'sante',tone:'accessible',audience:'general'})[0].shape.id).toBe('soft')
    expect(rankShapes({sector:'finance',tone:'rigoureux',audience:'expert'})[0].shape.id).toBe('square')
    expect(rankShapes({sector:'culture',tone:'expressif',audience:'jeune'})[0].shape.id).toBe('triangle')
    expect(rankShapes(defaultProject().context)).toHaveLength(6)
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
