import { describe, expect, it } from 'vitest'
import { ButtonHistory } from './button-history'
import { defaultButton } from './model'

describe('Historique du bouton',()=>{
 it('regroupe une interaction et rétablit toute sa valeur précédente',()=>{
  const history=new ButtonHistory(), initial=defaultButton()
  const intermediate={...initial,paddingX:21},final={...initial,paddingX:32}
  history.record(initial,intermediate,'paddingX')
  history.record(intermediate,final,'paddingX')
  expect(history.past).toHaveLength(1)
  expect(history.undo(final)).toEqual(initial)
  expect(history.redo(initial)).toEqual(final)
  history.end()
  history.record(final,{...final,paddingX:40},'paddingX')
  expect(history.past).toHaveLength(2)
 })
 it('supprime la branche rétablie après une nouvelle modification et limite les snapshots',()=>{
  const history=new ButtonHistory(), initial=defaultButton(),next={...initial,radius:20}
  history.record(initial,next,'radius')
  history.undo(next)
  history.record(initial,{...initial,radius:40},'radius')
  expect(history.redo(initial)).toBeUndefined()
  for(let n=0;n<100;n++){history.end();history.record({...initial,paddingX:n},{...initial,paddingX:n+1},'paddingX')}
  expect(history.past).toHaveLength(50)
  history.clear()
  expect(history.undo(initial)).toBeUndefined()
 })
})
