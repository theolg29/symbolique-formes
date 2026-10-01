import { useId } from 'react'
import { cn } from '@/lib/utils'
export function ShapeGlyph({ family, className }: { family: string; className?: string }) {
  const id = useId()
  return <svg viewBox="0 0 120 100" className={cn('shape-glyph',className)} aria-hidden="true">
    <defs><pattern id={id} width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0 6L6 0" stroke="currentColor" strokeWidth=".5" opacity=".16"/></pattern></defs>
    <g fill="currentColor" opacity=".09">
      {family === 'square' && <rect x="25" y="15" width="70" height="70"/>}
      {family === 'soft' && <rect x="25" y="15" width="70" height="70" rx="12"/>}
      {family === 'pill' && <rect x="10" y="28" width="100" height="44" rx="22"/>}
      {family === 'circle' && <circle cx="60" cy="50" r="36"/>}
      {family === 'triangle' && <path d="M60 12L103 85H17Z"/>}
      {family === 'organic' && <path d="M59 12C80 8 105 25 100 49S88 86 66 88S20 80 18 57S35 17 59 12Z"/>}
    </g>
    <g fill={`url(#${id})`} stroke="currentColor" strokeWidth="1.5">
      {family === 'square' && <rect x="25" y="15" width="70" height="70"/>}
      {family === 'soft' && <rect x="25" y="15" width="70" height="70" rx="12"/>}
      {family === 'pill' && <rect x="10" y="28" width="100" height="44" rx="22"/>}
      {family === 'circle' && <circle cx="60" cy="50" r="36"/>}
      {family === 'triangle' && <path d="M60 12L103 85H17Z"/>}
      {family === 'organic' && <path d="M59 12C80 8 105 25 100 49S88 86 66 88S20 80 18 57S35 17 59 12Z"/>}
    </g>
  </svg>
}
