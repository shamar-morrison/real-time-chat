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
