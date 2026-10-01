import type { ButtonDesign } from './model'

// Consecutive changes from the same control belong to one edit until blur/pointerup.
export class ButtonHistory {
  past:ButtonDesign[]=[]
  future:ButtonDesign[]=[]
  private group:string|null=null
  record(previous:ButtonDesign,next:ButtonDesign,group:string) {
    if(JSON.stringify(previous)===JSON.stringify(next)) return
    if(this.group!==group) this.past=[...this.past.slice(-49),structuredClone(previous)]
    this.group=group
    this.future=[]
  }
  end(){this.group=null}
  undo(current:ButtonDesign){this.end();const next=this.past.pop();if(next)this.future.push(structuredClone(current));return next}
  redo(current:ButtonDesign){this.end();const next=this.future.pop();if(next)this.past.push(structuredClone(current));return next}
  clear(){this.past=[];this.future=[];this.end()}
}
