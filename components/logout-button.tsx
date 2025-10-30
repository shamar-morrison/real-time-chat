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
      // error state
    } finally {
      setTimeout(() => setIsLoading(false), 250) // cleaner animation
    }
  }

  return (
    <Button onClick={logout} disabled={isLoading} className={'w-28'}>
      {isLoading ? (
        <LoaderCircle className={cn('animate-spin repeat-infinite')} />
      ) : (
        <span>Logout</span>
      )}
    </Button>
  )
}
