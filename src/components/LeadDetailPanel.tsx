import {
  ArrowRight,
  Building,
  Mail,
  Save,
  TrendingUp,
  User,
} from 'lucide-react'
import { useEffect, useState } from 'react'

import type { Lead, Opportunity } from '../App'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Separator } from './ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet'

interface LeadDetailPanelProps {
  lead: Lead | null
  isOpen: boolean
  onClose: () => void
  onLeadUpdate: (lead: Lead) => void
  onConvertToOpportunity: (
    lead: Lead,
    opportunity: Omit<Opportunity, 'id' | 'leadId'>,
  ) => void
}

export function LeadDetailPanel({
  lead,
  isOpen,
  onClose,
  onLeadUpdate,
  onConvertToOpportunity,
}: LeadDetailPanelProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    status: 'new' as Lead['status'],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isConverting, setIsConverting] = useState(false)
  const [opportunityData, setOpportunityData] = useState({
    name: '',
    stage: 'prospecting' as Opportunity['stage'],
    amount: '',
    accountName: '',
  })

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name,
        email: lead.email,
        status: lead.status,
      })
      setOpportunityData({
        name: `${lead.company} - Opportunity`,
        stage: 'prospecting',
        amount: '',
        accountName: lead.company,
      })
      setErrors({})
      setIsConverting(false)
    }
  }, [lead])

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSave = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0 && lead) {
      const updatedLead: Lead = {
        ...lead,
        name: formData.name,
        email: formData.email,
        status: formData.status,
      }
      onLeadUpdate(updatedLead)
    }
  }

  const handleConvert = () => {
    const newErrors: Record<string, string> = {}

    if (!opportunityData.name.trim()) {
      newErrors.opportunityName = 'Opportunity name is required'
    }

    if (!opportunityData.accountName.trim()) {
      newErrors.accountName = 'Account name is required'
    }

    if (opportunityData.amount && isNaN(Number(opportunityData.amount))) {
      newErrors.amount = 'Amount must be a valid number'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0 && lead) {
      const opportunityToCreate: Omit<Opportunity, 'id' | 'leadId'> = {
        name: opportunityData.name,
        stage: opportunityData.stage,
        amount: opportunityData.amount
          ? Number(opportunityData.amount)
          : undefined,
        accountName: opportunityData.accountName,
      }

      onConvertToOpportunity(lead, opportunityToCreate)
      setIsConverting(false)
    }
  }

  if (!lead) return null

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Lead Details
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6 px-4">
          {/* Lead Score */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">Lead Score</span>
              </div>
              <span className="text-2xl font-bold text-blue-600">
                {lead.score}
              </span>
            </div>
            <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${lead.score}%` }}
              />
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: value as Lead['status'],
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="unqualified">Unqualified</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Read-only fields */}
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Company:</span>
              <span className="font-medium">{lead.company}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Source:</span>
              <Badge variant="secondary">{lead.source}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">ID:</span>
              <span className="font-mono text-sm">{lead.id}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={handleSave} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>

          <Separator />

          {/* Convert to Opportunity Section */}
          {!isConverting ? (
            <div className="p-4 border-2 border-dashed border-green-200 rounded-lg">
              <div className="text-center">
                <h3 className="font-medium text-gray-900 mb-2">
                  Ready to convert?
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Convert this lead to an opportunity to start tracking deals.
                </p>
                <Button
                  onClick={() => setIsConverting(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Convert Lead
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 p-4 border border-green-200 rounded-lg bg-green-50">
              <h3 className="font-medium text-green-900 mb-4">
                Convert to Opportunity
              </h3>

              <div className="space-y-2">
                <Label htmlFor="opportunityName">Opportunity Name</Label>
                <Input
                  id="opportunityName"
                  value={opportunityData.name}
                  onChange={(e) =>
                    setOpportunityData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className={
                    errors.opportunityName
                      ? 'border-red-500'
                      : 'border-gray-300 border'
                  }
                />
                {errors.opportunityName && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.opportunityName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="stage">Stage</Label>
                <Select
                  value={opportunityData.stage}
                  onValueChange={(value) =>
                    setOpportunityData((prev) => ({
                      ...prev,
                      stage: value as Opportunity['stage'],
                    }))
                  }
                >
                  <SelectTrigger className="border-gray-300 border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prospecting">Prospecting</SelectItem>
                    <SelectItem value="qualification">Qualification</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                    <SelectItem value="negotiation">Negotiation</SelectItem>
                    <SelectItem value="closed-won">Closed Won</SelectItem>
                    <SelectItem value="closed-lost">Closed Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (Optional)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={opportunityData.amount}
                  onChange={(e) =>
                    setOpportunityData((prev) => ({
                      ...prev,
                      amount: e.target.value,
                    }))
                  }
                  className={
                    errors.amount ? 'border-red-500' : 'border-gray-300 border'
                  }
                />
                {errors.amount && (
                  <p className="text-sm text-red-600 mt-1">{errors.amount}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountName">Account Name</Label>
                <Input
                  id="accountName"
                  value={opportunityData.accountName}
                  onChange={(e) =>
                    setOpportunityData((prev) => ({
                      ...prev,
                      accountName: e.target.value,
                    }))
                  }
                  className={
                    errors.accountName
                      ? 'border-red-500'
                      : 'border-gray-300 border'
                  }
                />
                {errors.accountName && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.accountName}
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleConvert}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Create Opportunity
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsConverting(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
