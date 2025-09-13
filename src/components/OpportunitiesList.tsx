import {
  AlertCircle,
  Building,
  DollarSign,
  RefreshCw,
  Target,
  User,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

import type { Lead, Opportunity } from '../App'
import { Alert, AlertDescription } from './ui/alert'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'

interface OpportunitiesListProps {
  opportunities: Opportunity[]
  leads: Lead[]
  isPending?: boolean
  error?: Error | null
  onRetry?: () => void
}

const stageColors = {
  prospecting: 'bg-blue-100 text-blue-800',
  qualification: 'bg-yellow-100 text-yellow-800',
  proposal: 'bg-orange-100 text-orange-800',
  negotiation: 'bg-purple-100 text-purple-800',
  'closed-won': 'bg-green-100 text-green-800',
  'closed-lost': 'bg-red-100 text-red-800',
}

export function OpportunitiesList({
  opportunities,
  leads,
  isPending,
  error,
  onRetry,
}: OpportunitiesListProps) {
  const { t } = useTranslation()

  const stageLabels = {
    prospecting: t('opportunitiesList.stages.prospecting'),
    qualification: t('opportunitiesList.stages.qualification'),
    proposal: t('opportunitiesList.stages.proposal'),
    negotiation: t('opportunitiesList.stages.negotiation'),
    'closed-won': t('opportunitiesList.stages.closedWon'),
    'closed-lost': t('opportunitiesList.stages.closedLost'),
  }

  const getLeadName = (leadId: string) => {
    const lead = leads.find((l) => l.id === leadId)
    return lead?.name || t('opportunitiesList.unknownLead')
  }

  const formatCurrency = (amount?: number) => {
    if (!amount) return '-'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount)
  }

  const totalValue = opportunities.reduce(
    (sum, opp) => sum + (opp.amount || 0),
    0,
  )
  const wonOpportunities = opportunities.filter(
    (opp) => opp.stage === 'closed-won',
  )
  const totalWonValue = wonOpportunities.reduce(
    (sum, opp) => sum + (opp.amount || 0),
    0,
  )

  if (opportunities.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Target className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('opportunitiesList.noOpportunitiesYet')}
          </h3>
          <p className="text-gray-600 text-center max-w-md">
            {t('opportunitiesList.noOpportunitiesDescription')}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              {t('opportunitiesList.error', { message: error.message })}
            </span>
            {onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="ml-4"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {t('opportunitiesList.retry')}
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  {t('opportunitiesList.totalPipeline')}
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                  {formatCurrency(totalValue)}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  {t('opportunitiesList.wonDeals')}
                </p>
                <p className="text-lg sm:text-2xl font-bold text-green-600 truncate">
                  {formatCurrency(totalWonValue)}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  {t('opportunitiesList.activeOpportunities')}
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {opportunities.length}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Building className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {t('opportunitiesList.title')}
            {isPending && (
              <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="hidden lg:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">
                    {t('opportunitiesList.id')}
                  </TableHead>
                  <TableHead>
                    {t('opportunitiesList.opportunityName')}
                  </TableHead>
                  <TableHead>{t('opportunitiesList.account')}</TableHead>
                  <TableHead className="hidden md:table-cell">
                    {t('opportunitiesList.leadContact')}
                  </TableHead>
                  <TableHead>{t('opportunitiesList.stage')}</TableHead>
                  <TableHead className="text-right">
                    {t('opportunitiesList.amount')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {opportunities.map((opportunity) => (
                  <TableRow key={opportunity.id} className="hover:bg-gray-50">
                    <TableCell className="font-mono">
                      {opportunity.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      {opportunity.name}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-400" />
                        {opportunity.accountName}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        {getLeadName(opportunity.leadId)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={stageColors[opportunity.stage]}>
                        {stageLabels[opportunity.stage]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(opportunity.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="lg:hidden space-y-3 p-4">
            {opportunities.map((opportunity) => (
              <Card
                key={opportunity.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {opportunity.name}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">
                        {opportunity.accountName}
                      </p>
                    </div>
                    <Badge className={stageColors[opportunity.stage]}>
                      {stageLabels[opportunity.stage]}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">ID:</span>
                      <span className="font-mono">{opportunity.id}</span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Lead:</span>
                      <span className="text-gray-900 truncate ml-2">
                        {getLeadName(opportunity.leadId)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Amount:</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(opportunity.amount)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
