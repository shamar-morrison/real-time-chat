import { AnimatedPage } from '@/components/animated-page'
import { AnimatedRoomList } from '@/components/animated-room-list'
import { CreateRoomDialog } from '@/components/create-room-dialog'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { getCurrentUser } from '@/lib/supabase/get-current-user'
import { createAdminClient } from '@/lib/supabase/server'
import { MessagesSquareIcon } from 'lucide-react'
import { Metadata } from 'next'
import { redirect } from 'next/dist/client/components/navigation.react-server'

// generate metadata
export const metadata: Metadata = {
  title: 'LinaChat',
  description: 'Real-time chat application',
}

export default async function Home() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/auth/login')
  }

  const publicRooms = await getPublicRooms()
  const joinedRooms = await getJoinedRooms(user.id)
  const joinedRoomIds = new Set(joinedRooms.map((r) => r.id))
  const unjoinedRooms = publicRooms.filter(
    (room) => !joinedRoomIds.has(room.id),
  )

  if (publicRooms.length === 0 && joinedRooms.length === 0) {
    return (
      <AnimatedPage>
        <div className="container mx-auto max-w-3xl px-4 py-8 space-y-8">
          <Empty className="bg-card border shadow-md border-none">
            <EmptyHeader>
              <EmptyMedia variant={'icon'}>
                <MessagesSquareIcon />
              </EmptyMedia>
              <EmptyTitle>No chat rooms available</EmptyTitle>
              <EmptyDescription>
                Create a room to start chatting!
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <CreateRoomDialog />
            </EmptyContent>
          </Empty>
        </div>
      </AnimatedPage>
    )
  }

  return (
    <AnimatedPage>
      <div className="container mx-auto px-4 py-8 space-y-8">
        <AnimatedRoomList
          title="Your Rooms"
          rooms={joinedRooms}
          isJoined
          showCreateButton={joinedRooms.length > 0}
        />
        <AnimatedRoomList
          title="Public Rooms"
          rooms={unjoinedRooms}
          showCreateButton={
            joinedRooms.length === 0 && unjoinedRooms.length > 0
          }
        />
      </div>
    </AnimatedPage>
  )
}

async function getPublicRooms() {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('chat_room')
    .select('id, name, is_public, password_hash, chat_room_member (count)')
    .order('name', { ascending: true })

  if (error) return []

  return data.map(({ chat_room_member, id, name, is_public, password_hash }) => ({
    id,
    name,
    member_count: chat_room_member[0].count,
    is_public,
    has_password: password_hash !== null,
  }))
}

async function getJoinedRooms(userId: string) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('chat_room')
    .select('id, name, is_public, password_hash, chat_room_member (member_id)')
    .order('name', { ascending: true })

  if (error) return [].filter(() => {})

  return data
    .filter((room) =>
      room.chat_room_member.some(({ member_id }) => member_id === userId),
    )
    .map(({ chat_room_member, id, name, is_public, password_hash }) => ({
      id,
      name,
      member_count: chat_room_member.length,
      is_public,
      has_password: password_hash !== null,
    }))
}
