import React, { useState, useEffect, useRef } from 'react'
import { ScrollArea } from '@/Components/ui/scroll-area'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import {
  Avatar,
  AvatarFallback
} from '@/Components/ui/avatar'
import { PaperPlaneIcon } from '@radix-ui/react-icons'
import { useDispatch, useSelector } from 'react-redux'
import { sendMessage, fetchMessagesByProjectId } from '../../Redux/Chat/Action'
import { useParams } from 'react-router-dom'

const ChatBox = ({ projectId }) => {
  const [message, setMessage] = useState('')
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)
  const [lastMessageCount, setLastMessageCount] = useState(0)
  const { auth, chat } = useSelector(store => store)
  const dispatch = useDispatch()
  const params = useParams()
  const scrollAreaRef = useRef(null)
  
  // Use projectId from props first, then from params as fallback
  const currentProjectId = projectId || params.projectId || params.id

  // Debug logging
  useEffect(() => {
   
  }, [projectId, params, currentProjectId, auth.user, chat])

  // Fetch messages when projectId changes
  useEffect(() => {
    if (currentProjectId) {
      dispatch(fetchMessagesByProjectId(currentProjectId))
    } else {
    }
  }, [currentProjectId, dispatch, ])

  // Check if user is near bottom of scroll area
  const isNearBottom = () => {
    if (!scrollAreaRef.current) return true
    
    const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
    if (!scrollElement) return true
    
    const threshold = 100 // pixels from bottom
    return scrollElement.scrollTop + scrollElement.clientHeight >= scrollElement.scrollHeight - threshold
  }

  // Handle scroll events to determine if we should auto-scroll
  const handleScroll = () => {
    setShouldAutoScroll(isNearBottom())
  }

  // Auto-scroll logic - only scroll when appropriate
  useEffect(() => {
    const messages = chat.messages || []
    const currentMessageCount = messages.length
    
    if (scrollAreaRef.current && messages.length > 0) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollElement) {
        // Add scroll event listener
        scrollElement.addEventListener('scroll', handleScroll)
        
        // Auto-scroll conditions:
        // 1. First load (no previous messages)
        // 2. User sent a new message (should always scroll to show their message)
        // 3. User is already near the bottom and new message arrives
        const isFirstLoad = lastMessageCount === 0
        const newMessageAdded = currentMessageCount > lastMessageCount
        const lastMessage = messages[messages.length - 1]
        const isCurrentUserMessage = lastMessage?.senderId === auth.user?.userId || 
                                   lastMessage?.sender?.userId === auth.user?.userId
        
        if (isFirstLoad || (newMessageAdded && (isCurrentUserMessage || shouldAutoScroll))) {
          setTimeout(() => {
            scrollElement.scrollTop = scrollElement.scrollHeight
          }, 100)
        }
        
        // Update message count
        setLastMessageCount(currentMessageCount)
        
        // Cleanup
        return () => {
          scrollElement.removeEventListener('scroll', handleScroll)
        }
      }
    }
  }, [chat.messages, shouldAutoScroll, auth.user?.userId, lastMessageCount])

  const handleMessageChange = (e) => {
    setMessage(e.target.value)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSendMessage = async () => {
    // Comprehensive validation
    if (!message.trim()) {
      return
    }
    
    if (!currentProjectId) {
      alert('Project ID not found. Please ensure you are in a valid project.')
      return
    }
    
    if (!auth.user?.userId) {
      alert('User not authenticated. Please log in again.')
      return
    }


    const messageData = {
      senderId: auth.user.userId,
      projectId: currentProjectId,
      content: message.trim()
    }


    // Set auto-scroll to true when user sends a message
    setShouldAutoScroll(true)

    try {
      await dispatch(sendMessage(messageData))
      setMessage('') // Clear the input after successful send
      
      // Refresh messages after sending
      setTimeout(() => {
        dispatch(fetchMessagesByProjectId(currentProjectId))
      }, 500)
      
    } catch (error) {
      
      // Handle different types of errors
      if (error.code === 'ERR_NETWORK') {
        alert('Network error: Please check if the server is running on http://localhost:8080')
      } else if (error.response) {
        const errorMsg = error.response.data?.message || `Server error: ${error.response.status}`
        alert(errorMsg)
      } else {
        alert('An unexpected error occurred: ' + error.message)
      }
    }
  }

  // Get messages from Redux store
  const messages = chat?.messages || []
  const isLoading = chat?.loading || false
  const isSendingMessage = chat?.sendingMessage || false


  // Show loading if no projectId yet
  if (!currentProjectId) {
    return (
      <div className='sticky mt-20'>
        <div className='border rounded-lg'>
          <h1 className='border-b p-5 font-semibold'> Chat Box </h1>
          <div className="p-5 text-center">
            <p className="text-gray-500">Loading project...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error if user not authenticated
  if (!auth.user?.userId) {
    return (
      <div className='sticky mt-20'>
        <div className='border rounded-lg'>
          <h1 className='border-b p-5 font-semibold'> Chat Box </h1>
          <div className="p-5 text-center">
            <p className="text-red-500">Please log in to use chat</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='sticky mt-20 bg-[#D9D9D9] rounded-xl'>
      <div className='border rounded-lg'>
        <h1 className='border-b p-5 font-semibold'>
          Chat Box - Project {currentProjectId}
        </h1>
        <ScrollArea ref={scrollAreaRef} className="h-[32rem] w-full p-5 flex gap-3 flex-col">
          {isLoading && messages.length === 0 ? (
            <div className="text-center text-black p-4">
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-black p-4">
              No messages yet. Start a conversation!
            </div>
          ) : (
            messages.map((item, index) => {
              // Check if this message is from the current user
              const isCurrentUser = item.senderId === auth.user?.userId || 
                                   item.sender?.userId === auth.user?.userId;
              
              return isCurrentUser ? (
                // Current user's message (right side)
                <div className='flex gap-2 mb-2 justify-end' key={item.id || index}>
                  <div className='space-y-2 py-2 px-5 border rounded-se-2xl rounded-s-xl max-w-[70%] '>
                    <p className="font-semibold text-blue-800">
                      {item.senderName || item.sender?.username || auth.user?.fullName || 'You'}
                    </p>
                    <p className='text-gray-700 break-words'>{item.content}</p>
                    {item.createdAt && (
                      <p className="text-xs text-gray-400">
                        {new Date(item.createdAt).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                  <Avatar>
                    <AvatarFallback className="bg-black text-white">
                      {(item.senderName || item.sender?.username || auth.user?.fullName || 'U')[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              ) : (
                // Other user's message (left side)
                <div className='flex gap-2 mb-2 justify-start' key={item.id || index}>
                  <Avatar>
                    <AvatarFallback className="bg-black text-white">
                      {(item.senderName || item.sender?.username|| 'U')[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className='space-y-2 py-2 px-5 border rounded-ss-2xl rounded-e-xl max-w-[70%]'>
                    <p className="font-semibold text-blue-800">
                      {item.senderName || item.sender?.username || 'Unknown User'}
                    </p>
                    <p className='text-gray-700 break-words'>{item.content}</p>
                    {item.createdAt && (
                      <p className="text-xs text-gray-400">
                        {new Date(item.createdAt).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </ScrollArea>
        <div className='relative p-5 border-t'>
          <Input
            placeholder="Type message..."
            className="pr-12 bg-[#7BB3E8] rounded-full"
            value={message} 
            onChange={handleMessageChange}
            onKeyPress={handleKeyPress}
            disabled={isSendingMessage}
          />
          <Button 
            onClick={handleSendMessage} 
            className="absolute right-7  bg-white top-1/2 transform -translate-y-1/2 rounded-full" 
            size="icon" 
            variant="ghost"
            disabled={isSendingMessage || !message.trim()}
          >
            <PaperPlaneIcon />
          </Button>
        </div>
        {isSendingMessage && (
          <div className="px-5 pb-2">
            <p className="text-xs text-gray-500">Sending message...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatBox