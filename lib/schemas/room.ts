import { z } from 'zod'

export const createRoomSchema = z
  .object({
    name: z.string().min(1, 'Room name is required'),
    isPublic: z.boolean(),
    password: z.string().optional(),
  })
  .refine(
    (data) => {
      // If room is not public and has no password, that's invalid
      if (!data.isPublic && !data.password) {
        return false
      }
      return true
    },
    {
      message: 'Non-public rooms must have a password',
      path: ['password'],
    }
  )

export type CreateRoomData = z.infer<typeof createRoomSchema>

export const roomCodeSchema = z
  .string()
  .min(10, 'Room code must be at least 10 characters')
  .max(12, 'Room code must be at most 12 characters')
  .regex(/^[a-zA-Z0-9]+$/, 'Room code must contain only letters and numbers')

export type RoomCode = z.infer<typeof roomCodeSchema>
