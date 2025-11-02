'use server'

import { createRoomSchema } from '@/lib/schemas/room'
import { getCurrentUser } from '@/lib/supabase/get-current-user'
import { createAdminClient } from '@/lib/supabase/server'
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

  const supabase = createAdminClient()

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

export async function addUserToRoom({
  roomId,
  userId,
}: {
  roomId: string
  userId: string
}) {
  const currentUser = await getCurrentUser()
  if (currentUser == null) {
    return { error: true, message: 'User not authenticated' }
  }

  const supabase = createAdminClient()

  const { data: roomMembership, error: roomMembershipError } = await supabase
    .from('chat_room_member')
    .select('member_id')
    .eq('chat_room_id', roomId)
    .eq('member_id', currentUser.id)
    .single()

  if (roomMembershipError || !roomMembership) {
    return { error: true, message: 'Current user is not a member of the room' }
  }

  const { data: userProfile } = await supabase
    .from('user_profile')
    .select('id')
    .eq('id', userId)
    .single()

  if (userProfile == null) {
    return { error: true, message: 'User not found' }
  }

  const { data: existingMembership } = await supabase
    .from('chat_room_member')
    .select('member_id')
    .eq('chat_room_id', roomId)
    .eq('member_id', userProfile.id)
    .single()

  if (existingMembership) {
    return { error: true, message: 'User is already a member of the room' }
  }

  const { error: insertError } = await supabase
    .from('chat_room_member')
    .insert({ chat_room_id: roomId, member_id: userProfile.id })

  if (insertError) {
    return { error: true, message: 'Failed to add user to room' }
  }

  return { error: false, message: 'User added to room successfully' }
}
