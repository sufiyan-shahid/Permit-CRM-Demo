import React, { useState } from 'react'
import { usePermitStore } from './store'
import { UserRole } from './types'
import { CheckCircle, XCircle, FileText, User, Calendar, Package, Users, Truck, ArrowRight, AlertCircle, Clock } from 'lucide-react'

interface ReviewerQueueProps {
  reviewerRole: UserRole
}

const STAGE_ROLE_MAP: Record<number, UserRole> = {
  1: 'fmco',
  2: 'pmc',
  3: 'fifty-investments',
  4: 'cp-fa',
}

const ROLE_LABELS: Record<UserRole, string> = {
  contractor: 'Contractor',
  fmco: 'FMCO Reviewer',
  pmc: 'PMC Reviewer',
  'fifty-investments': 'Fifty Investments',
  'cp-fa': 'CPPA',
}

const STAGE_LABELS = ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4', 'Stage 5', 'Stage 6']

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved': return 'bg-green-100 text-green-800 border-green-200'
    case 'returned': return 'bg-red-100 text-red-800 border-red-200'
    case 'stage6': return 'bg-blue-100 text-blue-800 border-blue-200'
    default: return 'bg-amber-100 text-amber-800 border-amber-200'
  }
}

const getStatusLabel = (status: string, stage: number) => {
  if (status === 'approved') return 'Approved'
  if (status === 'returned') return 'Returned'
  if (status === 'stage6') return 'Stage 6'
  if (status === 'submitted') return 'Submitted'
  return STAGE_LABELS[stage - 1] || `Stage ${stage}`
}

