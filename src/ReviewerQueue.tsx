import { useMemo, useState } from 'react'
import { CheckCircle, Clock3, FileText, RotateCcw, Search } from 'lucide-react'
import { usePermitStore } from './store'
import { Permit, UserRole } from './types'

interface ReviewerQueueProps {
  reviewerRole: Exclude<UserRole, 'contractor'>
}

const roleStages: Record<ReviewerQueueProps['reviewerRole'], number[]> = {
  fmco: [1],
  pmc: [2],
  'fifty-investments': [3],
  'cp-fa': [4, 5, 6],
}

const roleNames: Record<ReviewerQueueProps['reviewerRole'], string> = {
  fmco: 'FMCO',
  pmc: 'PMC',
  'fifty-investments': 'Fifty Investments',
  'cp-fa': 'CPPA',
}

export default function ReviewerQueue({ reviewerRole }: ReviewerQueueProps) {
  const { permits, updatePermitStage } = usePermitStore()
  const [query, setQuery] = useState('')
  const [selectedPermit, setSelectedPermit] = useState<Permit | null>(null)
  const [comments, setComments] = useState('')
  const [returnReason, setReturnReason] = useState('')

  const queue = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return permits.filter((permit) => {
      const isAtReviewerStage = roleStages[reviewerRole].includes(permit.currentStage)
      const isActionable = permit.status !== 'approved' && permit.status !== 'returned'
      const matchesQuery = !normalizedQuery || [permit.id, permit.contractorName, permit.permitType]
        .some((value) => value.toLowerCase().includes(normalizedQuery))

      return isAtReviewerStage && isActionable && matchesQuery
    })
  }, [permits, query, reviewerRole])

  const submitDecision = (action: 'approved' | 'returned') => {
    if (!selectedPermit || (action === 'returned' && !returnReason.trim())) return

    updatePermitStage(
      selectedPermit.id,
      action,
      `${reviewerRole}-reviewer`,
      `${roleNames[reviewerRole]} Reviewer`,
      reviewerRole,
      comments.trim() || undefined,
      action === 'returned' ? returnReason.trim() : undefined,
    )
    setSelectedPermit(null)
    setComments('')
    setReturnReason('')
  }

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-2xl bg-slate-900 text-white shadow-xl">
        <div className="grid gap-6 px-7 py-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-teal-300">Review workspace</p>
            <h2 className="text-3xl font-bold tracking-tight">{roleNames[reviewerRole]} permit queue</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Inspect submitted documents, record a decision, and move complete applications to the next review stage.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-right">
            <div className="text-3xl font-bold text-teal-300">{queue.length}</div>
            <div className="text-xs uppercase tracking-wider text-slate-400">Awaiting action</div>
          </div>
        </div>
      </div>

      <div className="relative max-w-xl">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search permit ID, contractor, or type"
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm shadow-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
        />
      </div>

      {queue.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <CheckCircle className="mx-auto h-10 w-10 text-teal-600" />
          <h3 className="mt-4 text-lg font-semibold text-slate-900">Queue is clear</h3>
          <p className="mt-1 text-sm text-slate-500">No permits currently require this review stage.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {queue.map((permit) => (
            <article key={permit.id} className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:grid-cols-[1fr_auto] md:items-center">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-slate-900">{permit.id}</h3>
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">Stage {permit.currentStage}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{permit.contractorName}</p>
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                    <span className="capitalize">{permit.permitType} permit</span>
                    <span>{permit.documents.length} documents</span>
                    <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" /> Submitted {new Date(permit.submittedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedPermit(permit)}
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-100"
              >
                Review application
              </button>
            </article>
          ))}
        </div>
      )}

      {selectedPermit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="border-b border-slate-200 px-6 py-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-700">Decision record</p>
              <h3 className="mt-1 text-2xl font-bold text-slate-900">{selectedPermit.id}</h3>
              <p className="mt-1 text-sm text-slate-500">{selectedPermit.contractorName} · {selectedPermit.documents.length} supporting documents</p>
            </div>
            <div className="space-y-5 p-6">
              <div className="grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-3">
                <div><div className="text-xs text-slate-500">Permit type</div><div className="mt-1 font-medium capitalize">{selectedPermit.permitType}</div></div>
                <div><div className="text-xs text-slate-500">Materials</div><div className="mt-1 font-medium">{selectedPermit.materials.length}</div></div>
                <div><div className="text-xs text-slate-500">Current stage</div><div className="mt-1 font-medium">Stage {selectedPermit.currentStage}</div></div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Review comments</label>
                <textarea value={comments} onChange={(event) => setComments(event.target.value)} rows={4} className="w-full rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100" placeholder="Add notes for the audit trail" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Return reason</label>
                <input value={returnReason} onChange={(event) => setReturnReason(event.target.value)} className="w-full rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100" placeholder="Required only when returning an application" />
              </div>
              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                <button onClick={() => setSelectedPermit(null)} className="rounded-xl px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
                <button onClick={() => submitDecision('returned')} disabled={!returnReason.trim()} className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"><RotateCcw className="h-4 w-4" /> Return</button>
                <button onClick={() => submitDecision('approved')} className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"><CheckCircle className="h-4 w-4" /> Approve</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
