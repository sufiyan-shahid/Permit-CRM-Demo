/*
 * Permit CRM Demo Application
 * Following the opencode-prototype-prompt.md specifications
 * For a clickable web prototype demonstrating permit approval workflow
 */

// Types for our Permit CRM Demo
export type PermitType = 'incoming' | 'outgoing'

export type PermitStatus =
  | 'draft'
  | 'submitted'
  | 'stage1'
  | 'stage2'
  | 'stage3'
  | 'stage4'
  | 'stage5'
  | 'stage6'
  | 'approved'
  | 'returned'

export type UserRole = 'contractor' | 'fmco' | 'pmc' | 'fifty-investments' | 'cp-fa'

export type DocumentType =
  | 'id'
  | 'residency'
  | 'vehicle-registration'
  | 'driver-license'
  | 'iqama'
  | 'muqeem'
  | 'photo'
  | 'evidence'

export interface Document {
  id: string
  name: string
  type: DocumentType
  uploadedAt: string
  version: number
}

export interface Material {
  id: string
  description: string
  quantity: number
  unit: string
  weight: number
  packaging?: string
  destination?: string
}

export interface Equipment {
  id: string
  type: string
  dimensions?: string
  weight: number
  handlingNotes?: string
}

export interface Passenger {
  id: string
  name: string
  seat?: string
  ticketNumber?: string
}

export interface Driver {
  id: string
  name: string
  employer: string
  iqamaNumber: string
  contactInfo: string
}

export interface Permit {
  id: string
  contractorId: string
  contractorName: string
  permitType: PermitType
  permitSubtype?: 'short-term' | 'long-term'
  status: PermitStatus
  currentStage: number
  submittedAt: string
  requestedStartDate?: string
  requestedEndDate?: string
  vehicleInfo?: string
  driverInfo?: Driver
  materials: Material[]
  equipment: Equipment[]
  passengers: Passenger[]
  documents: Document[]
  rejectionComments?: string
  returnReason?: string
  parentIncomingPermitId?: string
  reconciliationData?: {
    totalIncoming: number
    totalReturned: number
    remaining: number
  }
  history: StatusHistoryEntry[]
}

export interface StatusHistoryEntry {
  id: string
  status: PermitStatus
  stage: number
  timestamp: string
  reviewerId?: string
  reviewerName?: string
  reviewerRole?: UserRole
  action: 'submitted' | 'approved' | 'returned' | 'resubmitted'
  comments?: string
  returnReason?: string
  notifiedContractors?: string[]
}

export interface Contractor {
  id: string
  name: string
  company: string
  email: string
  phone: string
}

export interface ApplicationStats {
  total: number
  inReview: number
  approved: number
  returned: number
  unscheduled: number
}
