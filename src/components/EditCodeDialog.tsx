import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { Upload, Trash2 } from 'lucide-react'
import type { DiscountCode } from '@/lib/types'

interface EditCodeDialogProps {
  code: DiscountCode | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onCodeUpdated: () => void
}

export function EditCodeDialog({ code, open, onOpenChange, onCodeUpdated }: EditCodeDialogProps) {
  const [storeName, setStoreName] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [codeText, setCodeText] = useState('')
  const [conditions, setConditions] = useState('')
  const [minAmount, setMinAmount] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null)
  const [removeCurrentImage, setRemoveCurrentImage] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (code && open) {
      setStoreName(code.store_name)
      setExpiryDate(code.expiry_date)
      setCodeText(code.code || '')
      setConditions(code.conditions || '')
      setMinAmount(code.min_amount?.toString() || '')
      setCurrentImageUrl(code.image_url)
      setRemoveCurrentImage(false)
      setImage(null)
    }
  }, [code, open])

  const resetForm = () => {
    setStoreName('')
    setExpiryDate('')
    setCodeText('')
    setConditions('')
    setMinAmount('')
    setImage(null)
    setCurrentImageUrl(null)
    setRemoveCurrentImage(false)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Błąd",
          description: "Plik jest za duży. Maksymalny rozmiar to 5MB.",
          variant: "destructive",
        })
        return
      }
      setImage(file)
      setRemoveCurrentImage(false)
    }
  }

  const handleRemoveCurrentImage = () => {
    setRemoveCurrentImage(true)
    setImage(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!code) return

    if (!codeText && !image && !currentImageUrl && removeCurrentImage) {
      toast({
        title: "Błąd",
        description: "Musisz podać kod tekstowy lub zdjęcie paragonu.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Nie jesteś zalogowany')

      let imageUrl = currentImageUrl

      // Handle image upload/removal
      if (image) {
        // Upload new image
        const fileExt = image.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('receipts')
          .upload(fileName, image)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('receipts')
          .getPublicUrl(fileName)

        imageUrl = publicUrl

        // Remove old image if exists
        if (currentImageUrl) {
          const oldFileName = currentImageUrl.split('/').pop()
          if (oldFileName) {
            await supabase.storage
              .from('receipts')
              .remove([`${user.id}/${oldFileName}`])
          }
        }
      } else if (removeCurrentImage && currentImageUrl) {
        // Remove current image
        const fileName = currentImageUrl.split('/').pop()
        if (fileName) {
          await supabase.storage
            .from('receipts')
            .remove([`${user.id}/${fileName}`])
        }
        imageUrl = null
      }

      // Update discount code
      const { error } = await supabase
        .from('discount_codes')
        .update({
          store_name: storeName,
          expiry_date: expiryDate,
          code: codeText || null,
          conditions: conditions || null,
          min_amount: minAmount ? parseFloat(minAmount) : null,
          image_url: imageUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', code.id)

      if (error) throw error

      toast({
        title: "Sukces",
        description: "Kod rabatowy został zaktualizowany.",
      })

      resetForm()
      onOpenChange(false)
      onCodeUpdated()
    } catch (error: any) {
      toast({
        title: "Błąd",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!code) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edytuj kod rabatowy</DialogTitle>
          <DialogDescription>
            Zaktualizuj dane kodu rabatowego. Musisz podać kod tekstowy lub zdjęcie paragonu.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">Nazwa sklepu *</Label>
              <Input
                id="storeName"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Data ważności *</Label>
              <Input
                id="expiryDate"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="code">Kod rabatowy</Label>
              <Input
                id="code"
                value={codeText}
                onChange={(e) => setCodeText(e.target.value)}
                placeholder="np. RABAT20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="conditions">Warunki promocji</Label>
              <Input
                id="conditions"
                value={conditions}
                onChange={(e) => setConditions(e.target.value)}
                placeholder="np. tylko dla nowych klientów"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="minAmount">Minimalna kwota zakupu (zł)</Label>
              <Input
                id="minAmount"
                type="number"
                step="0.01"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                placeholder="np. 100.00"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Zdjęcie paragonu</Label>
              
              {currentImageUrl && !removeCurrentImage && (
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Aktualne zdjęcie</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveCurrentImage}
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Usuń
                  </Button>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('image')?.click()}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {image ? image.name : 'Wybierz nowe zdjęcie'}
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Zapisywanie...' : 'Zapisz zmiany'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}