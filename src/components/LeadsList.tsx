import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Filter,
  RefreshCw,
  Search,
  X,
} from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import type { Lead } from '../App'
import { useFilterSortState } from '../hooks/useLocalStorage'
import { Alert, AlertDescription } from './ui/alert'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'

interface LeadsListProps {
  leads: Lead[]
  onLeadSelect: (lead: Lead) => void
  isPending?: boolean
  error?: Error | null
  onRetry?: () => void
}

type SortField = 'score' | 'name' | 'company'
type SortDirection = 'asc' | 'desc'

const statusColors = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  qualified: 'bg-green-100 text-green-800',
  unqualified: 'bg-red-100 text-red-800',
}

export function LeadsList({
  leads,
  onLeadSelect,
  isPending,
  error,
  onRetry,
}: LeadsListProps) {
  const { t } = useTranslation()

  const { state, updateState, resetState } = useFilterSortState(
    'leads-filter-sort',
    {
      searchTerm: '',
      statusFilter: 'all',
      sortField: 'score' as SortField,
      sortDirection: 'desc' as SortDirection,
    },
  )

  const { searchTerm, statusFilter, sortField, sortDirection } = state

  const hasActiveFilters = searchTerm !== '' || statusFilter !== 'all'

  const statusLabels = {
    new: t('leadDetail.statuses.new'),
    contacted: t('leadDetail.statuses.contacted'),
    qualified: t('leadDetail.statuses.qualified'),
    unqualified: t('leadDetail.statuses.unqualified'),
  }

  const filteredAndSortedLeads = useMemo(() => {
    const filtered = leads.filter((lead) => {
      const matchesSearch =
        searchTerm === '' ||
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus =
        statusFilter === 'all' || lead.status === statusFilter

      return matchesSearch && matchesStatus
    })

    filtered.sort((a, b) => {
      let comparison = 0

      switch (sortField) {
        case 'score':
          comparison = a.score - b.score
          break
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'company':
          comparison = a.company.localeCompare(b.company)
          break
      }

      return sortDirection === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [leads, searchTerm, statusFilter, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      updateState({
        sortDirection: sortDirection === 'asc' ? 'desc' : 'asc',
      })
    } else {
      updateState({
        sortField: field,
        sortDirection: field === 'score' ? 'desc' : 'asc',
      })
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-4 h-4 text-blue-600" />
    ) : (
      <ArrowDown className="w-4 h-4 text-blue-600" />
    )
  }

  if (leads.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('leadsList.noLeadsYet')}
          </h3>
          <p className="text-gray-600 text-center max-w-md">
            {t('leadsList.noLeadsDescription')}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{t('leadsList.error', { message: error.message })}</span>
            {onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="ml-4"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {t('leadsList.retry')}
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {t('leadsList.title')}
            {isPending && (
              <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
            )}
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={t('leadsList.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => updateState({ searchTerm: e.target.value })}
                className="pl-10"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => updateState({ statusFilter: value })}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder={t('leadsList.filterPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t('leadsList.allStatuses')}
                </SelectItem>
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
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetState}
                className="w-full sm:w-auto"
              >
                <X className="w-4 h-4 mr-2" />
                {t('leadsList.clearFilters')}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredAndSortedLeads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('leadsList.noLeadsFound')}
              </h3>
              <p className="text-gray-600 text-center max-w-md">
                {t('leadsList.noLeadsFoundDescription')}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">
                      {t('leadsList.id')}
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('name')}
                        className="h-auto !p-0 font-medium hover:bg-transparent"
                      >
                        {t('leadsList.name')} {getSortIcon('name')}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('company')}
                        className="h-auto !p-0 font-medium hover:bg-transparent"
                      >
                        {t('leadsList.company')} {getSortIcon('company')}
                      </Button>
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      {t('leadsList.email')}
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">
                      {t('leadsList.source')}
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('score')}
                        className="h-auto !p-0 font-medium hover:bg-transparent"
                      >
                        {t('leadsList.score')} {getSortIcon('score')}
                      </Button>
                    </TableHead>
                    <TableHead>{t('leadsList.status')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedLeads.map((lead) => (
                    <TableRow
                      key={lead.id}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => onLeadSelect(lead)}
                    >
                      <TableCell className="font-mono">{lead.id}</TableCell>
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell>{lead.company}</TableCell>
                      <TableCell className="hidden md:table-cell text-gray-600">
                        {lead.email}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-800">
                          {lead.source}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{lead.score}</span>
                          <div className="w-12 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${lead.score}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[lead.status]}>
                          {statusLabels[lead.status]}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
