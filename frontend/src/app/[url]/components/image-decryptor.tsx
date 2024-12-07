'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import Icon from './Icon'
import { toast } from 'sonner'
import { CipherType } from '@/lib/types'
import { Select
, SelectTrigger, SelectValue, SelectContent, SelectItem
 } from '@/components/ui/select'
import { validateKey } from '@/lib/utils'

export default function ImageDecryptor({image, url}: {image: string, url: string}) {
  const [isDecryptDialogOpen, setIsDecryptDialogOpen] = useState(false)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [decryptionKey, setDecryptionKey] = useState('')
  const [decryptedImage, setDecryptedImage] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [cipherType, setCipherType] = useState<CipherType>(CipherType.Caesar);
  const handleDecrypt = () => {
    const response = fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/url/${url}/decrypted-image?key=${decryptionKey}`);
        response.then(async (res) => {
            const data = await res.json();
            if(!data.success)
            {
                toast(data.message)
                return;
            }
            setDecryptedImage(data.image)
            setIsDecryptDialogOpen(false)
            setDecryptionKey('')
        });
  }
  const resetInputState = () => {
    setDecryptionKey('')
    setSelectedImage(null)
  }
  useEffect(() => {
    resetInputState()
  }, [isUploadDialogOpen, isDecryptDialogOpen])
  const handleUpload = async() => {
      if(!validateKey(cipherType, decryptionKey)) {
      toast("key must be a number between 1 and 65536")
      return;
    }
    if (selectedImage) {
        // convert image to base64
        const reader = new FileReader();
        reader.onload = async function(e) {
            const base64Image = e.target?.result as string;
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/url/${url}/image`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    image: base64Image,
                    key: decryptionKey,
                    type: cipherType,
                }),
            });
            const data = await response.json();
            if(!data.success)
            {
                toast(data.message)
                return;
            }
            toast(data.message)
            setDecryptedImage(base64Image)
            setIsUploadDialogOpen(false)
            setSelectedImage(null)
        }
        reader.readAsDataURL(selectedImage);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="relative w-full aspect-video">

{decryptedImage ? <Image
            src={decryptedImage || "https://via.placeholder.com/400x225"}
            alt="Placeholder"
            layout="fill"
            objectFit="cover"
            className="rounded-lg" /> : <Icon  text={image ? "Decrypt Image" : "No Image"} />}
          
        </div>
        <div className="flex justify-between">
          <Button disabled={!image || !!decryptedImage} onClick={() => setIsDecryptDialogOpen(true)}>Decrypt</Button>
          <Button onClick={() => setIsUploadDialogOpen(true)}>Upload</Button>
        </div>
      </div>

      <Dialog open={isDecryptDialogOpen}  onOpenChange={setIsDecryptDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Decryption Key</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="decryption-key">Decryption Key</Label>
            <Input
              id="decryption-key"
              value={decryptionKey}
              onChange={(e) => setDecryptionKey(e.target.value)}
              placeholder="Enter your decryption key"
            />
          </div>
          <DialogFooter>
            <Button disabled={!!decryptedImage} onClick={handleDecrypt}>Decrypt</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Image</DialogTitle>
          </DialogHeader>
          <div className="pt-4">
          <Label htmlFor="cipher">Select Cipher</Label>
          <Select value={cipherType}
          onValueChange={(v) => setCipherType(v as CipherType)}
           name='cipher'>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="cipher" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(CipherType).map((type) => (
                <SelectItem value={type} key={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          </div>
          <div className="pb-2">
            <Label htmlFor="image-upload">Select Image</Label>
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
            />
          </div>
            <div className="pb-4">
                <Label htmlFor="decryption-key">Decryption Key</Label>
                <Input
                id="decryption-key"
                value={decryptionKey}
                onChange={(e) => setDecryptionKey(e.target.value)}
                placeholder="Enter your decryption key"
                />
            </div>
          <DialogFooter>
            <Button onClick={handleUpload} disabled={!selectedImage || !cipherType || !decryptionKey}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}