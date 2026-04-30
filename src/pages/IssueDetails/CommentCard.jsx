import React from 'react'
import {
  Avatar,
  AvatarFallback
} from '@/Components/ui/avatar' 

import { Button } from '@/Components/ui/button'
import { TrashIcon } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { deleteComment, fetchCommentsByIssueId } from '../../Redux/Comment/Action'

const CommentCard = ({ comment, issueId }) => {
  const dispatch = useDispatch();
  
  
  const handleDeleteComment = async () => {
    try {
      await dispatch(deleteComment(comment.id));
      // Refresh comments after deletion
      dispatch(fetchCommentsByIssueId(issueId));
    } catch (error) {
      
    }
  };

  // Handle case where comment might be undefined (for placeholder cards)
  if (!comment) {
    return (
      <div className='flex justify-between'>
        <div className='flex items-center gap-4'>
          <Avatar>
            <AvatarFallback>?</AvatarFallback>
          </Avatar>
          <div className='space-y-1'>
            <p className='text-gray-500'>Loading...</p>
            <p className='text-gray-400'>Please wait</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex justify-between'>
      <div className='flex items-center gap-4'>
        <Avatar>
          <AvatarFallback>
            {comment.user?.name?.charAt(0)?.toUpperCase() || 
             comment.user?.username?.charAt(0)?.toUpperCase() || 
             comment.author?.charAt(0)?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className='space-y-1'>
          <p className='font-semibold'>
            {comment.user?.name || 
             comment.user?.username || 
             comment.author || 'Anonymous'}
          </p>
          <p className='text-black'>
            {comment.content || comment.text || 'No content'}
          </p>
          {comment.createdAt && (
            <p className='text-xs text-black'>
              {new Date(comment.createdAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
      
      {comment.id && (
        <Button 
          className="rounded-full" 
          variant="ghost" 
          size="icon"
          onClick={handleDeleteComment}
        >
          <TrashIcon />
        </Button>
      )}
    </div>
  )
}

export default CommentCard