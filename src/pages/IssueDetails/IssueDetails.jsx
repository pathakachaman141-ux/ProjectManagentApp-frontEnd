import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { ScrollArea } from '@/Components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import CommentForm from './CommentForm'
import CommentCard from './CommentCard'
import { Badge } from "@/Components/ui/badge"
import {
  Avatar,
  AvatarFallback
} from '@/Components/ui/Avatar' 
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select"

import { useDispatch, useSelector } from 'react-redux'
import { getIssueById, updateIssueStatus} from '../../Redux/Issue/Action'
import {fetchCommentsByIssueId } from '../../Redux/Comment/Action'

const IssueDetails = () => {
    const { projectId, issueId } = useParams();
    const dispatch = useDispatch();
    
    // Get issue details from issue reducer
    const { issueDetails, loading, error } = useSelector(store => store.issue);
    
    // Get comments from comment reducer
    const { comments, loading: commentsLoading, error: commentsError } = useSelector(store => store.comment);

    // FIXED: Properly named function that matches the onValueChange call
    const handleUpdateIssueStatus = async (newStatus) => {
       
        
        // Validate issueId from URL params
        if (!issueId || issueId === 'undefined') {
          
            return;
        }
        
        try {
            await dispatch(updateIssueStatus(issueId, newStatus));
            
            // Re-fetch the issue details to get updated data
            dispatch(getIssueById(issueId));
            
        } catch (error) {
           
        }
    };

    useEffect(() => {
       
        
        if (issueId && issueId !== 'undefined') {
            dispatch(getIssueById(issueId));
            dispatch(fetchCommentsByIssueId(issueId));
        } else {
           
        }
    }, [issueId, dispatch])

    // Loading state
    if (loading) {
        return (
            <div className='px-20 py-8 mt-6'>
                <div className='flex justify-center items-center h-64'>
                    <p>Loading issue details...</p>
                    <div className="text-sm mt-2">Issue ID: {issueId}</div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className='px-20 py-8  mt-6'>
                <div className='flex justify-center items-center h-64'>
                    <p className='text-red-400'>Error: {error}</p>
                    <div className="text-sm mt-2">Issue ID: {issueId}</div>
                </div>
            </div>
        );
    }

    // No issue found
    if (!issueDetails) {
        return (
            <div className='px-20 py-8 mt-6'>
                <div className='flex justify-center items-center h-64'>
                    <p>No issue found</p>
                    <div className="text-sm  mt-2">Issue ID: {issueId}</div>
                </div>
            </div>
        );
    }

    // FIXED: Handle different possible data structures
    const issueData = issueDetails?.data || issueDetails;
    
    // Extract comments from the API response structure
    const commentsData = comments?.data || comments || [];
    
   

    return (
        <div className='px-4 sm:px-8 lg:px-20 py-8  mt-6'>
            <div className='flex flex-col lg:flex-row  justify-between border p-4 sm:p-6 lg:p-10 rounded-lg gap-6'>
                <ScrollArea className="bg-[#7BB3E8] rounded-lg text-black flex-1 lg:mr-6 ">
                    <div>
                        {/* Fixed: Display actual issue title */}
                        <h1 className='text-lg font-semibold '>
                            {issueData?.title || 'Untitled Issue'}
                        </h1>
                        <div className=' bg-[#7BB3E8]py-5'>
                            <h2 className='font-semibol'>Description</h2>
                            <p className='text-black text-sm mt-3'>
                                {issueData?.description || 'No description available'}
                            </p>
                        </div>
                        <div className='mt-5'>
                            <h1 className='pb-3'>Activity</h1>
                            <Tabs className="text-black w-full max-w-[400px]" defaultValue="comments">
                                <TabsList className="mb-5 text-black">
                                    <TabsTrigger value="all">
                                        All
                                    </TabsTrigger>
                                    <TabsTrigger value="comments">
                                        Comments ({Array.isArray(commentsData) ? commentsData.length : 0})
                                    </TabsTrigger>
                                    <TabsTrigger value="history">
                                        History
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="all">
                                    All Make changes to your account here
                                </TabsContent>
                                <TabsContent value="history">
                                    History change your password here
                                </TabsContent>
                                <TabsContent value="comments">
                                    <CommentForm issueId={issueId}/>
                                    <div className='mt-8 space-y-6 text-black'>
                                        {commentsLoading ? (
                                            <p className='text-black'>Loading comments...</p>
                                        ) : commentsError ? (
                                            <p className='text-red-400'>Error loading comments: {commentsError}</p>
                                        ) : Array.isArray(commentsData) && commentsData.length > 0 ? (
                                            commentsData.map((comment, index) => (
                                                <CommentCard 
                                                    key={comment.id || `comment-${index}`} 
                                                    comment={comment}
                                                    issueId={issueId}
                                                />
                                            ))
                                        ) : (
                                            <div className='text-center text-black py-8'>
                                                <p>No comments yet</p>
                                                <p className='text-sm'>Be the first to comment on this issue!</p>
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </ScrollArea>

                <div className='w-full lg:w-[30%] space-y-2 order-first lg:order-last'>
                    {/* FIXED: Correct function name and better status handling */}
                    <Select 
                        onValueChange={handleUpdateIssueStatus}
                        value={issueData?.status || "pending"}
                    >
                        <SelectTrigger className="text-black bg-white w-full sm:w-[180px]">
                            <SelectValue placeholder="To Do" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pending">To Do</SelectItem>
                            <SelectItem value="In-Progress">In Progress</SelectItem>
                            <SelectItem value="done">Done</SelectItem>
                        </SelectContent>
                    </Select>
                    
                    <div className=' bg-[#7BB3E8] text-black border rounded-lg'>
                        <p className='border py-3 px-5 font-bold'>Details</p>
                        <div className='p-5'>
                            <div className='space-y-7'>
                                <div className='flex gap-10 items-center'>
                                    <p className='w-[7rem]'>Assignee</p>
                                    <div className='flex items-center gap-3'>
                                        <Avatar className='h-8 w-8 text-xs'>
                                            <AvatarFallback>
                                                {issueData?.assignee?.name?.charAt(0) || 
                                                 issueData?.assignee?.username?.charAt(0).toUpperCase() || 'A'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <p>{issueData?.assignee?.name || 
                                            issueData?.assignee?.username || 'Unassigned'}</p>
                                    </div>
                                </div>
                                
                                <div className='flex gap-10 items-center'>
                                    <p className='w-[7rem]'>Labels</p>
                                    <p>{issueData?.labels?.join(', ') || 'None'}</p>
                                </div>
                                
                                <div className='flex gap-10 items-center'>
                                    <p className='w-[7rem]'>Status</p>
                                    <Badge>
                                        {issueData?.status === 'pending' ? 'To Do' : 
                                         issueData?.status === 'In-Progress' ? 'In Progress' : 
                                         issueData?.status === 'done' ? 'Done' : 
                                         issueData?.status || 'Unknown'}
                                    </Badge>
                                </div>
                                
                                <div className='flex gap-10 items-center'>
                                    <p className='w-[7rem]'>Release</p>
                                    <p>{issueData?.releaseDate || issueData?.dueDate || 'Not set'}</p>
                                </div>

                                <div className='flex gap-10 items-center'>
                                    <p className='w-[7rem]'>Reporter</p>
                                    <div className='flex items-center gap-3'>
                                        <Avatar className='h-8 w-8 text-xs'>
                                            <AvatarFallback>
                                                {issueData?.reporter?.name?.charAt(0) || 
                                                 issueData?.reporter?.username?.charAt(0) || 'R'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <p>{issueData?.reporter?.name || 
                                            issueData?.reporter?.username || 'Unknown'}</p>
                                    </div>
                                </div>
                                
                                {/* Debug info - remove in production */}
                                <div className='flex gap-10 items-center text-xs text-black'>
                                    <p className='w-[7rem]'>Debug Info</p>
                                    <div>
                                        <p>Issue ID: {issueId}</p>
                                        <p>Project ID: {projectId}</p>
                                        <p>Status: {issueData?.status}</p>
                                        <p>Comments: {Array.isArray(commentsData) ? commentsData.length : 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default IssueDetails