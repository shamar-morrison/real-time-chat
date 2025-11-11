import { RoomClient } from '@/app/rooms/[id]/_client'
import { getCurrentUser } from '@/lib/supabase/get-current-user'
import { createAdminClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { toast } from 'sonner'

export default async function RoomPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [room, user, messages] = await Promise.all([
    getRoom(id),
    getUser(),
    getMessages(id),
  ])

  if (!room || !user) {
    return notFound()
  }

  return <RoomClient room={room} user={user} messages={messages || []} />
}

async function getRoom(id: string) {
  const user = await getCurrentUser()
  if (!user) {
    toast.error('You must be logged in to view this page')
    return null
  }

  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('chat_room')
    .select('id, name, chat_room_member!inner ()')
    .eq('id', id)
    .eq('chat_room_member.member_id', user.id)
    .single()

  if (error) {
    toast.error('Error', {
      description: error.message,
    })
    return null
  }

  return data
}

async function getMessages(roomId: string) {
  const user = await getCurrentUser()
  if (!user) return null

  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('messages')
    .select(
      'id, text, created_at, author_id, deleted_at, edited_at, author:user_profile (name, image_url)',
    )
    .eq('chat_room_id', roomId)
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    toast.error('Error getting messages', {
      description: error.message,
    })
    return []
  }

  return data
}

async function getUser() {
  const supabase = createAdminClient()
  const user = await getCurrentUser()

  if (!user) {
    toast.error('You must be logged in to view this page')
    return null
  }

  const { data, error } = await supabase
    .from('user_profile')
    .select('id, name, image_url')
    .eq('id', user.id)
    .single()

  if (error) {
    toast.error('Error', {
      description: error.message,
    })
    return null
  }

  return data
}
