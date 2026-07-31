"use client"

import { usePermitStore } from '@/store'
import { UserRole } from '@/types'
import { Building2, CheckCircle, Users, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  const { setCurrentUser, toggleRoleSwitcher } = usePermitStore()

  const roles: { role: UserRole; label: string; description: string; icon: React.ComponentType<{ className?: string }> }[] = [
    {
      role: 'contractor',
      label: 'Contractor',
      description: 'Submit permit applications and track status',
      icon: Building2,
    },
    {
      role: 'fmco',
      label: 'FMCO Reviewer',
      description: 'Review and approve permit applications',
      icon: Users,
    },
    {
      role: 'pmc',
      label: 'PMC Reviewer',
      description: 'PMC approval and rejection with comments',
      icon: CheckCircle,
    },
    {
      role: 'fifty-investments',
      label: 'Fifty Investments',
      description: 'Review PMC-approved packages',
      icon: ArrowRight,
    },
    {
      role: 'cp-fa',
      label: 'CPPA',
      description: 'Verify records and forward for final check',
      icon: CheckCircle,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Permit CRM & DMS Demo
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Complete cross-organization permit approval workflow system.
            Select a role to begin the demo experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => {
            const Icon = role.icon
            return (
              <button
                key={role.role}
                onClick={() => {
                  setCurrentUser(role.role)
                  toggleRoleSwitcher()
                }}
                className="group p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-teal-300 transition-all duration-200 text-left"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-teal-50 rounded-lg group-hover:bg-teal-100 transition-colors">
                    <Icon className="h-6 w-6 text-teal-600" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {role.label}
                </h3>
                <p className="text-sm text-slate-600">
                  {role.description}
                </p>
              </button>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-slate-500">
            Phase 2 features (Android app, EVA route management, utility management,
            authentication, real Excel parsing, real email sending) are listed in the footer.
          </p>
        </div>
      </div>
    </div>
  )
}
