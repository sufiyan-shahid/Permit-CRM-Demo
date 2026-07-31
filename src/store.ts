"use client"
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Permit, Contractor, ApplicationStats, PermitStatus, StatusHistoryEntry, UserRole } from './types'

const MOCK_CONTRACTORS: Contractor[] = [
  {
    id: 'CONT-001',
    name: 'Mohammed Al-Saud',
    company: 'Al-Saud Contracting',
    email: 'm.al-saud@alsaud.com',
    phone: '+966-50-123-4567',
  },
  {
    id: 'CONT-002',
    name: 'Saudi Facilities Management',
    company: 'SFL',
    email: 'permits@sfl.com',
    phone: '+966-55-987-6543',
  },
  {
    id: 'CONT-003',
    name: 'North Construction',
    company: 'North Group',
    email: 'nc@northgroup.com',
    phone: '+966-54-555-1234',
  },
  {
    id: 'CONT-004',
    name: 'Golden Tower Development',
    company: 'GTD Saudi',
    email: 'operations@gtd-saudi.com',
    phone: '+966-56-789-0123',
  },
]

// Helper to generate IDs
const generateId = (): string => Math.random().toString(36).substr(2, 9)

// Helper to get current timestamp
const getTimestamp = (): string => new Date().toISOString()

// Initial stage data
const createInitialHistoryEntry = (status: PermitStatus, stage: number, action: StatusHistoryEntry['action'], reviewerId?: string, reviewerName?: string, comments?: string): StatusHistoryEntry => ({
  id: generateId(),
  status,
  stage,
  timestamp: getTimestamp(),
  reviewerId,
  reviewerName,
  action,
  comments,
})

// Initial reconciliation data for different periods
const getReconciliationData = (total: number, returned: number): { totalIncoming: number, totalReturned: number, remaining: number } => ({
  totalIncoming: total,
  totalReturned: returned,
  remaining: total - returned,
})

