import { useLayoutEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'

export function ScrollHint() {
  const hint=useRef<HTMLDivElement>(null)
  const [scroll,setScroll]=useState({overflow:false,more:false})
  useLayoutEffect(()=>{
    const element=hint.current?.parentElement
    if(!element)return
    const measure=()=>{
      const overflow=['auto','scroll'].includes(getComputedStyle(element).overflowY) && element.scrollHeight>element.clientHeight+2
      const more=overflow && element.scrollTop+element.clientHeight<element.scrollHeight-3
      setScroll(previous=>previous.overflow===overflow && previous.more===more ? previous : {overflow,more})
    }
    const resize=new ResizeObserver(measure)
    resize.observe(element)
    const mutations=new MutationObserver(measure)
    mutations.observe(element,{childList:true,subtree:true,characterData:true})
    element.addEventListener('scroll',measure,{passive:true})
    window.addEventListener('resize',measure)
    measure()
    return()=>{resize.disconnect();mutations.disconnect();element.removeEventListener('scroll',measure);window.removeEventListener('resize',measure)}
  },[])
  return <div ref={hint} className="scroll-hint" data-overflow={scroll.overflow} data-more={scroll.more} aria-hidden="true"><ChevronDown size={14}/><span>Faites défiler pour voir la suite</span></div>
}
