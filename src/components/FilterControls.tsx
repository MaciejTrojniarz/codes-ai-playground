import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Search, Filter } from 'lucide-react'

export type StatusFilter = 'all' | 'active' | 'used' | 'expired'

interface FilterControlsProps {
  statusFilter: StatusFilter
  storeFilter: string
  onStatusFilterChange: (status: StatusFilter) => void
  onStoreFilterChange: (store: string) => void
  availableStores: string[]
}

export function FilterControls({
  statusFilter,
  storeFilter,
  onStatusFilterChange,
  onStoreFilterChange,
  availableStores
}: FilterControlsProps) {
  const statusOptions: { value: StatusFilter; label: string; count?: number }[] = [
    { value: 'all', label: 'Wszystkie' },
    { value: 'active', label: 'Aktywne' },
    { value: 'used', label: 'Użyte' },
    { value: 'expired', label: 'Przeterminowane' }
  ]

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4" />
          <span className="font-medium">Filtry</span>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          {/* Status Filter */}
          <div className="space-y-2">
            <Label>Status kodów</Label>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={statusFilter === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onStatusFilterChange(option.value)}
                  className="text-xs"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Store Filter */}
          <div className="space-y-2">
            <Label htmlFor="storeFilter">Filtruj po sklepie</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="storeFilter"
                placeholder="Wpisz nazwę sklepu..."
                value={storeFilter}
                onChange={(e) => onStoreFilterChange(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Quick store filters */}
            {availableStores.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                <Button
                  variant={storeFilter === '' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onStoreFilterChange('')}
                  className="text-xs h-7"
                >
                  Wszystkie
                </Button>
                {availableStores.slice(0, 5).map((store) => (
                  <Button
                    key={store}
                    variant={storeFilter === store ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onStoreFilterChange(store)}
                    className="text-xs h-7"
                  >
                    {store}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}