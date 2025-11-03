'use client'

import { JoinRoomButton } from '@/components/join-room-button'
import { LeaveRoomButton } from '@/components/leave-room-button'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cardHoverVariants } from '@/lib/animations'
import { motion } from 'framer-motion'
import Link from 'next/link'

/**
 * Animated room card with hover effects
 */
export function AnimatedRoomCard({
  id,
  name,
  member_count,
  isJoined,
}: {
  id: string
  name: string
  member_count: number
  isJoined: boolean
}) {
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={cardHoverVariants}
    >
      <Card className="h-full">
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <CardDescription>
            {member_count} {member_count === 1 ? 'member' : 'members'}
          </CardDescription>
        </CardHeader>
        <CardFooter className="gap-2 flex-col">
          {isJoined ? (
            <>
              <Button asChild className="w-full grow" size="sm">
                <Link href={`/rooms/${id}`}>Enter</Link>
              </Button>
              <LeaveRoomButton
                roomId={id}
                size="sm"
                variant="secondary"
                className="w-full"
              >
                Leave
              </LeaveRoomButton>
            </>
          ) : (
            <JoinRoomButton
              roomId={id}
              variant="outline"
              className="w-full"
              size="sm"
            >
              Join
            </JoinRoomButton>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}
