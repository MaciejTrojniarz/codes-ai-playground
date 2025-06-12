import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { AlertTriangle } from 'lucide-react'
import type { DiscountCode } from '@/lib/types'

interface DeleteCodeDialogProps {
  code: DiscountCode | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onCodeDeleted: () => void
}

export function DeleteCodeDialog({ code, open, onOpenChange, onCodeDeleted }: DeleteCodeDialogProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    if (!code) return

    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Nie jesteś zalogowany')

      // Delete image from storage if exists
      if (code.image_url) {
        const fileName = code.image_url.split('/').pop()
        if (fileName) {
          await supabase.storage
            .from('receipts')
            .remove([`${user.id}/${fileName}`])
        }
      }

      // Delete discount code from database
      const { error } = await supabase
        .from('discount_codes')
        .delete()
        .eq('id', code.id)

      if (error) throw error

      toast({
        title: "Sukces",
        description: "Kod rabatowy został usunięty.",
      })

      onOpenChange(false)
      onCodeDeleted()
    } catch (error: any) {
      toast({
        title: "Błąd",
        description: "Nie udało się usunąć kodu rabatowego.",
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
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Usuń kod rabatowy
          </DialogTitle>
          <DialogDescription>
            Czy na pewno chcesz usunąć kod rabatowy dla sklepu <strong>{code.store_name}</strong>?
            Ta akcja jest nieodwracalna.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="text-sm text-red-800">
              <strong>Uwaga:</strong> Usunięcie kodu spowoduje również usunięcie powiązanego zdjęcia paragonu.
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Anuluj
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Usuwanie...' : 'Usuń kod'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}