'use server'

import { createRoomSchema } from '@/app/rooms/new/page'
import { getCurrentUser } from '@/lib/supabase/get-current-user'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/dist/client/components/navigation.react-server'
import z from 'zod'

export async function createRoom(unsafeData: z.infer<typeof createRoomSchema>) {
  const { success, data } = createRoomSchema.safeParse(unsafeData)

  if (!success) {
    return { error: true, message: 'Invalid room data' }
  }

  const user = await getCurrentUser()
  if (!user) {
    return { error: true, message: 'User not authenticated' }
  }

  const supabase = await createClient()

  // create room
  const { data: room, error: roomError } = await supabase
    .from('chat_room')
    .insert({ name: data.name, is_public: data.isPublic })
    .select('id')
    .single()

  if (roomError || !room) {
    return { error: true, message: 'Failed to create room' }
  }

  // add user to room
  const { error: membershipError } = await supabase
    .from('chat_room_member')
    .insert({ chat_room_id: room.id, member_id: user.id })

  if (membershipError) {
    return { error: true, message: 'Error adding member to room' }
  }

  redirect(`/rooms/${room.id}`)
}
