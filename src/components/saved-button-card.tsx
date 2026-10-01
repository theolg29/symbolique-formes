import { useState } from 'react'
import { ArrowRight, Copy, Pencil, X } from 'lucide-react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Field, FieldLabel } from './ui/field'
import type { ButtonStyle } from '@/lib/model'

export function SavedButtonCard({style,onEdit,onRemove,onRename,onDuplicate,canDuplicate}:{style:ButtonStyle;onEdit:()=>void;onRemove:()=>void;onRename:(name:string)=>void;onDuplicate:()=>void;canDuplicate:boolean}) {
  const [renameOpen,setRenameOpen]=useState(false)
  const [name,setName]=useState(style.name)
  return <article className="saved-button-card">
    <div className="saved-button-head"><h3>{style.name}</h3><Button variant="remove" size="icon-sm" aria-label={`Supprimer le bouton ${style.name}`} onClick={onRemove}><X/></Button></div>
    <div className="saved-button-art" style={{background:style.design.canvas}}><span className="saved-button-sample" style={{padding:`${style.design.paddingY}px ${style.design.paddingX}px`,fontSize:style.design.fontSize,fontWeight:style.design.fontWeight,borderRadius:style.design.radius,border:`${style.design.borderWidth}px solid ${style.design.borderColor}`,color:style.design.foreground,background:style.design.background}}>{style.design.label || 'Sans libellé'}</span></div>
    <div className="saved-button-tools"><Button variant="ghost" size="sm" aria-label={`Renommer le bouton ${style.name}`} onClick={()=>{setName(style.name);setRenameOpen(true)}}><Pencil/>Renommer</Button><Button variant="ghost" size="sm" disabled={!canDuplicate} aria-label={`Dupliquer le bouton ${style.name}`} onClick={onDuplicate}><Copy/>Dupliquer</Button></div>
    <div className="saved-button-actions"><div className="family-actions"><Button variant="outline" size="sm" aria-label={`Modifier le bouton ${style.name}`} onClick={onEdit}>Modifier le bouton<ArrowRight data-icon="inline-end"/></Button></div></div>
    <Dialog open={renameOpen} onOpenChange={setRenameOpen}><DialogContent><DialogHeader><DialogTitle>Renommer le bouton</DialogTitle><DialogDescription>Ce nom apparaît dans vos Favoris.</DialogDescription></DialogHeader><form className="save-style-form" onSubmit={event=>{event.preventDefault();if(!name.trim())return;onRename(name.trim());setRenameOpen(false)}}><Field><FieldLabel htmlFor={`rename-${style.id}`}>Nom du bouton</FieldLabel><input id={`rename-${style.id}`} maxLength={80} required value={name} onChange={event=>setName(event.target.value)}/></Field><Button type="submit" disabled={!name.trim()}>Renommer</Button></form></DialogContent></Dialog>
  </article>
}
