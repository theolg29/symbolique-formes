import shapesData from '@/data/shapes.json'
import sourcesData from '@/data/sources.json'
import { colord } from 'colord'

export const shapes = shapesData
export const sources = sourcesData
export type Shape = typeof shapes[number]
export type Context = { sector: string; tone: string; audience: string }
export type ShapeSystem = { family: string; radius: number; outer: number; padding: number; height: number; foreground: string; background: string }
export type ButtonDesign = { family:string; label:string; fontSize:number; fontWeight:number; paddingX:number; paddingY:number; radius:number; foreground:string; background:string; canvas:string; borderColor:string; borderWidth:number }
export type ButtonMetrics = { width:number; height:number; radius:number }
export type Project = { button:ButtonDesign; version: 1; name: string; context: Context; systems: [ShapeSystem, ShapeSystem]; favorites: string[]; comparison: string[] }
export const STORAGE_KEY = 'forme-project-v1'
export function preset(id: string): ShapeSystem {
  const shape = shapes.find(s => s.id === id) ?? shapes[1]
  return { family: shape.id, radius: shape.radius, outer: shape.outer, padding: shape.padding, height: 44, foreground: '#ffffff', background: '#3f3f46' }
}
export function defaultProject(): Project {
  return { button:defaultButton(), version: 1, name: 'Mon exploration', context: { sector: 'sante', tone: 'accessible', audience: 'general' }, systems: [preset('soft'), preset('square')], favorites: [], comparison: [] }
}
export function rankShapes(context: Context) {
  return shapes.map(shape => {
    const reasons: string[] = []
    if (shape.tones.includes(context.tone)) reasons.push('ton de marque')
    if (shape.sectors.includes(context.sector)) reasons.push('secteur')
    if (shape.audiences.includes(context.audience)) reasons.push('public')
    const score = (shape.tones.includes(context.tone) ? 3 : 0) + (shape.sectors.includes(context.sector) ? 2 : 0) + (shape.audiences.includes(context.audience) ? 1 : 0)
    return { shape, score, reasons }
  }).sort((a,b) => b.score - a.score)
}
export function contrastRatio(foreground: string, background: string): number {
  const luminance = (hex: string) => {
    const { r, g, b } = colord(hex).toRgb()
    const channel = (v: number) => { const s = v / 255; return s <= .04045 ? s / 12.92 : ((s + .055) / 1.055) ** 2.4 }
    return .2126 * channel(r) + .7152 * channel(g) + .0722 * channel(b)
  }
  const a = luminance(foreground), b = luminance(background)
  return (Math.max(a,b) + .05) / (Math.min(a,b) + .05)
}
export function audit(system: ShapeSystem) {
  const expected = Math.max(0, system.outer - system.padding)
  const ratio = contrastRatio(system.foreground, system.background)
  const regular = ['square','soft'].includes(system.family)
  return {
    expected, ratio,
    nested: regular ? Math.abs(system.radius - expected) <= 1 : null,
    proportions: system.padding * 2 <= system.height,
    target: system.height >= 24,
    comfortable: system.height >= 44,
    contrast: ratio >= 4.5,
    boundary: contrastRatio(system.background, '#ffffff') >= 3,
    radiusClamped: system.radius > system.height / 2,
  }
}
export function defaultButton(family='soft'): ButtonDesign {
  return {family,label:'Continuer',fontSize:14,fontWeight:650,paddingX:20,paddingY:14,radius:['pill','circle'].includes(family) ? 96 : preset(family).radius,foreground:'#ffffff',background:'#18181b',canvas:'#ffffff',borderColor:'#18181b',borderWidth:0}
}
export function buttonFromSystem(system:ShapeSystem): ButtonDesign {
  return {...defaultButton(system.family),radius:['pill','circle'].includes(system.family) ? 96 : system.radius,paddingX:system.padding,paddingY:Math.max(0,(system.height-14*1.4)/2),foreground:system.foreground,background:system.background}
}
function containsSquare(metrics:ButtonMetrics,size:number) {
  const {width,height}=metrics
  if(width<size || height<size) return false
  const radius=Math.min(metrics.radius,width/2,height/2)
  const dx=Math.max(0,radius-(width-size)/2),dy=Math.max(0,radius-(height-size)/2)
  return dx*dx+dy*dy<=radius*radius+0.00001
}
export function auditButton(button:ButtonDesign,metrics:ButtonMetrics) {
  const ratio=contrastRatio(button.foreground,button.background)
  const large=button.fontSize>=24 || (button.fontSize>=14*96/72 && button.fontWeight>=700)
  const threshold=large ? 3 : 4.5
  const fillRatio=contrastRatio(button.background,button.canvas)
  const borderRatio=button.borderWidth>0 ? contrastRatio(button.borderColor,button.canvas) : 0
  const boundaryRatio=Math.max(fillRatio,borderRatio)
  return {ratio,threshold,large,contrast:ratio>=threshold,boundaryRatio,boundary:boundaryRatio>=3,target:containsSquare(metrics,24),comfortable:containsSquare(metrics,44),label:button.label.trim().length>0}
}
const sectors = ['sante','finance','culture','technologie','education']
const tones = ['accessible','rigoureux','expressif']
const audiences = ['general','jeune','expert','senior']
export function parseProject(value: unknown): Project {
  if (!value || typeof value !== 'object') throw new Error('Le fichier ne contient pas un projet Forme.')
  const p = value as Project
  const validNumber = (v: unknown, min: number, max: number) => typeof v === 'number' && Number.isFinite(v) && v >= min && v <= max
  const validSystem = (s: ShapeSystem) => s && shapes.some(f => f.id === s.family) && validNumber(s.radius,0,64) && validNumber(s.outer,0,64) && validNumber(s.padding,0,32) && validNumber(s.height,16,64) && /^#[0-9a-f]{6}$/i.test(s.foreground) && /^#[0-9a-f]{6}$/i.test(s.background)
  if (p.version !== 1 || typeof p.name !== 'string' || p.name.length > 100 || !p.context || !sectors.includes(p.context.sector) || !tones.includes(p.context.tone) || !audiences.includes(p.context.audience) || !Array.isArray(p.systems) || p.systems.length !== 2 || !p.systems.every(validSystem) || !Array.isArray(p.favorites) || !p.favorites.every(id => typeof id === 'string' && shapes.some(s => s.id === id))) throw new Error('Projet invalide : vérifiez la version, les familles et les valeurs.')
  const comparison = p.comparison ?? [...new Set(p.systems.map(s=>s.family))]
  if (!Array.isArray(comparison) || comparison.length>2 || new Set(comparison).size!==comparison.length || !comparison.every((id,i)=>typeof id==='string' && shapes.some(s=>s.id===id) && p.systems[i].family===id)) throw new Error('Sélection de comparaison invalide.')
  const button=p.button ?? defaultButton(p.systems[0].family)
  const color=(v:unknown)=>typeof v==='string' && /^#[0-9a-f]{6}$/i.test(v)
  if(!button || !shapes.some(shape=>shape.id===button.family) || typeof button.label!=='string' || button.label.length>120 || !validNumber(button.fontSize,8,48) || !validNumber(button.fontWeight,300,900) || !validNumber(button.paddingX,0,64) || !validNumber(button.paddingY,0,48) || !validNumber(button.radius,0,96) || !validNumber(button.borderWidth,0,8) || ![button.foreground,button.background,button.canvas,button.borderColor].every(color)) throw new Error('Bouton invalide : vérifiez le texte, les dimensions et les couleurs.')
  return { button:{...button}, version: 1, comparison, name: p.name, context: { ...p.context }, systems: p.systems.map(s => ({ ...s })) as Project['systems'], favorites: [...new Set(p.favorites)] }
}
export function loadProject(): Project {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? parseProject(JSON.parse(stored)) : defaultProject()
  } catch { return defaultProject() }
}
