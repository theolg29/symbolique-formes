import { describe, expect, it } from 'vitest'
import { normalizeHex } from './color'

describe('Saisie des couleurs',()=>{
 it.each([[' #ABC ','#aabbcc'],['abc','#aabbcc'],['8b5cf6','#8b5cf6'],['#FFFFFF','#ffffff'],['000000','#000000']])('normalise %s',(value,expected)=>expect(normalizeHex(value)).toBe(expected))
 it.each(['','#ff','##abcdef','#xyzxyz','#1234567','red','rgba(0,0,0,1)'])('refuse une couleur invalide %s',value=>expect(normalizeHex(value)).toBeNull())
})
