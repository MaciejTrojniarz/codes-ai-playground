import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { formatDate, isExpiringSoon } from '@/lib/utils'
import { Check, Calendar, Store, Tag, Image as ImageIcon, Edit, Trash2, Eye } from 'lucide-react'
import { PhotoViewer } from './PhotoViewer'
import { EditCodeDialog } from './EditCodeDialog'
import { DeleteCodeDialog } from './DeleteCodeDialog'
import type { DiscountCode } from '@/lib/types'

interface CodeListProps {
  refreshTrigger: number
}

export function CodeList({ refreshTrigger }: CodeListProps) {
  const [codes, setCodes] = useState<DiscountCode[]>([])
  const [loading, setLoading] = useState(true)
  const [photoViewerOpen, setPhotoViewerOpen] = useState(false)
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null)
  const [selectedStoreName, setSelectedStoreName] = useState('')
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCode, setSelectedCode] = useState<DiscountCode | null>(null)
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

  const handleViewPhoto = (imageUrl: string, storeName: string) => {
    setSelectedImageUrl(imageUrl)
    setSelectedStoreName(storeName)
    setPhotoViewerOpen(true)
  }

  const handleEditCode = (code: DiscountCode) => {
    setSelectedCode(code)
    setEditDialogOpen(true)
  }

  const handleDeleteCode = (code: DiscountCode) => {
    setSelectedCode(code)
    setDeleteDialogOpen(true)
  }

  const handleCodeUpdated = () => {
    fetchCodes()
  }

  const handleCodeDeleted = () => {
    fetchCodes()
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
    <>
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
                <div className="flex items-center gap-2">
                  {isExpiringSoon(code.expiry_date) && (
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                      Wygasa wkrótce
                    </span>
                  )}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditCode(code)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCode(code)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewPhoto(code.image_url!, code.store_name)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      <ImageIcon className="w-3 h-3" />
                      Pokaż zdjęcie
                    </Button>
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

      <PhotoViewer
        imageUrl={selectedImageUrl}
        storeName={selectedStoreName}
        open={photoViewerOpen}
        onOpenChange={setPhotoViewerOpen}
      />

      <EditCodeDialog
        code={selectedCode}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onCodeUpdated={handleCodeUpdated}
      />

      <DeleteCodeDialog
        code={selectedCode}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onCodeDeleted={handleCodeDeleted}
      />
    </>
  )
}