import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/integrations/supabase/client"
import { Upload, Save } from "lucide-react"
import { ImageCropper } from "./ImageCropper"

interface Profile {
  id: string
  user_id: string
  display_name: string | null
  avatar_url: string | null
}

export function ProfileSettings() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [displayName, setDisplayName] = useState("")
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [cropperOpen, setCropperOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string>("")
  const [selectedFileName, setSelectedFileName] = useState<string>("")
  
  useEffect(() => {
    if (user?.id) {
      fetchProfile()
    }
  }, [user?.id])

  const fetchProfile = async () => {
    if (!user?.id) return
    
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()
    
    if (data) {
      setProfile(data)
      setDisplayName(data.display_name || "")
    }
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return
      }

      const file = event.target.files[0]
      
      // Validate file type - only allow JPG, PNG, GIF
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
      if (!allowedTypes.includes(file.type.toLowerCase())) {
        toast({
          title: "Invalid file type",
          description: "Please select a JPG, PNG, or GIF image.",
          variant: "destructive",
        })
        return
      }

      // Validate file size (5MB = 5 * 1024 * 1024 bytes)
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        toast({
          title: "File too large", 
          description: "Image must be smaller than 5MB. Please choose a smaller file.",
          variant: "destructive",
        })
        return
      }

      const imageUrl = URL.createObjectURL(file)
      setSelectedImage(imageUrl)
      setSelectedFileName(file.name)
      setCropperOpen(true)
    } catch (error) {
      toast({
        title: "Error",
        description: "Error selecting file.",
        variant: "destructive",
      })
    } finally {
      // Reset the input value so the same file can be selected again
      event.target.value = ''
    }
  }

  const uploadCroppedAvatar = async (croppedImageBlob: Blob) => {
    try {
      setUploading(true)
      
      const fileExt = selectedFileName.split('.').pop() || 'jpg'
      const filePath = `${user?.id}/avatar.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, croppedImageBlob, { upsert: true })

      if (uploadError) {
        throw uploadError
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Add timestamp to force cache invalidation
      const avatarUrl = `${data.publicUrl}?t=${Date.now()}`

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('user_id', user?.id)

      if (updateError) {
        throw updateError
      }

      // Force refresh the profile data
      await fetchProfile()
      
      toast({
        title: "Success",
        description: "Avatar uploaded successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error uploading avatar",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
      // Clean up
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage)
        setSelectedImage("")
        setSelectedFileName("")
      }
    }
  }

  const updateProfile = async () => {
    try {
      setSaving(true)
      
      const { error } = await supabase
        .from('profiles')
        .update({ display_name: displayName })
        .eq('user_id', user?.id)

      if (error) {
        throw error
      }

      setProfile(prev => prev ? { ...prev, display_name: displayName } : null)
      
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      })
    } catch (error) {
      toast({
        title: "Error", 
        description: error instanceof Error ? error.message : "Error updating profile",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const getInitials = () => {
    if (profile?.display_name) {
      return profile.display_name
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    if (user?.email) {
      return user.email[0].toUpperCase()
    }
    return 'U'
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile?.avatar_url || undefined} alt="Profile" />
              <AvatarFallback className="text-lg">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <Label htmlFor="avatar-upload" className="cursor-pointer">
                <Button variant="outline" disabled={uploading} asChild>
                  <span>
                    <Upload className="mr-2 h-4 w-4" />
                    {uploading ? "Uploading..." : "Upload Avatar"}
                  </span>
                </Button>
              </Label>
              <Input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground mt-2">
                JPG, PNG, or GIF. Maximum 5MB.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="display-name">Display Name</Label>
            <Input
              id="display-name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your display name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={user?.email || ""}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed from this page.
            </p>
          </div>

          <Button onClick={updateProfile} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      <ImageCropper
        isOpen={cropperOpen}
        onClose={() => {
          setCropperOpen(false)
          if (selectedImage) {
            URL.revokeObjectURL(selectedImage)
            setSelectedImage("")
            setSelectedFileName("")
          }
        }}
        imageSrc={selectedImage}
        onCropComplete={uploadCroppedAvatar}
        fileName={selectedFileName}
      />
    </div>
  )
}