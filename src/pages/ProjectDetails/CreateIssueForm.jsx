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
import { Button } from '@/Components/ui/button'
import { DialogClose } from '@/Components/ui/dialog'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { createIssue } from '../../Redux/Issue/Action' // Add proper import path

const CreateIssueForm = ({status}) => {
  const dispatch = useDispatch();
  const { id } = useParams(); // Move inside component
  
  const form = useForm({
    defaultValues: {
      issueName: '',
      description: ""
    }
  });

  const onSubmit = (data) => {
    // Create the proper data structure for the issue
    const issueData = {
      title: data.issueName, // Map issueName to title
      description: data.description,
      projectId: id,
      status,
    };
    
    dispatch(createIssue(issueData));
  }
    
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Issue Name */}
          <FormField
            control={form.control}
            name="issueName" // Fixed: was "name", now matches defaultValues
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issue Name</FormLabel> {/* Updated label */}
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter issue name..."
                    type="text"
                    className="border w-full border-gray-300 py-2 px-3"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Description */}
          <FormField
            control={form.control}
            name="description" // Fixed: was "name", now matches defaultValues
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter description..."
                    type="text"
                    className="border w-full border-gray-300 py-2 px-3"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogClose asChild>
            <Button type="submit" className="w-full py-5">
              Create Issue
            </Button>
          </DialogClose>
        </form>
      </Form>
    </div>
  )
}

export default CreateIssueForm