export default function ReviewerQueue({ reviewerRole }: ReviewerQueueProps) {
  const { permits, updatePermitStage, currentUser } = usePermitStore()
  const [selectedPermitId, setSelectedPermitId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [returnComment, setReturnComment] = useState('')
  const [showReturnBox, setShowReturnBox] = useState(false)

  const queuedPermits = permits.filter((p) => {
    if (p.status === 'approved' || p.status === 'returned') return false
    if (STAGE_ROLE_MAP[p.currentStage] !== reviewerRole) return false
    if (statusFilter !== 'all' && p.status !== statusFilter) return false
    return true
  })

  const selectedPermit = permits.find((p) => p.id === selectedPermitId)

  const handleApprove = (permitId: string) => {
    updatePermitStage(permitId, 'approved', 'REV-001', 'Demo Reviewer', reviewerRole, 'Approved and forwarded to next stage.')
    setSelectedPermitId(null)
  }

  const handleReturn = (permitId: string) => {
    if (!returnComment.trim()) return
    updatePermitStage(permitId, 'returned', 'REV-001', 'Demo Reviewer', reviewerRole, returnComment, 'reviewer_return')
    setReturnComment('')
    setShowReturnBox(false)
    setSelectedPermitId(null)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Review Queue — {ROLE_LABELS[reviewerRole]}
        </h2>
        <p className="text-slate-600">
          {queuedPermits.length} application(s) awaiting {ROLE_LABELS[reviewerRole]} action
        </p>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <span className="text-sm text-slate-600">Filter:</span>
        {['all', 'submitted', 'stage1', 'stage2', 'stage3', 'stage4', 'stage5'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1 rounded-full text-sm border transition-colors ${
              statusFilter === s
                ? 'bg-teal-600 text-white border-teal-600'
                : 'bg-white text-slate-700 border-slate-200 hover:border-teal-300'
            }`}
          >
            {s === 'all' ? 'All' : getStatusLabel(s, Number(s.replace('stage', '')) || 1)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Permit ID</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Contractor</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Type</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Stage</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Submitted</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {queuedPermits.map((permit) => (
              <tr
                key={permit.id}
                className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => setSelectedPermitId(permit.id)}
              >
                <td className="px-6 py-4 font-medium text-slate-900">{permit.id}</td>
                <td className="px-6 py-4 text-slate-700">{permit.contractorName}</td>
                <td className="px-6 py-4">
                  <span className="capitalize text-slate-700">{permit.permitType}</span>
                  {permit.permitSubtype && (
                    <span className="ml-1 text-xs text-slate-500">({permit.permitSubtype})</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(permit.status)}`}>
                    {getStatusLabel(permit.status, permit.currentStage)}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600">{new Date(permit.submittedAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <span className="text-teal-600 text-sm font-medium flex items-center">
                    Review <ArrowRight className="h-4 w-4 ml-1" />
                  </span>
                </td>
              </tr>
            ))}
            {queuedPermits.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  No applications awaiting {ROLE_LABELS[reviewerRole]} review.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedPermit && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm mt-8">
          <div className="flex justify-between items-start p-6 border-b border-slate-200">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-1">
                {selectedPermit.id} — Application Details
              </h3>
              <p className="text-sm text-slate-600">
                {selectedPermit.contractorName} • {selectedPermit.permitType} {selectedPermit.permitSubtype || ''}
              </p>
            </div>
            <button onClick={() => setSelectedPermitId(null)} className="text-slate-500 hover:text-slate-900">
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center text-sm text-slate-600 mb-1">
                    <Truck className="h-4 w-4 mr-2" /> Vehicle
                  </div>
                  <p className="font-medium text-slate-900">{selectedPermit.vehicleInfo || '—'}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center text-sm text-slate-600 mb-1">
                    <User className="h-4 w-4 mr-2" /> Driver
                  </div>
                  <p className="font-medium text-slate-900">{selectedPermit.driverInfo?.name || '—'}</p>
                  {selectedPermit.driverInfo && (
                    <p className="text-xs text-slate-500 mt-1">
                      {selectedPermit.driverInfo.employer} • Iqama {selectedPermit.driverInfo.iqamaNumber}
                    </p>
                  )}
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center text-sm text-slate-600 mb-1">
                    <Calendar className="h-4 w-4 mr-2" /> Dates
                  </div>
                  <p className="font-medium text-slate-900">
                    {new Date(selectedPermit.requestedStartDate!).toLocaleDateString()} →{' '}
                    {new Date(selectedPermit.requestedEndDate!).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center text-sm text-slate-600 mb-1">
                    <Package className="h-4 w-4 mr-2" /> Materials
                  </div>
                  <p className="font-medium text-slate-900">{selectedPermit.materials.length} items</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {selectedPermit.equipment.length} equipment, {selectedPermit.passengers.length} passengers
                  </p>
                </div>
              </div>

              {selectedPermit.materials.length > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Materials</h4>
                  <div className="space-y-2">
                    {selectedPermit.materials.map((m) => (
                      <div key={m.id} className="flex justify-between p-3 bg-slate-50 rounded-lg text-sm">
                        <span className="text-slate-800">{m.description}</span>
                        <span className="text-slate-500">
                          {m.quantity} {m.unit} • {m.weight} kg
                          {m.destination ? ` → ${m.destination}` : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Documents ({selectedPermit.documents.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPermit.documents.map((d) => (
                    <span key={d.id} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm">
                      <FileText className="h-4 w-4 inline mr-1" />
                      {d.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
                <button
                  onClick={() => handleApprove(selectedPermit.id)}
                  className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Approve & Forward
                </button>
                <button
                  onClick={() => setShowReturnBox(true)}
                  className="px-6 py-3 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors flex items-center"
                >
                  <XCircle className="h-5 w-5 mr-2" />
                  Return with Comment
                </button>
              </div>

              {showReturnBox && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <label className="block text-sm font-medium text-red-900 mb-2">
                    Comment for the contractor
                  </label>
                  <textarea
                    value={returnComment}
                    onChange={(e) => setReturnComment(e.target.value)}
                    rows={3}
                    placeholder="Explain what needs to be corrected..."
                    className="w-full p-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent"
                  />
                  <div className="flex justify-end gap-3 mt-3">
                    <button
                      onClick={() => { setShowReturnBox(false); setReturnComment('') }}
                      className="px-4 py-2 text-red-700 hover:bg-red-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleReturn(selectedPermit.id)}
                      disabled={!returnComment.trim()}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                      Confirm Return
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-4 flex items-center">
                <Clock className="h-4 w-4 mr-2" /> Case Timeline
              </h4>
              <div className="space-y-4">
                {selectedPermit.history.map((entry) => (
                  <div key={entry.id} className="relative pl-6">
                    <div className="absolute left-0 top-1 w-3 h-3 rounded-full bg-teal-500" />
                    <div className="text-sm font-medium text-slate-900">
                      {getStatusLabel(entry.status, entry.stage)}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {new Date(entry.timestamp).toLocaleString()}
                    </div>
                    {entry.reviewerName && (
                      <div className="text-xs text-slate-600">{entry.reviewerName}</div>
                    )}
                    {entry.comments && (
                      <div className="text-xs text-slate-700 mt-1 p-2 bg-white rounded border border-slate-200">
                        {entry.comments}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
