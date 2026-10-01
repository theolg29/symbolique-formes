export function normalizeHex(value:string):string|null {
  const hex=value.trim().replace(/^#/,'')
  if(!/^(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex))return null
  return '#'+(hex.length===3?hex.split('').map(char=>char+char).join(''):hex).toLowerCase()
}
