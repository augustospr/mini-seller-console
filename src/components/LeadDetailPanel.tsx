import {
  ArrowRight,
  Building,
  Mail,
  Save,
  TrendingUp,
  User,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()
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
      newErrors.name = t('leadDetail.errors.nameRequired')
    }

    if (!formData.email.trim()) {
      newErrors.email = t('leadDetail.errors.emailRequired')
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t('leadDetail.errors.emailInvalid')
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
      newErrors.opportunityName = t('leadDetail.errors.opportunityNameRequired')
    }

    if (!opportunityData.accountName.trim()) {
      newErrors.accountName = t('leadDetail.errors.accountNameRequired')
    }

    if (opportunityData.amount && isNaN(Number(opportunityData.amount))) {
      newErrors.amount = t('leadDetail.errors.amountInvalid')
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
          <SheetTitle className="flex items-center gap-2 text-lg">
            <User className="w-5 h-5" />
            {t('leadDetail.title')}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-6 px-2 sm:px-4 overflow-y-auto max-h-[calc(100vh-8rem)]">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">
                  {t('leadDetail.leadScore')}
                </span>
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

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('leadDetail.name')}</Label>
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

            <div className="space-y-2">
              <Label htmlFor="email">{t('leadDetail.email')}</Label>
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

            <div className="space-y-2">
              <Label htmlFor="status">{t('leadDetail.status')}</Label>
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
                  <SelectItem value="new">
                    {t('leadDetail.statuses.new')}
                  </SelectItem>
                  <SelectItem value="contacted">
                    {t('leadDetail.statuses.contacted')}
                  </SelectItem>
                  <SelectItem value="qualified">
                    {t('leadDetail.statuses.qualified')}
                  </SelectItem>
                  <SelectItem value="unqualified">
                    {t('leadDetail.statuses.unqualified')}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 space-y-2">
              <Building className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {t('leadDetail.company')}:
              </span>
              <span className="font-medium">{lead.company}</span>
            </div>
            <div className="flex items-center gap-2 space-y-2">
              <span className="text-sm text-gray-600">
                {t('leadDetail.source')}:
              </span>
              <Badge variant="secondary">{lead.source}</Badge>
            </div>
            <div className="flex items-center gap-2 space-y-2">
              <span className="text-sm text-gray-600">
                {t('leadDetail.id')}:
              </span>
              <span className="font-mono text-sm">{lead.id}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleSave} className="flex-1 text-sm">
              <Save className="w-4 h-4 mr-2" />
              {t('leadDetail.saveChanges')}
            </Button>
            <Button variant="outline" onClick={onClose} className="text-sm">
              {t('leadDetail.cancel')}
            </Button>
          </div>

          <Separator />

          {!isConverting ? (
            <div className="p-4 border-2 border-dashed border-green-200 rounded-lg">
              <div className="text-center">
                <h3 className="font-medium text-gray-900 mb-2">
                  {t('leadDetail.readyToConvert')}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {t('leadDetail.convertDescription')}
                </p>
                <Button
                  onClick={() => setIsConverting(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  {t('leadDetail.convertLead')}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 p-4 border border-green-200 rounded-lg bg-green-50">
              <h3 className="font-medium text-green-900 mb-4">
                {t('leadDetail.convertToOpportunity')}
              </h3>

              <div className="space-y-2">
                <Label htmlFor="opportunityName">
                  {t('leadDetail.opportunityName')}
                </Label>
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
                <Label htmlFor="stage">{t('leadDetail.stage')}</Label>
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
                    <SelectItem value="prospecting">
                      {t('leadDetail.stages.prospecting')}
                    </SelectItem>
                    <SelectItem value="qualification">
                      {t('leadDetail.stages.qualification')}
                    </SelectItem>
                    <SelectItem value="proposal">
                      {t('leadDetail.stages.proposal')}
                    </SelectItem>
                    <SelectItem value="negotiation">
                      {t('leadDetail.stages.negotiation')}
                    </SelectItem>
                    <SelectItem value="closed-won">
                      {t('leadDetail.stages.closedWon')}
                    </SelectItem>
                    <SelectItem value="closed-lost">
                      {t('leadDetail.stages.closedLost')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">{t('leadDetail.amount')}</Label>
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
                <Label htmlFor="accountName">
                  {t('leadDetail.accountName')}
                </Label>
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

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  onClick={handleConvert}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-sm"
                >
                  {t('leadDetail.createOpportunity')}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsConverting(false)}
                  className="text-sm"
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
