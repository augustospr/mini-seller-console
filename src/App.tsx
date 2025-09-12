import { useState } from 'react'

import { LeadDetailPanel } from './components/LeadDetailPanel'
import { LeadsList } from './components/LeadsList'
import { OpportunitiesList } from './components/OpportunitiesList'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'

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
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false)

  const handleLeadSelect = (lead: Lead) => {
    setSelectedLead(lead)
    setIsDetailPanelOpen(true)
  }

  const handleLeadUpdate = (updatedLead: Lead) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === updatedLead.id ? updatedLead : lead)),
    )
    setSelectedLead(updatedLead)
  }

  const handleConvertToOpportunity = (
    lead: Lead,
    opportunityData: Omit<Opportunity, 'id' | 'leadId'>,
  ) => {
    const newOpportunity: Opportunity = {
      id: `O${opportunities.length + 1}`.padStart(4, '0'),
      leadId: lead.id,
      ...opportunityData,
    }

    setOpportunities((prev) => [...prev, newOpportunity])

    const updatedLead = { ...lead, status: 'qualified' as const }
    handleLeadUpdate(updatedLead)

    setIsDetailPanelOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              Seller Console
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage your leads and opportunities
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="leads" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-8">
            <TabsTrigger value="leads">Leads ({leads.length})</TabsTrigger>
            <TabsTrigger value="opportunities">
              Opportunities ({opportunities.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="leads" className="space-y-6">
            <LeadsList leads={leads} onLeadSelect={handleLeadSelect} />
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-6">
            <OpportunitiesList opportunities={opportunities} leads={leads} />
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
