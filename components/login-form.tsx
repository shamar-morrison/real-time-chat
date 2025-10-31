'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { FaGithub, FaGoogle } from 'react-icons/fa'

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSocialLogin = async (
    provider: 'github' | 'google',
    e: React.FormEvent,
  ) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/oauth?next=/`,
          queryParams: {
            ...(provider === 'google' && {
              access_type: 'offline',
              prompt: 'consent',
            }),
          },
        },
      })

      if (error) throw error
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Welcome!</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {error && <p className="text-sm text-destructive-500">{error}</p>}
            <Button
              type="button"
              className="w-full"
              disabled={isLoading}
              onClick={(e: React.FormEvent) => handleSocialLogin('github', e)}
            >
              {isLoading ? (
                'Logging in...'
              ) : (
                <div className="flex gap-2 items-center">
                  <FaGithub />
                  Continue with GitHub
                </div>
              )}
            </Button>
            <Button
              type="button"
              className="w-full"
              disabled={isLoading}
              onClick={(e: React.FormEvent) => handleSocialLogin('google', e)}
            >
              {isLoading ? (
                'Logging in...'
              ) : (
                <div className="flex gap-2 items-center">
                  <FaGoogle />
                  Continue with Google
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
