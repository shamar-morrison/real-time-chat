'use client'

import { Message } from '@/app/rooms/[id]/_client'
import { cn } from '@/lib/utils'
import { MoreVertical, Trash2, User2Icon } from 'lucide-react'
import Image from 'next/image'
import { Ref, useState } from 'react'
import { motion } from 'framer-motion'
import { slideUpVariants, fastStaggerContainerVariants, staggerItemVariants } from '@/lib/animations'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { deleteMessage } from '@/lib/supabase/delete-message'
import { toast } from 'sonner'
import { LoadingSwap } from '@/components/ui/loading-swap'

const DATE_FORMATTER = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export function ChatMessage({
  id,
  text,
  author,
  author_id,
  created_at,
  deleted_at,
  status,
  currentUserId,
  ref,
}: Message & {
  status?: 'pending' | 'error' | 'success'
  currentUserId?: string
  ref?: Ref<HTMLDivElement>
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const isOwnMessage = currentUserId === author_id
  const isDeleted = deleted_at !== null

  async function handleDelete() {
    setIsDeleting(true)
    try {
      const result = await deleteMessage({ messageId: id })
      if (result.error) {
        toast.error(result.message)
      }
      setShowDeleteDialog(false)
      setIsDropdownOpen(false)
    } catch (error) {
      toast.error('Failed to delete message')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <motion.div
        ref={ref}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={slideUpVariants}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          'flex gap-4 px-4 py-2 hover:bg-accent/50 group relative',
          status === 'pending' && 'opacity-70',
          status === 'error' && 'bg-destructive/10 text-destructive',
        )}
        data-is-own-message={isOwnMessage}
        data-is-deleted={isDeleted}
        data-is-hovered={isHovered}
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
            className={cn(
              "text-sm wrap-break-words whitespace-pre",
              isDeleted && "italic text-muted-foreground"
            )}
            variants={staggerItemVariants}
          >
            {isDeleted ? 'This message has been deleted' : text}
          </motion.p>
        </motion.div>

        {/* Show dropdown menu only for own messages that aren't deleted */}
        {isOwnMessage && !isDeleted && (
          <div className={cn(
            "absolute right-4 top-2 transition-opacity duration-150",
            isHovered || isDropdownOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}>
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </motion.div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete message?</AlertDialogTitle>
            <AlertDialogDescription>
              This message will be replaced with "This message has been deleted" for all members of the chat.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <LoadingSwap isLoading={isDeleting}>Delete</LoadingSwap>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
