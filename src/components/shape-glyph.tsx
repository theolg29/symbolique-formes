import { useId } from 'react'
import { cn } from '@/lib/utils'

// One silhouette per catalogue entry, shared by cards, comparisons, wheels and PDF.
export const shapePaths:Record<string,string>={
  square:'M25 15H95V85H25Z',
  rectangle:'M10 25H110V75H10Z',
  soft:'M37 15H83Q95 15 95 27V73Q95 85 83 85H37Q25 85 25 73V27Q25 15 37 15Z',
  pill:'M32 28H88A22 22 0 0 1 88 72H32A22 22 0 0 1 32 28Z',
  circle:'M96 50A36 36 0 1 1 24 50A36 36 0 1 1 96 50Z',
  triangle:'M60 12L103 85H17Z',
  organic:'M59 12C80 8 105 25 100 49S88 86 66 88S20 80 18 57S35 17 59 12Z',
  diamond:'M60 10L104 50L60 90L16 50Z',
  trapezoid:'M35 20H85L107 80H13Z',
  parallelogram:'M35 20H109L85 80H11Z',
  ellipse:'M110 50A50 30 0 1 1 10 50A50 30 0 1 1 110 50Z',
  ring:'M98 50A38 38 0 1 1 22 50A38 38 0 1 1 98 50Z M84 50A24 24 0 1 1 36 50A24 24 0 1 1 84 50Z',
  semicircle:'M18 72A42 42 0 0 1 102 72Z',
  point:'M69 50A9 9 0 1 1 51 50A9 9 0 1 1 69 50Z',
  pentagon:'M60 10L102 40L86 88H34L18 40Z',
  hexagon:'M38 13H82L104 50L82 87H38L16 50Z',
  octagon:'M43 12H77L98 33V67L77 88H43L22 67V33Z',
  line:'M14 50H106',
  diagonal:'M22 80L98 20',
  curve:'M15 75C20 8 100 8 105 75',
  wave:'M8 50C22 15 34 15 48 50S74 85 88 50S106 20 112 50',
  zigzag:'M10 65L30 30L50 65L70 30L90 65L110 30',
  spiral:'M106 48C108 5 21 4 17 48S95 99 95 53S37 22 37 52S77 72 77 52S57 39 57 51',
  arrow:'M12 39H65V18L108 50L65 82V61H12Z',
  chevron:'M40 18L76 50L40 82',
  star:'M60 9L72 36L102 39L80 59L87 89L60 74L33 89L40 59L18 39L48 36Z',
  cross:'M47 12H73V37H98V63H73V88H47V63H22V37H47Z',
  heart:'M60 85C44 70 13 52 20 30C27 9 51 12 60 30C69 12 93 9 100 30C107 52 76 70 60 85Z',
  droplet:'M60 10C52 29 29 45 29 62A31 31 0 0 0 91 62C91 45 68 29 60 10Z',
  leaf:'M20 80C8 32 47 9 101 17C108 62 66 94 20 80Z',
}
const openPaths=new Set(['line','diagonal','curve','wave','zigzag','spiral','chevron'])
export function ShapeGlyph({ family, className }: { family: string; className?: string }) {
  const id=useId()
  const path=shapePaths[family]
  const open=openPaths.has(family)
  return <svg viewBox="0 0 120 100" className={cn('shape-glyph',className)} aria-hidden="true">
    <defs><pattern id={id} width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0 6L6 0" stroke="currentColor" strokeWidth=".5" opacity=".16"/></pattern></defs>
    {!open && <path d={path} fill="currentColor" fillRule="evenodd" opacity={family==='point' ? .7 : .09}/>}
    <path d={path} fill={open ? 'none' : `url(#${id})`} fillRule="evenodd" stroke="currentColor" strokeWidth={open ? 3 : 1.5} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
}
