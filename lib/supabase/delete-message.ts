'use server'

import { Message } from '@/app/rooms/[id]/_client'
import { getCurrentUser } from '@/lib/supabase/get-current-user'
import { createAdminClient } from '@/lib/supabase/server'

export async function deleteMessage(data: {
  messageId: string
}): Promise<
  { error: false; message: Message } | { error: true; message: string }
> {
  const user = await getCurrentUser()
  if (user == null) {
    return { error: true, message: 'User not authenticated' }
  }

  const supabase = await createAdminClient()

  // First, verify the user is the author of the message
  const { data: existingMessage, error: fetchError } = await supabase
    .from('messages')
    .select('author_id')
    .eq('id', data.messageId)
    .single()

  if (fetchError || !existingMessage) {
    return { error: true, message: 'Message not found' }
  }

  if (existingMessage.author_id !== user.id) {
    return {
      error: true,
      message: 'You can only delete your own messages',
    }
  }

  // Perform soft delete by setting deleted_at timestamp
  const { data: message, error } = await supabase
    .from('messages')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', data.messageId)
    .select(
      'id, text, created_at, author_id, deleted_at, author:user_profile (name, image_url)',
    )
    .single()

  if (error) {
    return { error: true, message: 'Failed to delete message' }
  }

  return { error: false, message }
}
