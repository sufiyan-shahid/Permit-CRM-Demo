import React, { useState } from 'react'
import { usePermitStore } from './store'
import { CheckCircle, Clock, XCircle, AlertCircle, FileText, User, Calendar, Truck, Package, Users, ArrowRight, Edit } from 'lucide-react'

export default function StatusTracker() {
  const { currentUser, currentUserRole, permits, contractors, updatePermitStage, addResubmission } = usePermitStore()
  const [selectedPermit, setSelectedPermit] = useState<string | null>(null)
  const [showResubmissionForm, setShowResubmissionForm] = useState(false)

  const userPermits = permits.filter(p => p.contractorId === currentUser)
  const selectedPermitData = permits.find(p => p.id === selectedPermit)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'returned': return <XCircle className="h-5 w-5 text-red-600" />
      case 'stage6': return <AlertCircle className="h-5 w-5 text-blue-600" />
      default: return <Clock className="h-5 w-5 text-amber-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200'
      case 'returned': return 'bg-red-100 text-red-800 border-red-200'
      case 'stage6': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-amber-100 text-amber-800 border-amber-200'
    }
  }

  const getStageLabel = (stage: number) => {
    if (stage === 1) return 'Stage 1'
    if (stage === 2) return 'Stage 2'
    if (stage === 3) return 'Stage 3'
    if (stage === 4) return 'Stage 4'
    if (stage === 5) return 'Stage 5'
    if (stage === 6) return 'Stage 6'
    return `Stage ${stage}`
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">My Permit Applications</h2>
        <p className="text-slate-600">Track the status of your submitted permit applications</p>
      </div>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {userPermits.map((permit) => (
          <div
            key={permit.id}
            className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all cursor-pointer"
            onClick={() => setSelectedPermit(permit.id)}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">{permit.id}</h3>
                  <p className="text-sm text-slate-600">Vehicle: {permit.vehicleInfo}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(permit.status)}`}>
                  {permit.status === 'submitted' && 'Submitted'}
                  {permit.status === 'stage1' && 'Stage 1'}
                  {permit.status === 'stage2' && 'Stage 2'}
                  {permit.status === 'stage3' && 'Stage 3'}
                  {permit.status === 'stage4' && 'Stage 4'}
                  {permit.status === 'stage5' && 'Stage 5'}
                  {permit.status === 'stage6' && 'Stage 6'}
                  {permit.status === 'approved' && 'Approved'}
                  {permit.status === 'returned' && 'Returned'}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-slate-600">
                  <User className="h-4 w-4 mr-2" />
                  {permit.driverInfo?.name}
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(permit.requestedStartDate!).toLocaleDateString()} - {new Date(permit.requestedEndDate!).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Package className="h-4 w-4 mr-2" />
                  {permit.materials.length} materials
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Submitted {new Date(permit.submittedAt).toLocaleDateString()}</span>
                    {getStatusIcon(permit.status)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No applications message */}
      {userPermits.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Applications Yet</h3>
          <p className="text-slate-600 mb-6">You haven't submitted any permit applications yet.</p>
          <button className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
            Submit Your First Application
          </button>
        </div>
      )}

      {/* Selected Permit Details */}
      {selectedPermit && selectedPermitData && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">{selectedPermitData.id} - Application Details</h3>
              <p className="text-sm text-slate-600">Contractor: {selectedPermitData.contractorName}</p>
            </div>
            <button
              onClick={() => setSelectedPermit(null)}
              className="text-slate-600 hover:text-slate-900"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Application Timeline</h4>
              <div className="space-y-3">
                {selectedPermitData.history.map((entry) => (
                  <div key={entry.id} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                      {entry.action === 'submitted' && <FileText className="h-4 w-4 text-slate-600" />}
                      {entry.action === 'approved' && <CheckCircle className="h-4 w-4 text-green-600" />}
                      {entry.action === 'returned' && <XCircle className="h-4 w-4 text-red-600" />}
                      {entry.action === 'resubmitted' && <ArrowRight className="h-4 w-4 text-blue-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm text-slate-900">
                        {entry.status === 'submitted' && 'Submitted'}
                        {entry.status === 'stage1' && 'Stage 1 Review'}
                        {entry.status === 'stage2' && 'Stage 2 Review'}
                        {entry.status === 'stage3' && 'Stage 3 Review'}
                        {entry.status === 'stage4' && 'Stage 4 Review'}
                        {entry.status === 'stage5' && 'Stage 5 Review'}
                        {entry.status === 'stage6' && 'Stage 6 Review'}
                        {entry.status === 'approved' && 'Approved'}
                        {entry.status === 'returned' && 'Returned'}
                      </div>
                      <div className="text-xs text-slate-600 mt-1">
                        {new Date(entry.timestamp).toLocaleString()} • {entry.reviewerName}
                      </div>
                      {entry.comments && (
                        <div className="text-xs text-slate-700 mt-1 p-2 bg-slate-50 rounded">
                          <strong>Comment:</strong> {entry.comments}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Current Status</h4>
              {selectedPermitData.status === 'returned' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <h5 className="font-medium text-red-900 mb-2">Return Details</h5>
                  <p className="text-sm text-red-800 mb-2">Reason: {selectedPermitData.returnReason}</p>
                  <p className="text-sm text-red-800">Comments: {selectedPermitData.rejectionComments}</p>
                  <button
                    onClick={() => setShowResubmissionForm(true)}
                    className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    <Edit className="h-4 w-4 inline mr-1" />
                    Resubmit with Corrections
                  </button>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
                  <span className="text-sm text-slate-600">Current Stage:</span>
                  <span className="font-medium text-teal-600">{getStageLabel(selectedPermitData.currentStage)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
                  <span className="text-sm text-slate-600">Materials:</span>
                  <span className="font-medium">{selectedPermitData.materials.length} items</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
                  <span className="text-sm text-slate-600">Documents:</span>
                  <span className="font-medium">{selectedPermitData.documents.length} uploaded</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resubmission Form */}
      {showResubmissionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Resubmit Application</h2>
            <p className="text-slate-600 mb-6">Update the fields that were flagged in the return comments and resubmit.</p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Comments from Reviewer</label>
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{selectedPermitData?.rejectionComments}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Corrections Made</label>
                <textarea
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  rows={4}
                  placeholder="Describe the corrections you've made..."
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowResubmissionForm(false)}
                  className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Submit resubmission
                    setShowResubmissionForm(false)
                    setSelectedPermit(null)
                  }}
                  className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Submit Resubmission
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
