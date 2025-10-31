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
import { redirect } from 'next/dist/client/components/navigation.react-server'
import Link from 'next/link'

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
            <Button asChild>
              <Link href="rooms/new">Create Room</Link>
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <RoomList title="Your Rooms" rooms={joinedRooms} isJoined />
      <RoomList title="Public Rooms" rooms={unjoinedRooms} />
    </div>
  )
}

function RoomList({
  title,
  rooms,
  isJoined = false,
}: {
  title: string
  rooms: { id: string; name: string; member_count: number }[]
  isJoined?: boolean
}) {
  if (rooms.length === 0) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-2xl">{title}</h2>
        <Button asChild>
          <Link href="/rooms/new">Create Room</Link>
        </Button>
      </div>
      <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
        {rooms.map((room) => (
          <RoomCard {...room} key={room.id} isJoined={isJoined} />
        ))}
      </div>
    </div>
  )
}

function RoomCard({
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
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>
          {member_count} {member_count === 1 ? 'member' : 'members'}
        </CardDescription>
      </CardHeader>
      <CardFooter className="gap-2">
        {isJoined ? (
          <>
            <Button asChild className="grow" size="sm">
              <Link href={`/rooms/${id}`}>Enter</Link>
            </Button>
            <LeaveRoomButton roomId={id} size="sm" variant="destructive">
              Leave
            </LeaveRoomButton>
          </>
        ) : (
          <JoinRoomButton
            roomId={id}
            variant="outline"
            className="grow"
            size="sm"
          >
            Join
          </JoinRoomButton>
        )}
      </CardFooter>
    </Card>
  )
}

async function getPublicRooms() {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('chat_room')
    .select('id, name, chat_room_member (count)')
    .eq('is_public', true)
    .order('name', { ascending: true })

  if (error) return []

  return data.map(({ chat_room_member, id, name }) => ({
    id,
    name,
    member_count: chat_room_member[0].count,
  }))
}

async function getJoinedRooms(userId: string) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('chat_room')
    .select('id, name, chat_room_member (member_id)')
    .order('name', { ascending: true })

  if (error) return [].filter(() => {})

  return data
    .filter((room) =>
      room.chat_room_member.some(({ member_id }) => member_id === userId),
    )
    .map(({ chat_room_member, id, name }) => ({
      id,
      name,
      member_count: chat_room_member.length,
    }))
}
