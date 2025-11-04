'use client'

import { LogoutButton } from '@/components/logout-button'
import { ModeToggle } from '@/components/mode-toggle'
import { Spinner } from '@/components/ui/spinner'
import { useCurrentUser } from '@/hooks/use-current-user'
import { fadeInVariants, slideDownVariants } from '@/lib/animations'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'

export function Navbar() {
  const { isLoading, user } = useCurrentUser()
  return (
    <motion.div
      className="border-b bg-background h-header"
      initial="initial"
      animate="animate"
      variants={slideDownVariants}
    >
      <nav className="container mx-auto justify-between items-center px-4 flex h-full gap-4">
        <Link href="/" className="text-xl font-bold">
          LinaChat
        </Link>

        <div className="flex items-center gap-3">
          <ModeToggle />
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fadeInVariants}
              >
                <Spinner />
              </motion.div>
            ) : !user ? (
              <></>
            ) : (
              <motion.div
                key="user"
                className="flex items-center gap-3"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fadeInVariants}
              >
                <span className="text-sm text-muted-foreground hidden md:block">
                  Hello, {user.user_metadata.name || user.email}
                </span>
                <LogoutButton />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </motion.div>
  )
}
