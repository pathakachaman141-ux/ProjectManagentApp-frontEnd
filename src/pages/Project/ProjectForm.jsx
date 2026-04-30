import React from 'react'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage
} from '@/Components/ui/Form'
import { Input } from '@/Components/ui/Input'
import { Textarea } from '@/Components/ui/Textarea'
import { Button } from '@/Components/ui/Button'
import { DialogClose } from '@/Components/ui/Dialog'
import { Cross1Icon } from '@radix-ui/react-icons'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/Select'

import { tags } from '../ProjectList/ProjectList' 
import { useDispatch } from 'react-redux'
import { createProject } from '../../Redux/Project/Action'

const ProjectForm = () => { // Remove onClose prop since we'll use DialogClose

  const dispatch = useDispatch();
  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      category: '',
      tags: ['javascript', 'react']
    },
    mode: 'onChange' // Enable validation on change
  })

  const handleTagsChange = (newValue) => {
    const currentTags = form.getValues("tags");
    const updatedTags = currentTags.includes(newValue)
      ? currentTags.filter(tag => tag !== newValue)
      : [...currentTags, newValue];
    form.setValue("tags", updatedTags);
  }

  const onSubmit = (data) => {
    console.log(data)
    dispatch(createProject(data))
    // Reset form after submission
    form.reset()
  }

  const projectLimitReached = false

  return (
    <div >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Project Name */}
          <FormField
            control={form.control}
            name="name"
            rules={{ 
              required: "Project name is required",
              minLength: {
                value: 2,
                message: "Project name must be at least 2 characters"
              }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter project name"
                    type="text"
                    className="border w-full bg-white border-gray-300 py-2 px-3"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            rules={{
              required: "Description is required",
              minLength: {
                value: 25,
                message: "Description must be at least 25 characters"
              },
              maxLength: {
                value: 200,
                message: "Description must not exceed 200 characters"
              }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Enter project description (minimum 25 characters)..."
                    className="border w-full border-gray-300 py-3 px-3 bg-white"
                    rows={4}
                  />
                </FormControl>
                <div className="flex justify-between items-center">
                  <FormMessage />
                  <span className="text-xs text-gray-500">
                    {field.value?.length || 0}/200 characters
                  </span>
                </div>
              </FormItem>
            )}
          />

          {/* Category (Select) */}
          <FormField
            control={form.control}
            name="category"
            rules={{ required: "Please select a category" }}
            render={({ field }) => (
              <FormItem >
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="border border-gray-300 bg-white">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className='bg-white text-black'>
                    <SelectItem value="frontend">Frontend</SelectItem>
                    <SelectItem value="backend">Backend</SelectItem>
                    <SelectItem value="fullstack">Fullstack</SelectItem>
                    <SelectItem value="mobile">Mobile</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tags */}
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <Select
                  onValueChange={(value) => {
                    handleTagsChange(value);
                  }}
                  value="" // Reset select after each selection
                >
                  <FormControl>
                    <SelectTrigger className="border bg-white border-gray-300">
                      <SelectValue placeholder="Select tags" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className='bg-white text-black'>
                    {tags.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
                <div className='flex gap-1 flex-wrap mt-2'>
                  {field.value.map((item) => (
                    <div
                      key={item}
                      onClick={() => handleTagsChange(item)}
                      className='cursor-pointer flex rounded-full items-center border gap-2 py-1 px-4 hover:bg-gray-100'
                    >
                      <span className='text-sm'>{item}</span>
                      <Cross1Icon className='h-3 w-3' />
                    </div>
                  ))}
                </div>
              </FormItem>
            )}
          />

          {/* Submit Button */}
          {projectLimitReached ? (
            <p className="text-sm text-red-600">
              You can create only 3 projects with the free plan. Please upgrade your plan.
            </p>
          ) : (
            <DialogClose asChild>
              <Button 
                type="submit" 
                className="w-full py-5"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'Creating...' : 'Create Project'}
              </Button>
            </DialogClose>
          )}
        </form>
      </Form>
    </div>
  )
}

export default ProjectForm