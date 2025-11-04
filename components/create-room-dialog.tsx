'use client'

import { createRoom } from '@/actions/rooms'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { LoadingSwap } from '@/components/ui/loading-swap'
import { CreateRoomData, createRoomSchema } from '@/lib/schemas/room'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

export function CreateRoomDialog() {
  const [open, setOpen] = useState(false)
  const form = useForm<CreateRoomData>({
    defaultValues: {
      name: '',
      isPublic: false,
    },
    resolver: zodResolver(createRoomSchema),
  })

  async function handleSubmit(data: CreateRoomData) {
    const { error, message } = await createRoom(data)
    if (error) {
      toast.error('Error', {
        description: message,
      })
    } else {
      setOpen(false)
      form.reset()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Room</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Room</DialogTitle>
          <DialogDescription>Create a new room</DialogDescription>
        </DialogHeader>
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
              <Button
                variant={'outline'}
                type="button"
                onClick={() => setOpen(false)}
                disabled={form.formState.isSubmitting}
              >
                Cancel
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
