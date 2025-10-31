'use client'

import { LogoutButton } from '@/components/logout-button'
import { ModeToggle } from '@/components/mode-toggle'
import { Spinner } from '@/components/ui/spinner'
import { useCurrentUser } from '@/hooks/use-current-user'
import Link from 'next/link'

export function Navbar() {
  const { isLoading, user } = useCurrentUser()
  return (
    <div className="border-b bg-background h-header">
      <nav className="container mx-auto justify-between items-center px-4 flex h-full gap-4">
        <Link href="/" className="text-xl font-bold">
          LinaChat
        </Link>

        <div className="flex items-center gap-3">
          <ModeToggle />
          {isLoading ? (
            <Spinner />
          ) : !user ? (
            <></>
          ) : (
            <>
              <span className="text-sm text-muted-foreground">
                Hello, {user.email}
              </span>
              <LogoutButton />
            </>
          )}
        </div>
      </nav>
    </div>
  )
}
