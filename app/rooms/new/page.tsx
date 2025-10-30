'use client'

import { createRoom } from '@/actions/rooms'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { LoadingSwap } from '@/components/ui/loading-swap'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

export const createRoomSchema = z.object({
  name: z.string().min(1, 'Room name is required'),
  isPublic: z.boolean(),
})
type FormData = z.infer<typeof createRoomSchema>

export default function NewRoomPage() {
  const form = useForm<FormData>({
    defaultValues: {
      name: '',
      isPublic: false,
    },
    resolver: zodResolver(createRoomSchema),
  })

  async function handleSubmit(data: FormData) {
    const { error, message } = await createRoom(data)
    if (error) {
      toast.error('Error', {
        description: message,
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-lg mx-auto w-full">
        <CardHeader>
          <CardTitle>New Room</CardTitle>
          <CardDescription>Create a new room</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => {
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Room Name</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        disabled={form.formState.isSubmitting}
                      />
                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )
                }}
              />
              <Controller
                name="isPublic"
                control={form.control}
                render={({
                  field: { onChange, value, ...field },
                  fieldState,
                }) => {
                  return (
                    <Field
                      data-invalid={fieldState.invalid}
                      orientation={'horizontal'}
                    >
                      <Checkbox
                        {...field}
                        id={field.name}
                        onCheckedChange={onChange}
                        checked={value}
                        aria-invalid={fieldState.invalid}
                        disabled={form.formState.isSubmitting}
                      />
                      <FieldContent>
                        <FieldLabel
                          htmlFor={field.name}
                          className="font-normal"
                        >
                          Public Room
                        </FieldLabel>
                        {fieldState.error && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </FieldContent>
                    </Field>
                  )
                }}
              />
              <Field orientation={'horizontal'} className="w-full">
                <Button className="grow" type="submit">
                  <LoadingSwap isLoading={form.formState.isSubmitting}>
                    Create Room
                  </LoadingSwap>
                </Button>
                <Button variant={'outline'} asChild>
                  <Link
                    href={'/'}
                    className={cn(
                      form.formState.isSubmitting &&
                        'pointer-events-none opacity-50',
                    )}
                  >
                    Cancel
                  </Link>
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
