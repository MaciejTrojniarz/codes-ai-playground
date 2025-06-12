import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { formatDate, isExpiringSoon } from '@/lib/utils'
import { Check, Calendar, Store, Tag, Image as ImageIcon } from 'lucide-react'
import type { DiscountCode } from '@/lib/types'

interface CodeListProps {
  refreshTrigger: number
}

export function CodeList({ refreshTrigger }: CodeListProps) {
  const [codes, setCodes] = useState<DiscountCode[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchCodes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('discount_codes')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('expiry_date', { ascending: true })

      if (error) throw error

      setCodes(data || [])
    } catch (error: any) {
      toast({
        title: "Błąd",
        description: "Nie udało się pobrać kodów rabatowych.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const markAsUsed = async (id: string) => {
    try {
      const { error } = await supabase
        .from('discount_codes')
        .update({ status: 'used', updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Sukces",
        description: "Kod został oznaczony jako użyty.",
      })

      fetchCodes()
    } catch (error: any) {
      toast({
        title: "Błąd",
        description: "Nie udało się oznaczyć kodu jako użyty.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchCodes()
  }, [refreshTrigger])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-muted-foreground">Ładowanie kodów...</div>
      </div>
    )
  }

  if (codes.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-muted-foreground mb-2">Brak aktywnych kodów rabatowych</div>
        <div className="text-sm text-muted-foreground">Dodaj swój pierwszy kod, aby rozpocząć!</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {codes.map((code) => (
        <Card 
          key={code.id} 
          className={`transition-colors ${
            isExpiringSoon(code.expiry_date) 
              ? 'border-orange-200 bg-orange-50' 
              : ''
          }`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Store className="w-5 h-5" />
                {code.store_name}
              </CardTitle>
              {isExpiringSoon(code.expiry_date) && (
                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                  Wygasa wkrótce
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Ważny do: {formatDate(code.expiry_date)}</span>
            </div>
            
            {code.code && (
              <div className="flex items-center gap-2 text-sm">
                <Tag className="w-4 h-4" />
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                  {code.code}
                </span>
              </div>
            )}
            
            {code.conditions && (
              <div className="text-sm text-muted-foreground">
                <strong>Warunki:</strong> {code.conditions}
              </div>
            )}
            
            {code.min_amount && (
              <div className="text-sm text-muted-foreground">
                <strong>Min. kwota:</strong> {code.min_amount} zł
              </div>
            )}
            
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                {code.image_url && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <ImageIcon className="w-3 h-3" />
                    <span>Zdjęcie dostępne</span>
                  </div>
                )}
              </div>
              
              <Button
                size="sm"
                onClick={() => markAsUsed(code.id)}
                className="flex items-center gap-1"
              >
                <Check className="w-4 h-4" />
                Użyłem
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}