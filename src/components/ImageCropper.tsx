import { useState, useRef, useCallback } from 'react'
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import 'react-image-crop/dist/ReactCrop.css'

interface ImageCropperProps {
  isOpen: boolean
  onClose: () => void
  imageSrc: string
  onCropComplete: (croppedImageBlob: Blob) => void
  fileName: string
}

export function ImageCropper({ isOpen, onClose, imageSrc, onCropComplete, fileName }: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 50,
    height: 50,
    x: 25,
    y: 25,
  })
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const imgRef = useRef<HTMLImageElement>(null)

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    const size = Math.min(width, height)
    const x = (width - size) / 2
    const y = (height - size) / 2
    
    setCrop({
      unit: 'px',
      width: size,
      height: size,
      x: x,
      y: y,
    })
  }, [])

  const getCroppedImg = useCallback(
    (image: HTMLImageElement, crop: PixelCrop): Promise<Blob> => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        throw new Error('No 2d context')
      }

      const scaleX = image.naturalWidth / image.width
      const scaleY = image.naturalHeight / image.height

      // Set canvas size to a fixed square size for consistent avatars
      const outputSize = 200
      canvas.width = outputSize
      canvas.height = outputSize

      ctx.imageSmoothingQuality = 'high'

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        outputSize,
        outputSize
      )

      return new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas is empty'))
              return
            }
            resolve(blob)
          },
          'image/jpeg',
          0.9
        )
      })
    },
    []
  )

  const handleCropComplete = useCallback(async () => {
    if (completedCrop && imgRef.current) {
      try {
        const croppedImageBlob = await getCroppedImg(imgRef.current, completedCrop)
        onCropComplete(croppedImageBlob)
        onClose()
      } catch (error) {
        console.error('Error cropping image:', error)
      }
    }
  }, [completedCrop, getCroppedImg, onCropComplete, onClose])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Crop Avatar Image</DialogTitle>
        </DialogHeader>
        
        <div className="flex justify-center">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={1}
            circularCrop
          >
            <img
              ref={imgRef}
              src={imageSrc}
              onLoad={onImageLoad}
              style={{ maxHeight: '400px', maxWidth: '100%' }}
              alt="Crop preview"
            />
          </ReactCrop>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCropComplete} disabled={!completedCrop}>
            Use This Image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}