// Generate initial permit data with realistic workflow stages
const MOCK_INITIAL_PERMITS: Permit[] = [
  // --- SUBMITTED APPLICATIONS ---
  {
    id: 'PERM-2024-001',
    contractorId: 'CONT-001',
    contractorName: 'Mohammed Al-Saud',
    permitType: 'incoming',
    permitSubtype: 'short-term',
    status: 'submitted',
    currentStage: 1,
    submittedAt: '2024-06-10T09:00:00Z',
    requestedStartDate: '2024-06-15T00:00:00Z',
    requestedEndDate: '2024-06-20T00:00:00Z',
    vehicleInfo: 'Toyota Hilux, Plate #123ABC',
    driverInfo: {
      id: 'DRV-001',
      name: 'Khalid Hassan',
      employer: 'Al-Saud Contracting',
      iqamaNumber: '1234567890',
      contactInfo: '+966-55-111-2222',
    },
    materials: [
      {
        id: 'MAT-001',
        description: 'Cement Bags',
        quantity: 100,
        unit: 'bags',
        weight: 2000,
        packaging: 'Standard bags',
        destination: 'Construction Site A',
      },
    ],
    equipment: [],
    passengers: [],
    documents: [
      {
        id: 'DOC-001',
        name: 'ID_Card_Khalid_Hassan.pdf',
        type: 'id',
        uploadedAt: '2024-06-10T08:30:00Z',
        version: 1,
      },
      {
        id: 'DOC-002',
        name: 'Vehicle_Registration.pdf',
        type: 'vehicle-registration',
        uploadedAt: '2024-06-10T08:35:00Z',
        version: 1,
      },
    ],
    history: [
      createInitialHistoryEntry('submitted', 1, 'submitted'),
    ],
  },
  {
    id: 'PERM-2024-002',
    contractorId: 'CONT-002',
    contractorName: 'Saudi Facilities Management',
    permitType: 'outgoing',
    permitSubtype: 'short-term',
    status: 'returned',
    currentStage: 1,
    submittedAt: '2024-06-08T10:00:00Z',
    requestedStartDate: '2024-06-12T00:00:00Z',
    requestedEndDate: '2024-06-15T00:00:00Z',
    vehicleInfo: 'Ford Transit, Plate #456DEF',
    driverInfo: {
      id: 'DRV-002',
      name: 'Salem Al-Ghamdi',
      employer: 'SFL',
      iqamaNumber: '2345678901',
      contactInfo: '+966-55-222-3333',
    },
    materials: [
      {
        id: 'MAT-002',
        description: 'Steel Beams',
        quantity: 50,
        unit: 'pieces',
        weight: 5000,
        packaging: 'Crated',
        destination: 'Site B',
      },
    ],
    equipment: [
      {
        id: 'EQ-001',
        type: 'Crane',
        dimensions: '10m x 5m x 3m',
        weight: 8000,
      },
    ],
    passengers: [],
    documents: [
      {
        id: 'DOC-003',
        name: 'ID_Card_Salem_Alghamdi.pdf',
        type: 'id',
        uploadedAt: '2024-06-08T09:30:00Z',
        version: 1,
      },
      {
        id: 'DOC-004',
        name: 'Iqama_Salem.pdf',
        type: 'iqama',
        uploadedAt: '2024-06-08T09:35:00Z',
        version: 1,
      },
      {
        id: 'DOC-005',
        name: 'Photos_Upload.pdf',
        type: 'photo',
        uploadedAt: '2024-06-08T09:40:00Z',
        version: 1,
      },
    ],
    rejectionComments: 'Please upload complete driver information and additional safety documents.',
    returnReason: 'missing_documents',
    history: [
      createInitialHistoryEntry('submitted', 1, 'submitted'),
      {
        id: generateId(),
        status: 'returned',
        stage: 1,
        timestamp: '2024-06-09T14:00:00Z',
        reviewerId: 'REV-001',
        reviewerName: 'Fatima Al-Zahra',
        reviewerRole: 'fmco',
        action: 'returned',
        comments: 'Please upload complete driver information and additional safety documents.',
        returnReason: 'missing_documents',
        notifiedContractors: ['CONT-002'],
      },
    ],
  },
  {
    id: 'PERM-2024-003',
    contractorId: 'CONT-003',
    contractorName: 'North Construction',
    permitType: 'incoming',
    permitSubtype: 'long-term',
    status: 'stage3',
    currentStage: 3,
    submittedAt: '2024-06-05T08:00:00Z',
    requestedStartDate: '2024-07-01T00:00:00Z',
    requestedEndDate: '2024-12-31T00:00:00Z',
    vehicleInfo: 'Volvo FE, Plate #789GHI',
    driverInfo: {
      id: 'DRV-003',
      name: 'Omar Al-Rashid',
      employer: 'North Group',
      iqamaNumber: '3456789012',
      contactInfo: '+966-55-333-4444',
    },
    materials: [
      {
        id: 'MAT-003',
        description: 'Concrete Mixers',
        quantity: 5,
        unit: 'units',
        weight: 10000,
        packaging: 'Specialized containers',
        destination: 'Construction Site C',
      },
    ],
    equipment: [
      {
        id: 'EQ-002',
        type: 'Excavator',
        dimensions: '5m x 3m x 3m',
        weight: 15000,
      },
    ],
    passengers: [
      {
        id: 'PASS-001',
        name: 'Aisha Mohammed',
        seat: 'Driver seat',
        ticketNumber: 'TK-001',
      },
    ],
    documents: [
      {
        id: 'DOC-006',
        name: 'ID_Card_Omar.pdf',
        type: 'id',
        uploadedAt: '2024-06-05T07:30:00Z',
        version: 2,
      },
    ],
    history: [
      createInitialHistoryEntry('submitted', 1, 'submitted'),
      {
        id: generateId(),
        status: 'stage1',
        stage: 1,
        timestamp: '2024-06-06T09:00:00Z',
        reviewerId: 'REV-001',
        reviewerName: 'Fatima Al-Zahra',
        reviewerRole: 'fmco',
        action: 'approved',
        comments: 'FMCO preliminary review complete.',
      },
      {
        id: generateId(),
        status: 'stage2',
        stage: 2,
        timestamp: '2024-06-07T11:00:00Z',
        reviewerId: 'REV-002',
        reviewerName: 'Ahmed Al-Saadi',
        reviewerRole: 'pmc',
        action: 'approved',
        comments: 'PMC approval complete, moved to Fifty Investments review.',
      },
      {
        id: generateId(),
        status: 'stage3',
        stage: 3,
        timestamp: '2024-06-08T15:00:00Z',
        reviewerId: 'REV-003',
        reviewerName: 'Sara Al-Mansouri',
        reviewerRole: 'fifty-investments',
        action: 'approved',
        comments: 'Fifty Investments has reviewed and accepted the application.',
      },
    ],
  },
  {
    id: 'PERM-2024-004',
    contractorId: 'CONT-004',
    contractorName: 'Golden Tower Development',
    permitType: 'incoming',
    permitSubtype: 'short-term',
    status: 'submitted',
    currentStage: 1,
    submittedAt: '2024-06-12T14:00:00Z',
    requestedStartDate: '2024-06-18T00:00:00Z',
    requestedEndDate: '2024-06-22T00:00:00Z',
    vehicleInfo: 'Mercedes Sprinter, Plate #999JKL',
    driverInfo: {
      id: 'DRV-004',
      name: 'Yousef Al-Harbi',
      employer: 'GTD Saudi',
      iqamaNumber: '4567890123',
      contactInfo: '+966-55-444-5555',
    },
    materials: [
      {
        id: 'MAT-004',
        description: 'Reinforcing Bars',
        quantity: 200,
        unit: 'pieces',
        weight: 3000,
        packaging: 'Palleted',
        destination: 'Site D',
      },
      {
        id: 'MAT-005',
        description: 'Water Tanks',
        quantity: 10,
        unit: 'units',
        weight: 1000,
        packaging: 'Individual packaging',
        destination: 'Site D',
      },
    ],
    equipment: [],
    passengers: [
      {
        id: 'PASS-002',
        name: 'Noura Al-Khalifa',
        seat: 'Passenger seat 1',
        ticketNumber: 'TK-002',
      },
      {
        id: 'PASS-003',
        name: 'Layla Hassan',
        seat: 'Passenger seat 2',
        ticketNumber: 'TK-003',
      },
    ],
    documents: [
      {
        id: 'DOC-007',
        name: 'ID_Card_Yousef.pdf',
        type: 'id',
        uploadedAt: '2024-06-12T13:30:00Z',
        version: 1,
      },
    ],
    history: [
      createInitialHistoryEntry('submitted', 1, 'submitted'),
    ],
  },
]

