'use client'

import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'

export const useCurrentUser = () => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    const supabase = createClient()

    supabase.auth
      .getUser()
      .then(({ error, data }) => {
        if (error || !data?.user) {
          redirect('/auth/login')
        }
        setUser(data.user)
      })
      .finally(() => setIsLoading(false))

    const { data } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      data.subscription.unsubscribe()
    }
  }, [])

  return { user, isLoading }
}
