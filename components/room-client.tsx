export type Message = {
  id: string
  text: string
  created_at: string
  author_id: string
  author: {
    name: string
    image_url: string | null
  }
}

export function RoomClient({
  room,
  user,
  messages,
}: {
  room: { id: string; name: string }
  user: { id: string; name: string; image_url: string | null }
  messages: Message[] | null
}) {
  return <div>{}</div>
}
