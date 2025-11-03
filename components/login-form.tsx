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
import { motion, AnimatePresence } from 'framer-motion'
import { slideUpVariants, buttonPressVariants } from '@/lib/animations'

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingGithub, setIsLoadingGithub] = useState(false)
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false)

  const handleIsLoading = (provider: 'github' | 'google') => {
    setIsLoading(true)
    if (provider === 'github') {
      setIsLoadingGithub(true)
    } else {
      setIsLoadingGoogle(true)
    }
  }

  const handleSocialLogin = async (
    provider: 'github' | 'google',
    e: React.FormEvent,
  ) => {
    e.preventDefault()
    const supabase = createClient()
    handleIsLoading(provider)
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
            <AnimatePresence mode="wait">
              {error && (
                <motion.p
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={slideUpVariants}
                  className="text-sm text-destructive-500"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
            <motion.div
              initial="rest"
              whileHover={!isLoading ? "hover" : "rest"}
              whileTap={!isLoading ? "press" : "rest"}
              variants={buttonPressVariants}
            >
              <Button
                type="button"
                className="w-full"
                disabled={isLoading}
                onClick={(e: React.FormEvent) => handleSocialLogin('github', e)}
              >
                {isLoadingGithub ? (
                  'Logging in...'
                ) : (
                  <div className="flex gap-2 items-center">
                    <FaGithub />
                    Continue with GitHub
                  </div>
                )}
              </Button>
            </motion.div>
            <motion.div
              initial="rest"
              whileHover={!isLoading ? "hover" : "rest"}
              whileTap={!isLoading ? "press" : "rest"}
              variants={buttonPressVariants}
            >
              <Button
                type="button"
                className="w-full"
                disabled={isLoading}
                onClick={(e: React.FormEvent) => handleSocialLogin('google', e)}
              >
                {isLoadingGoogle ? (
                  'Logging in...'
                ) : (
                  <div className="flex gap-2 items-center">
                    <FaGoogle />
                    Continue with Google
                  </div>
                )}
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