interface PermitStore {
  permits: Permit[]
  contractors: Contractor[]
  currentUser: UserRole | null
  currentUserRole: UserRole | null
  isRoleSwitcherOpen: boolean

  // Actions
  setCurrentUser: (role: UserRole) => void
  toggleRoleSwitcher: () => void
  submitNewPermit: (permit: Omit<Permit, 'id' | 'history' | 'status' | 'currentStage' | 'submittedAt'>) => void
  updatePermitStage: (permitId: string, action: 'approved' | 'returned', reviewerId: string, reviewerName: string, reviewerRole: UserRole, comments?: string, returnReason?: string) => void
  addResubmission: (permitId: string, updatedPermit: Partial<Permit>, comments?: string) => void
  getStats: () => ApplicationStats
  getPermitById: (id: string) => Permit | undefined
  getFilteredPermits: (filters: {
    status?: PermitStatus
    contractorId?: string
    stage?: number
  }) => Permit[]
}

export const usePermitStore = create<PermitStore>()(
  devtools((set, get) => ({
    permits: [...MOCK_INITIAL_PERMITS],
    contractors: MOCK_CONTRACTORS,
    currentUser: null,
    currentUserRole: null,
    isRoleSwitcherOpen: false,

    setCurrentUser: (role) => set({ currentUser: role, currentUserRole: role }, false, 'setCurrentUser'),

    toggleRoleSwitcher: () => set((state) => ({ isRoleSwitcherOpen: !state.isRoleSwitcherOpen })),

    submitNewPermit: (permitData) => {
      const newPermit: Permit = {
        ...permitData,
        id: generateId(),
        status: 'submitted',
        currentStage: 1,
        submittedAt: getTimestamp(),
        history: [createInitialHistoryEntry('submitted', 1, 'submitted')],
      }

      set((state) => ({ permits: [...state.permits, newPermit] }), false, 'submitNewPermit')
    },

    updatePermitStage: (permitId, action, reviewerId, reviewerName, reviewerRole, comments, returnReason) => {
      set((state) => {
        const permit = state.permits.find((p) => p.id === permitId)
        if (!permit) return state

        let newStatus: PermitStatus
        let newStage = permit.currentStage

        if (action === 'approved') {
          newStage += 1
          newStatus = newStage >= 6 ? 'approved' : (`stage${newStage}` as PermitStatus)
        } else {
          newStatus = 'returned'
          newStage = permit.currentStage
        }

        const historyEntry: StatusHistoryEntry = {
          id: generateId(),
          status: newStatus,
          stage: newStage,
          timestamp: getTimestamp(),
          reviewerId,
          reviewerName,
          reviewerRole,
          action,
          comments,
          returnReason,
          notifiedContractors: [permit.contractorId],
        }

        const updatedPermit = {
          ...permit,
          status: newStatus,
          currentStage: newStage,
          rejectionComments: action === 'returned' ? comments : undefined,
          returnReason: action === 'returned' ? returnReason : undefined,
          history: [...permit.history, historyEntry],
        }

        return {
          permits: state.permits.map((p) => (p.id === permitId ? updatedPermit : p)),
        }
      }, false, 'updatePermitStage')
    },

    addResubmission: (permitId, updatedPermitData, comments) => {
      set((state) => {
        const originalPermit = state.permits.find((p) => p.id === permitId)
        if (!originalPermit) return state

        const resubmittedPermit = {
          ...originalPermit,
          ...updatedPermitData,
          status: 'submitted' as PermitStatus,
          currentStage: 1,
          submittedAt: getTimestamp(),
          history: [
            ...originalPermit.history,
            createInitialHistoryEntry('submitted', 1, 'resubmitted'),
          ],
        }

        return {
          permits: state.permits.map((p) => (p.id === permitId ? resubmittedPermit : p)),
        }
      }, false, 'addResubmission')
    },

    getStats: () => {
      const state = get()
      const permits = state.permits

      return permits.reduce(
        (stats, permit) => {
          stats.total++
          if (['stage1', 'stage2', 'stage3', 'stage4', 'stage5'].includes(permit.status)) {
            stats.inReview++
          } else if (permit.status === 'approved') {
            stats.approved++
          } else if (permit.status === 'returned') {
            stats.returned++
          } else if (permit.status === 'submitted') {
            stats.unscheduled++
          }

          return stats
        },
        { total: 0, inReview: 0, approved: 0, returned: 0, unscheduled: 0 } as ApplicationStats
      )
    },

    getPermitById: (id: string) => {
      const state = get()
      return state.permits.find((permit) => permit.id === id)
    },

    getFilteredPermits: (filters) => {
      const state = get()
      return state.permits.filter((permit) => {
        if (filters.status && permit.status !== filters.status) return false
        if (filters.contractorId && permit.contractorId !== filters.contractorId) return false
        if (filters.stage !== undefined && permit.currentStage !== filters.stage) return false
        return true
      })
    },
  }))
)
