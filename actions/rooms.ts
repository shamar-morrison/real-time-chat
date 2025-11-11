'use server'

import { createRoomSchema, roomCodeSchema } from '@/lib/schemas/room'
import { getCurrentUser } from '@/lib/supabase/get-current-user'
import { createAdminClient } from '@/lib/supabase/server'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/dist/client/components/navigation.react-server'
import z from 'zod'

// Helper function to generate unique room invite codes
async function generateRoomCode(): Promise<string> {
  const supabase = createAdminClient()
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

  // Try up to 10 times to generate a unique code
  for (let attempt = 0; attempt < 10; attempt++) {
    // Generate 12-character code
    let code = ''
    for (let i = 0; i < 12; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length))
    }

    // Check if code already exists
    const { data } = await supabase
      .from('chat_room')
      .select('id')
      .eq('invite_code', code)
      .single()

    if (!data) {
      return code
    }
  }

  throw new Error('Failed to generate unique room code')
}

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

  let passwordHash: string | null = null
  if (!data.isPublic && data.password) {
    passwordHash = await bcrypt.hash(data.password, 10)
  }

  // Generate unique invite code
  const inviteCode = await generateRoomCode()

  const { data: room, error: roomError } = await supabase
    .from('chat_room')
    .insert({
      name: data.name,
      is_public: data.isPublic,
      password_hash: passwordHash,
      invite_code: inviteCode,
    })
    .select('id, invite_code')
    .single()

  if (roomError || !room) {
    return { error: true, message: 'Failed to create room' }
  }

  // add user to chat_room table
  const { error: membershipError } = await supabase
    .from('chat_room_member')
    .insert({ chat_room_id: room.id, member_id: user.id })

  if (membershipError) {
    return { error: true, message: 'Error adding member to room' }
  }

  // Return invite code to display to user
  return { error: false, roomId: room.id, inviteCode: room.invite_code }
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

export async function verifyPasswordAndJoinRoom({
  roomId,
  password,
}: {
  roomId: string
  password: string
}) {
  const user = await getCurrentUser()
  if (!user) {
    return { error: true, message: 'User not authenticated' }
  }

  const supabase = createAdminClient()

  // Get room with password hash
  const { data: room, error: roomError } = await supabase
    .from('chat_room')
    .select('id, password_hash, is_public')
    .eq('id', roomId)
    .single()

  if (roomError || !room) {
    return { error: true, message: 'Room not found' }
  }

  // Check if room requires password
  if (!room.is_public && room.password_hash) {
    const isPasswordValid = await bcrypt.compare(password, room.password_hash)
    if (!isPasswordValid) {
      return { error: true, message: 'Incorrect password' }
    }
  }

  // Check if user is already a member
  const { data: existingMembership } = await supabase
    .from('chat_room_member')
    .select('member_id')
    .eq('chat_room_id', roomId)
    .eq('member_id', user.id)
    .single()

  if (existingMembership) {
    return { error: true, message: 'You are already a member of this room' }
  }

  // Add user to room
  const { error: membershipError } = await supabase
    .from('chat_room_member')
    .insert({ chat_room_id: roomId, member_id: user.id })

  if (membershipError) {
    return { error: true, message: 'Failed to join room' }
  }

  return { error: false, message: 'Successfully joined room' }
}

export async function joinRoomByCode(unsafeCode: string) {
  const { success, data: code } = roomCodeSchema.safeParse(unsafeCode)

  if (!success) {
    return { error: true, message: 'Invalid room code format' }
  }

  const user = await getCurrentUser()
  if (!user) {
    return { error: true, message: 'User not authenticated' }
  }

  const supabase = createAdminClient()

  // Find room by invite code
  const { data: room, error: roomError } = await supabase
    .from('chat_room')
    .select('id, name, password_hash, is_public')
    .eq('invite_code', code)
    .single()

  if (roomError || !room) {
    return { error: true, message: 'Invalid room code' }
  }

  // Check if user is already a member
  const { data: existingMembership } = await supabase
    .from('chat_room_member')
    .select('member_id')
    .eq('chat_room_id', room.id)
    .eq('member_id', user.id)
    .single()

  if (existingMembership) {
    return { error: true, message: 'You are already a member of this room' }
  }

  // If room has password, redirect to password entry
  if (!room.is_public && room.password_hash) {
    return {
      error: false,
      requiresPassword: true,
      roomId: room.id,
      roomName: room.name,
    }
  }

  // Add user to room immediately if no password
  const { error: membershipError } = await supabase
    .from('chat_room_member')
    .insert({ chat_room_id: room.id, member_id: user.id })

  if (membershipError) {
    return { error: true, message: 'Failed to join room' }
  }

  return {
    error: false,
    requiresPassword: false,
    roomId: room.id,
    message: 'Successfully joined room',
  }
}

export async function regenerateRoomCode(roomId: string) {
  const user = await getCurrentUser()
  if (!user) {
    return { error: true, message: 'User not authenticated' }
  }

  const supabase = createAdminClient()

  // Get room details and check rate limit
  const { data: room, error: roomError } = await supabase
    .from('chat_room')
    .select('id, code_regenerated_at, chat_room_member!inner(member_id)')
    .eq('id', roomId)
    .single()

  if (roomError || !room) {
    return { error: true, message: 'Room not found' }
  }

  // Check if user is a member (for now, any member can see this, but we'll verify creator status)
  // We need to find the room creator - the first member added
  const { data: members, error: membersError } = await supabase
    .from('chat_room_member')
    .select('member_id, created_at')
    .eq('chat_room_id', roomId)
    .order('created_at', { ascending: true })

  if (membersError || !members || members.length === 0) {
    return { error: true, message: 'Failed to verify room membership' }
  }

  // First member is the creator
  const creatorId = members[0].member_id
  if (creatorId !== user.id) {
    return { error: true, message: 'Only the room creator can regenerate the code' }
  }

  // Check rate limit: 1 hour between regenerations
  if (room.code_regenerated_at) {
    const lastRegenerated = new Date(room.code_regenerated_at)
    const now = new Date()
    const hoursSinceLastRegen = (now.getTime() - lastRegenerated.getTime()) / (1000 * 60 * 60)

    if (hoursSinceLastRegen < 1) {
      const minutesRemaining = Math.ceil((1 - hoursSinceLastRegen) * 60)
      return {
        error: true,
        message: `Please wait ${minutesRemaining} minute${minutesRemaining === 1 ? '' : 's'} before regenerating the code again`,
        minutesRemaining,
      }
    }
  }

  // Generate new code
  const newCode = await generateRoomCode()

  // Update room with new code and timestamp
  const { error: updateError } = await supabase
    .from('chat_room')
    .update({
      invite_code: newCode,
      code_regenerated_at: new Date().toISOString(),
    })
    .eq('id', roomId)

  if (updateError) {
    return { error: true, message: 'Failed to regenerate room code' }
  }

  return { error: false, inviteCode: newCode, message: 'Room code regenerated successfully' }
}
