import { createClient } from '@/lib/supabase/server'
import { cache } from 'react'

async function currentUser() {
  const supabase = await createClient()
  return await supabase.auth.getUser().then(({ data }) => data.user)
}

export const getCurrentUser = cache(currentUser)
