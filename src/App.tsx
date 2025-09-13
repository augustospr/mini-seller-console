import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { LanguageSwitcher } from './components/LanguageSwitcher'
import { LeadDetailPanel } from './components/LeadDetailPanel'
import { LeadsList } from './components/LeadsList'
import { OpportunitiesList } from './components/OpportunitiesList'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { useOptimisticList } from './hooks/useOptimisticUpdates'

export interface Lead {
  id: string
  name: string
  company: string
  email: string
  source: string
  score: number
  status: 'new' | 'contacted' | 'qualified' | 'unqualified'
}

export interface Opportunity {
  id: string
  name: string
  stage:
    | 'prospecting'
    | 'qualification'
    | 'proposal'
    | 'negotiation'
    | 'closed-won'
    | 'closed-lost'
  amount?: number
  accountName: string
  leadId: string
}

// Mock data
const initialLeads: Lead[] = [
  {
    id: 'L001',
    name: 'Ana Silva',
    company: 'TechCorp',
    email: 'ana.silva@techcorp.com',
    source: 'Website',
    score: 95,
    status: 'new',
  },
  {
    id: 'L002',
    name: 'Carlos Santos',
    company: 'Innovation Ltd',
    email: 'carlos@innovation.com',
    source: 'LinkedIn',
    score: 87,
    status: 'contacted',
  },
  {
    id: 'L003',
    name: 'Maria Oliveira',
    company: 'StartupXYZ',
    email: 'maria@startupxyz.com',
    source: 'Event',
    score: 72,
    status: 'qualified',
  },
  {
    id: 'L004',
    name: 'João Costa',
    company: 'Enterprise Solutions',
    email: 'joao@enterprise.com',
    source: 'Referral',
    score: 91,
    status: 'new',
  },
  {
    id: 'L005',
    name: 'Fernanda Lima',
    company: 'Digital Agency',
    email: 'fernanda@digital.com',
    source: 'Google Ads',
    score: 68,
    status: 'contacted',
  },
  {
    id: 'L006',
    name: 'Roberto Alves',
    company: 'Manufacturing Co',
    email: 'roberto@manufacturing.com',
    source: 'Website',
    score: 83,
    status: 'qualified',
  },
]

export default function App() {
  const { t } = useTranslation()
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false)

  const leadsState = useOptimisticList(
    initialLeads,
    async (leads) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return leads
    },
    {
      simulateFailure: true,
      failureRate: 0.3,
      onSuccess: () => {
        toast.success(t('app.optimistic.success'))
      },
      onError: (error) => {
        toast.error(t('app.optimistic.error', { message: error.message }))
      },
    },
  )

  const opportunitiesState = useOptimisticList<Opportunity>(
    [],
    async (opportunities) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return opportunities
    },
    {
      simulateFailure: true,
      failureRate: 0.2,
      onSuccess: () => {
        toast.success(t('app.optimistic.success'))
      },
      onError: (error) => {
        toast.error(t('app.optimistic.error', { message: error.message }))
      },
    },
  )

  const handleLeadSelect = (lead: Lead) => {
    setSelectedLead(lead)
    setIsDetailPanelOpen(true)
  }

  const handleLeadUpdate = (updatedLead: Lead) => {
    leadsState.updateItem(updatedLead.id, updatedLead)
    setSelectedLead(updatedLead)
  }

  const handleConvertToOpportunity = (
    lead: Lead,
    opportunityData: Omit<Opportunity, 'id' | 'leadId'>,
  ) => {
    const newOpportunity: Opportunity = {
      id: `O${opportunitiesState.data.length + 1}`.padStart(4, '0'),
      leadId: lead.id,
      ...opportunityData,
    }

    opportunitiesState.addItem(newOpportunity)

    const updatedLead = { ...lead, status: 'qualified' as const }
    leadsState.updateItem(lead.id, updatedLead)
    setSelectedLead(updatedLead)

    setIsDetailPanelOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {t('app.title')}
              </h1>
              <p className="mt-1 text-sm text-gray-600">{t('app.subtitle')}</p>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="leads" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-8">
            <TabsTrigger value="leads">
              {t('app.tabs.leads')} ({leadsState.data.length})
              {leadsState.isPending && (
                <span className="ml-2 text-xs text-blue-600">●</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="opportunities">
              {t('app.tabs.opportunities')} ({opportunitiesState.data.length})
              {opportunitiesState.isPending && (
                <span className="ml-2 text-xs text-blue-600">●</span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="leads" className="space-y-6">
            <LeadsList
              leads={leadsState.data}
              onLeadSelect={handleLeadSelect}
              isPending={leadsState.isPending}
              error={leadsState.error}
              onRetry={() => leadsState.resetError()}
            />
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-6">
            <OpportunitiesList
              opportunities={opportunitiesState.data}
              leads={leadsState.data}
              isPending={opportunitiesState.isPending}
              error={opportunitiesState.error}
              onRetry={() => opportunitiesState.resetError()}
            />
          </TabsContent>
        </Tabs>
      </div>

      <LeadDetailPanel
        lead={selectedLead}
        isOpen={isDetailPanelOpen}
        onClose={() => setIsDetailPanelOpen(false)}
        onLeadUpdate={handleLeadUpdate}
        onConvertToOpportunity={handleConvertToOpportunity}
      />
    </div>
  )
}
