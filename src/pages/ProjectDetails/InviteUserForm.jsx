import React from 'react'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage
} from '@/Components/ui/form'
import { Input } from '@/Components/ui/input'
import { useParams } from 'react-router-dom'
import { Button } from '@/Components/ui/button'
import { DialogClose } from '@/Components/ui/dialog'
import { useDispatch } from 'react-redux'
import { inviteToProject } from '../../Redux/Project/Action'

const InviteUserForm = () => {
  const dispatch = useDispatch()
  const params = useParams()

  const currentProjectId = params.projectId || params.id

  const form = useForm({
    defaultValues: {
      email: ''
    }
  })


  const onSubmit = (data) => {
    // ✅ Fixed: Create inviteData object and pass it to the action
    const inviteData = {
      email: data.email,
      projectId: currentProjectId
    }
    
    // ✅ Fixed: Pass the entire inviteData object
    dispatch(inviteToProject(inviteData))
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invite User</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="user email..."
                    type="email"
                    className="border w-full border-gray-300 py-2 px-3"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogClose asChild>
            <Button type="submit" className="w-full py-5">
              Invite User
            </Button>
          </DialogClose>
        </form>
      </Form>
    </div>
  )
}

export default InviteUserForm