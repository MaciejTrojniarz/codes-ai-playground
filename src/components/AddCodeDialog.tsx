import React, { useState } from 'react'
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
  DialogTrigger,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { Plus, Upload } from 'lucide-react'

interface AddCodeDialogProps {
  onCodeAdded: () => void
}

export function AddCodeDialog({ onCodeAdded }: AddCodeDialogProps) {
  const [open, setOpen] = useState(false)
  const [storeName, setStoreName] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [code, setCode] = useState('')
  const [conditions, setConditions] = useState('')
  const [minAmount, setMinAmount] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const resetForm = () => {
    setStoreName('')
    setExpiryDate('')
    setCode('')
    setConditions('')
    setMinAmount('')
    setImage(null)
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
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!code && !image) {
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

      let imageUrl = null

      // Upload image if provided
      if (image) {
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
      }

      // Insert discount code
      const { error } = await supabase
        .from('discount_codes')
        .insert({
          user_id: user.id,
          store_name: storeName,
          expiry_date: expiryDate,
          code: code || null,
          conditions: conditions || null,
          min_amount: minAmount ? parseFloat(minAmount) : null,
          image_url: imageUrl,
          status: 'active'
        })

      if (error) throw error

      toast({
        title: "Sukces",
        description: "Kod rabatowy został dodany.",
      })

      resetForm()
      setOpen(false)
      onCodeAdded()
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Dodaj kod
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Dodaj nowy kod rabatowy</DialogTitle>
          <DialogDescription>
            Wypełnij formularz, aby dodać nowy kod rabatowy. Musisz podać kod tekstowy lub zdjęcie paragonu.
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
                value={code}
                onChange={(e) => setCode(e.target.value)}
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
              <Label htmlFor="image">Zdjęcie paragonu</Label>
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
                  {image ? image.name : 'Wybierz zdjęcie'}
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Dodawanie...' : 'Dodaj kod'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}