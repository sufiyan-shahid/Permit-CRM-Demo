import React, { useState } from 'react'

interface Step {
  id: number
  title: string
  description: string
}

const steps: Step[] = [
  { id: 1, title: 'Permit Details', description: 'Permittype, dates, and duration' },
  { id: 2, title: 'Vehicle & Driver', description: 'Vehicle info and driver details' },
  { id: 3, title: 'Materials & Equipment', description: 'Add materials and equipment' },
  { id: 4, title: 'Passenger Manifest', description: 'Optional passenger information' },
  { id: 5, title: 'Documents', description: 'Upload supporting documents' },
  { id: 6, title: 'Review & Submit', description: 'Final review and submission' },
]

export default function PermitWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({})

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">New Permit Application</h2>
        <p className="text-slate-600">Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`text-sm font-medium ${currentStep >= step.id ? 'text-teal-600' : 'text-slate-400'}`}
            >
              Step {step.id}
            </div>
          ))}
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-teal-600 h-2 rounded-full transition-all"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl border border-slate-200 p-8 mb-8">
        <StepContent step={currentStep} formData={formData} setFormData={setFormData} />
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <button
          onClick={nextStep}
          className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          {currentStep === steps.length ? 'Submit Application' : 'Next'}
        </button>
      </div>
    </div>
  )
}

function StepContent({ step, formData, setFormData }: { step: number, formData: any, setFormData: any }) {
  switch (step) {
    case 1:
      return (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-slate-900">Basic Permit Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Permit Type</label>
              <select className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                <option>Incoming</option>
                <option>Outgoing</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Permit Subtype</label>
              <select className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                <option>Short-term</option>
                <option>Long-term</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
              <input type="date" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
              <input type="date" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
            </div>
          </div>
        </div>
      )
    case 2:
      return (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-slate-900">Vehicle & Driver Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Vehicle Registration</label>
              <input type="text" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="ABC-1234" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Vehicle Model</label>
              <input type="text" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Toyota Hilux" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Driver Name</label>
              <input type="text" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Mohammed Al-Saud" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Driver License</label>
              <input type="text" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="DL-123456" />
            </div>
          </div>
        </div>
      )
    case 3:
      return (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-slate-900">Materials & Equipment</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <h4 className="font-medium text-slate-900">Cement Bags</h4>
                <p className="text-sm text-slate-600">100 bags, 2000 kg</p>
              </div>
              <button className="px-3 py-1 bg-teal-100 text-teal-700 rounded text-sm hover:bg-teal-200">Add Another</button>
            </div>
            <button className="w-full p-4 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-teal-400 hover:text-teal-600 transition-colors">
              + Add New Material/Equipment
            </button>
          </div>
        </div>
      )
    case 4:
      return (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-slate-900">Passenger Manifest (Optional)</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <h4 className="font-medium text-slate-900">Driver Seat</h4>
                <p className="text-sm text-slate-600">Mohammed Al-Saud</p>
              </div>
              <span className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-xs">Required</span>
            </div>
            <button className="w-full p-4 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-teal-400 hover:text-teal-600 transition-colors">
              + Add Passenger
            </button>
          </div>
        </div>
      )
    case 5:
      return (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-slate-900">Document Upload</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <h4 className="font-medium text-slate-900">Driver ID Card</h4>
                <p className="text-sm text-slate-600">ID_Card_Mohammed.pdf (2.4MB)</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Uploaded</span>
            </div>
            <button className="w-full p-4 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-teal-400 hover:text-teal-600 transition-colors">
              + Upload Document
            </button>
          </div>
        </div>
      )
    case 6:
      return (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-slate-900">Review & Submit</h3>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-amber-900 mb-2">Final Review Required</h4>
            <p className="text-sm text-amber-800">Please review all entered information before submission. Once submitted, the application will enter the review workflow.</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
              <span className="text-sm text-slate-600">Permit Type:</span>
              <span className="font-medium">Incoming Short-term</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
              <span className="text-sm text-slate-600">Vehicle:</span>
              <span className="font-medium">ABC-1234</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
              <span className="text-sm text-slate-600">Driver:</span>
              <span className="font-medium">Mohammed Al-Saud</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
              <span className="text-sm text-slate-600">Documents:</span>
              <span className="font-medium">1 uploaded (Driver ID)</span>
            </div>
          </div>
        </div>
      )
    default:
      return <div>Step not implemented</div>
  }
}
