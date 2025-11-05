'use client'

import { useUser } from '@/contexts/user-context'

/**
 * Hook to get the current authenticated user
 * @deprecated Use `useUser` from '@/contexts/user-context' instead
 * This hook is kept for backward compatibility
 */
export const useCurrentUser = () => {
  return useUser()
}
