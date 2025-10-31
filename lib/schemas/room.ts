import { z } from 'zod'

export const createRoomSchema = z.object({
  name: z.string().min(1, 'Room name is required'),
  isPublic: z.boolean(),
})

export type CreateRoomData = z.infer<typeof createRoomSchema>
