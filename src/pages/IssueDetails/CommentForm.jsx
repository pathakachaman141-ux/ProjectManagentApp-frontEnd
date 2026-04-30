import React from 'react'
import { useForm } from 'react-hook-form'
import {
  Avatar,
  AvatarFallback
} from '@/Components/ui/Avatar' 
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage
} from '@/Components/ui/form'
import { createComment } from '../../Redux/Comment/Action'
import { fetchCommentsByIssueId } from '../../Redux/Comment/Action'
import { Input } from '@/Components/ui/input'
import { Button } from '@/Components/ui/Button'
import { useDispatch, useSelector } from 'react-redux'

const CommentForm = ({ issueId }) => {
  const dispatch = useDispatch();
  
  // Get current user from auth state and comment loading state
  const { user } = useSelector(store => store.auth);
  const { createLoading } = useSelector(store => store.comment);
  
  const form = useForm({
    defaultValues: {
      content: ''
    }
  });

  const onSubmit = async (data) => {
    // Validation: Check if content is not empty
    if (!data.content.trim()) {
      form.setError('content', {
        type: 'required',
        message: 'Comment content is required'
      });
      return;
    }

    // Validation: Check if issueId exists
    if (!issueId) {
      return;
    }

    try {
      // Create comment data object
      const commentData = {
        content: data.content.trim(),
        issueId: parseInt(issueId) // Ensure issueId is a number if your backend expects it
      };
    
      
      // Dispatch create comment action
      await dispatch(createComment(commentData));
      
      // Reset form after successful submission
      form.reset();
      
      // Refresh comments list to show the new comment
      dispatch(fetchCommentsByIssueId(issueId));
      
     
      
    } catch (error) {
      
      // You could show an error message to the user here
      form.setError('content', {
        type: 'server',
        message: 'Failed to create comment. Please try again.'
      });
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.name) {
      return user.name.split(' ').map(n => n.charAt(0)).join('').substring(0, 2).toUpperCase();
    }
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U'; // Default fallback
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <FormField
              control={form.control}
              name="content"
              rules={{
                required: 'Comment content is required',
                minLength: {
                  value: 1,
                  message: 'Comment must have at least 1 character'
                },
                maxLength: {
                  value: 1000,
                  message: 'Comment must be less than 1000 characters'
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Write a comment..."
                      type="text"
                      className="w-full bg-white"
                      disabled={createLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <Button 
            type="submit" 
            size="sm"
            disabled={createLoading || !form.watch('content')?.trim()}
          >
            {createLoading ? 'Saving...' : 'Save'}
          </Button>
        </form>
      </Form>
      
      {/* Display current user info for debugging - remove in production
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-2 text-xs text-gray-500">
          <p>Current user: {user?.name || user?.username || 'Not logged in'}</p>
          <p>Issue ID: {issueId}</p>
        </div>
      )} */}
    </div>
  )
}

export default CommentForm