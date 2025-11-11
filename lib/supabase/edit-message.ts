'use server'

import { Message } from '@/app/rooms/[id]/_client'
import { getCurrentUser } from '@/lib/supabase/get-current-user'
import { createAdminClient } from '@/lib/supabase/server'

export async function editMessage(data: {
  messageId: string
  newText: string
}): Promise<
  { error: false; message: Message } | { error: true; message: string }
> {
  const user = await getCurrentUser()
  if (user == null) {
    return { error: true, message: 'User not authenticated' }
  }

  if (!data.newText.trim()) {
    return { error: true, message: 'Message cannot be empty' }
  }

  const supabase = await createAdminClient()

  // First, verify the user is the author of the message
  const { data: existingMessage, error: fetchError } = await supabase
    .from('messages')
    .select('author_id, deleted_at')
    .eq('id', data.messageId)
    .single()

  if (fetchError || !existingMessage) {
    return { error: true, message: 'Message not found' }
  }

  if (existingMessage.author_id !== user.id) {
    return {
      error: true,
      message: 'You can only edit your own messages',
    }
  }

  if (existingMessage.deleted_at !== null) {
    return {
      error: true,
      message: 'Cannot edit a deleted message',
    }
  }

  // Update message text and set edited_at timestamp
  const { data: message, error } = await supabase
    .from('messages')
    .update({
      text: data.newText.trim(),
      edited_at: new Date().toISOString(),
    })
    .eq('id', data.messageId)
    .select(
      'id, text, created_at, author_id, deleted_at, edited_at, author:user_profile (name, image_url)',
    )
    .single()

  if (error) {
    return { error: true, message: 'Failed to edit message' }
  }

  return { error: false, message }
}
