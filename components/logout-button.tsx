'use client'

import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { LoaderCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function LogoutButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const logout = async () => {
    try {
      setIsLoading(true)
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/auth/login')
    } catch (_err) {
    } finally {
      setTimeout(() => setIsLoading(false), 250) // cleaner animation
    }
  }

  return (
    <Button
      onClick={logout}
      className={cn('w-28', isLoading && 'pointer-events-none opacity-50')}
    >
      {isLoading ? (
        <LoaderCircle className={cn('animate-spin repeat-infinite')} />
      ) : (
        <span>Logout</span>
      )}
    </Button>
  )
}
