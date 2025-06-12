import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { X, ZoomIn, ZoomOut } from 'lucide-react'

interface PhotoViewerProps {
  imageUrl: string | null
  storeName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PhotoViewer({ imageUrl, storeName, open, onOpenChange }: PhotoViewerProps) {
  const [zoom, setZoom] = React.useState(1)

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5))
  }

  const resetZoom = () => {
    setZoom(1)
  }

  React.useEffect(() => {
    if (!open) {
      setZoom(1)
    }
  }, [open])

  if (!imageUrl) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Zdjęcie paragonu - {storeName}</DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center justify-center gap-2 px-6 pb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoom <= 0.5}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={resetZoom}
          >
            {Math.round(zoom * 100)}%
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoom >= 3}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-auto p-6 pt-2">
          <div className="flex justify-center">
            <img
              src={imageUrl}
              alt={`Paragon z ${storeName}`}
              className="max-w-full h-auto transition-transform duration-200 cursor-move"
              style={{ transform: `scale(${zoom})` }}
              draggable={false}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}