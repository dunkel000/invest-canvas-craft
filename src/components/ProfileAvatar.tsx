import { useState, useEffect } from "react"
import { User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"

interface Profile {
  id: string
  user_id: string
  display_name: string | null
  avatar_url: string | null
}

export function ProfileAvatar() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  
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
    <Avatar className="h-8 w-8">
      <AvatarImage src={profile?.avatar_url || undefined} alt="Profile" />
      <AvatarFallback className="text-xs">
        {profile?.display_name || user?.email ? getInitials() : <User className="h-4 w-4" />}
      </AvatarFallback>
    </Avatar>
  )
}