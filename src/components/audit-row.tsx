import { Check, Ellipsis, X } from 'lucide-react'
import { cn } from '@/lib/utils'
export function AuditRow({ good, title, detail }: { good: boolean | null; title: string; detail: string }) {
  const label = good===null ? 'À évaluer manuellement' : good ? 'Contrôle vérifié' : 'À ajuster'
  const Icon = good===true ? Check : good===false ? X : Ellipsis
  return <div className={cn('audit-row',good===true ? 'audit-success' : good===false ? 'audit-warning' : 'audit-manual')}><span className="audit-status" role="img" aria-label={label} title={label}><Icon aria-hidden="true"/></span><div><strong>{title}</strong><p>{detail}</p></div></div>
}
