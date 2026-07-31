import React, { useState } from 'react'
import LandingPage from './LandingPage'
import PermitWizard from './PermitWizard'
import StatusTracker from './StatusTracker'
import ReviewerQueue from './ReviewerQueue'
import Dashboard from './Dashboard'
import { usePermitStore } from './store'
import { UserRole } from './types'

export default function App() {
  const { currentUser, currentUserRole, isRoleSwitcherOpen, toggleRoleSwitcher } = usePermitStore()
  const [showPermitWizard, setShowPermitWizard] = useState(false)

  const getRoleDisplayName = (role: UserRole | null): string => {
    const roleNames = {
      contractor: 'Contractor',
      fmco: 'FMCO Reviewer',
      pmc: 'PMC Reviewer',
      'fifty-investments': 'Fifty Investments',
      'cp-fa': 'CPPA',
    }
    return roleNames[role || 'contractor']
  }

  const renderContent = () => {
    if (!currentUser) {
      return <LandingPage />
    }

    switch (currentUser) {
      case 'contractor':
        return showPermitWizard ? (
          <div className="min-h-screen bg-slate-50">
            <header className="bg-white shadow-sm border-b border-slate-200 px-6 py-4">
              <div className="max-w-6xl mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">Contractor Permit System</h1>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-600">Welcome, Contractor</span>
                  <button
                    onClick={() => setShowPermitWizard(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    View My Applications
                  </button>
                </div>
              </div>
            </header>
            <main className="max-w-6xl mx-auto p-6">
              <PermitWizard />
            </main>
          </div>
        ) : (
          <StatusTracker />
        )
      case 'fmco':
      case 'pmc':
      case 'fifty-investments':
      case 'cp-fa':
        return (
          <div className="min-h-screen bg-slate-50">
            <header className="bg-white shadow-sm border-b border-slate-200 px-6 py-4">
              <div className="max-w-6xl mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">
                  {getRoleDisplayName(currentUser)} - Permit Review System
                </h1>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-600">
                    Logged in as {getRoleDisplayName(currentUser)}
                  </span>
                  <button
                    onClick={() => setShowPermitWizard(true)}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    Submit Application
                  </button>
                </div>
              </div>
            </header>
            <main className="max-w-6xl mx-auto p-6">
              <ReviewerQueue reviewerRole={currentUser} />
            </main>
          </div>
        )
      default:
        return <LandingPage />
    }
  }

  return (
    <div>
      {renderContent()}

      {isRoleSwitcherOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Switch Role</h2>
            <p className="text-slate-600 mb-6">Select a role to continue with the application:</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  usePermitStore.setState({ currentUser: 'contractor', currentUserRole: 'contractor' })
                  toggleRoleSwitcher()
                }}
                className="p-4 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="font-medium">Contractor</div>
                <div className="text-sm text-slate-600">Submit and track permits</div>
              </button>
              <button
                onClick={() => {
                  usePermitStore.setState({ currentUser: 'fmco', currentUserRole: 'fmco' })
                  toggleRoleSwitcher()
                }}
                className="p-4 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="font-medium">FMCO Reviewer</div>
                <div className="text-sm text-slate-600">Review and approve</div>
              </button>
              <button
                onClick={() => {
                  usePermitStore.setState({ currentUser: 'pmc', currentUserRole: 'pmc' })
                  toggleRoleSwitcher()
                }}
                className="p-4 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="font-medium">PMC Reviewer</div>
                <div className="text-sm text-slate-600">PMC approval workflow</div>
              </button>
              <button
                onClick={() => {
                  usePermitStore.setState({ currentUser: 'fifty-investments', currentUserRole: 'fifty-investments' })
                  toggleRoleSwitcher()
                }}
                className="p-4 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="font-medium">Fifty Investments</div>
                <div className="text-sm text-slate-600">Review PMC packages</div>
              </button>
              <button
                onClick={() => {
                  usePermitStore.setState({ currentUser: 'cp-fa', currentUserRole: 'cp-fa' })
                  toggleRoleSwitcher()
                }}
                className="p-4 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="font-medium">CPPA</div>
                <div className="text-sm text-slate-600">Final verification</div>
              </button>
            </div>
            <button
              onClick={toggleRoleSwitcher}
              className="mt-6 w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
