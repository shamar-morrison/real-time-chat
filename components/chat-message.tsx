'use client'

import { Message } from '@/app/rooms/[id]/_client'
import { cn } from '@/lib/utils'
import { User2Icon } from 'lucide-react'
import Image from 'next/image'
import { Ref } from 'react'
import { motion } from 'framer-motion'
import { slideUpVariants, fastStaggerContainerVariants, staggerItemVariants } from '@/lib/animations'

const DATE_FORMATTER = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export function ChatMessage({
  text,
  author,
  created_at,
  status,
  ref,
}: Message & {
  status?: 'pending' | 'error' | 'success'
  ref?: Ref<HTMLDivElement>
}) {
  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={slideUpVariants}
      className={cn(
        'flex gap-4 px-4 py-2 hover:bg-accent/50',
        status === 'pending' && 'opacity-70',
        status === 'error' && 'bg-destructive/10 text-destructive',
      )}
    >
      <motion.div className="shrink-0" variants={staggerItemVariants}>
        {author.image_url != null ? (
          <Image
            src={author.image_url}
            alt={author.name}
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <div className="size-10 rounded-full flex items-center justify-center border bg-muted text-muted-foreground overflow-hidden">
            <User2Icon className="size-[30px] mt-2.5" />
          </div>
        )}
      </motion.div>
      <motion.div
        className="grow space-y-0.5"
        variants={fastStaggerContainerVariants}
        initial="initial"
        animate="animate"
      >
        <motion.div className="flex items-baseline gap-2" variants={staggerItemVariants}>
          <span className="text-sm font-semibold">{author.name}</span>
          <span className="text-xs text-muted-foreground">
            {DATE_FORMATTER.format(new Date(created_at))}
          </span>
        </motion.div>
        <motion.p
          className="text-sm wrap-break-words whitespace-pre"
          variants={staggerItemVariants}
        >
          {text}
        </motion.p>
      </motion.div>
    </motion.div>
  )
}
