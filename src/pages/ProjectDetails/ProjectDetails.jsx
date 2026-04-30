import React, { useEffect } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar"
import {Badge} from '@/Components/ui/badge'
import { Button } from "@/Components/ui/button"
import InviteUserForm from './InviteUserForm'
import {ScrollArea} from '@/Components/ui/scroll-area'
import IssueList from './IssueList'
import ChatBox from './ChatBox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/Components/ui/dialog"
import { PlusIcon } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProjectById } from '../../Redux/Project/Action'
import { useParams, useLocation, useNavigate } from 'react-router-dom'

const ProjectDetails = () => {
    const dispatch = useDispatch();
    const {project} = useSelector(store=>store)
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    
    // Debug logging
   
    
    // Try different possible parameter names
    const projectId = params.projectId || params.id || params.project_id;
    
    const handleProjectInvitation = ()=>{
        // Add invitation logic here
    }

    useEffect(()=>{
        
        
        if (projectId && projectId !== 'undefined' && !isNaN(projectId)) {
            
            dispatch(fetchProjectById(projectId));
        } else {
        }
    },[projectId, dispatch])

    // Fixed: Access the project data correctly based on your API response structure
    const projectData = project.projectDetails?.data || project.projectDetails;
    
    // Add loading and error handling
    if (project.loading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <div>Loading project...</div>
                <div className="text-sm text-gray-500 mt-2">Project ID: {projectId}</div>
            </div>
        );
    }

    if (project.error) {
        return (
            <div className="flex flex-col justify-center items-center h-screen text-red-500">
                <div>Error: {project.error}</div>
                <div className="text-sm text-gray-400 mt-2">Project ID: {projectId}</div>
                <Button 
                    className="mt-4" 
                    onClick={() => navigate(`/`)}
                >
                    Back to Projects
                </Button>
            </div>
        );
    }

    if (!projectId || projectId === 'undefined' || isNaN(projectId)) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <div className="text-xl mb-4">Invalid Project ID</div>
                <div className="text-sm text-gray-500 mb-4">
                    Current URL: {window.location.pathname}
                </div>
                <div className="text-sm text-gray-500 mb-4">
                    Expected format: /project/123
                </div>
                <Button onClick={() => navigate('/projects')}>
                    Back to Projects
                </Button>
            </div>
        );
    }

    if (!projectData) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <div>Project not found</div>
                <div className="text-sm text-gray-500 mt-2">Project ID: {projectId}</div>
                <Button 
                    className="mt-4" 
                    onClick={() => navigate('/projects')}
                >
                    Back to Projects
                </Button>
            </div>
        );
    }

   
    
    return (
        <div className='mt-5 lg:px-10'>
            {/* Main container with border */}
            <div className="border border-gray-200 rounded-lg ">
                <div className='lg:flex gap-5 justify-between p-6 '>
                    <ScrollArea className="h-screen lg:w-[69%] pr-2 ">
                        {/* Project Details Section with border */}
                        <div className='border border-gray-200 rounded-xl p-6 mb-6 bg-[#7BB3E8]'>
                            <div className='text-black pb-10 w-full  '>
                                <h1 className='text-lg font-semibold pb-5'>{projectData.name || 'Untitled Project'}</h1>
                                <div className='space-y-5 pb-10 text-sm'>
                                    <p className='w-full md:max-w-lg lg:max-w-xl'>
                                        {projectData.description || 'No description available'}
                                    </p>
                                    <div className='flex'>
                                        <p className='w-36'>Project Lead</p>
                                        <p>{projectData.owner?.username || projectData.projectLead || 'Not assigned'}</p>
                                    </div>
                                    <div className='flex'>
                                        <p className='w-36'>Members :</p>
                                        <div className='flex items-center gap-2'>
                                            {/* FIXED: Better key generation for team members */}
                                            {(projectData.team || []).map((member, index) => {
                                                // Create a unique key using multiple fallbacks
                                                const uniqueKey = member.id || member.userId || member.username || `member-${index}`;
                                                return (
                                                    <Avatar className="cursor-pointer" key={`team-${uniqueKey}-${index}`}>
                                                        <AvatarImage src={member.avatar} />
                                                        <AvatarFallback>{member.username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                                                    </Avatar>
                                                );
                                            })}
                                            {(!projectData.team || projectData.team.length === 0) && (
                                                <span className="text-gray-500">No members</span>
                                            )}
                                        </div>    
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button className=' ml-2 mt-1 bg-[#C49A7F]' size="sm" variant="outline" onClick={handleProjectInvitation}>
                                                    <span>
                                                        Invite
                                                    </span>
                                                    <PlusIcon className='w-3 h-3'/>
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Invite User</DialogTitle>
                                                </DialogHeader>
                                                <InviteUserForm/>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                    <div className='flex'>
                                        <p className='w-36'>Category :</p>
                                        <p>{projectData.category || 'Uncategorized'}</p>
                                    </div>
                                    <div className='flex'>
                                        <p className='w-36 '>Status :</p>
                                        <Badge className='bg-[#C49A7F]'>{projectData.status || 'In Progress'}</Badge>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tasks Section */}
                        <section>
                            <p className='py-5 border-b text-lg bg-[#7BB3E8] font-bold rounded-full -tracking-wider'>Tasks</p>
                            <div className='lg:flex md:flex gap-5 justify-between py-5'>
                                {/* FIXED: Add unique keys to IssueList components */}
                                <IssueList key="todo-list" status="pending" title="Todo List"/>
                                <IssueList key="in-progress-list" status="In-Progress" title="In Progress"/>
                                <IssueList key="done-list" status="done" title="Done"/>
                            </div>
                        </section>
                    </ScrollArea>
                    
        
                    <div className='lg:w-[30%] rounded-md lg:sticky lg:top-6 lg:h-fit lg:max-h-[calc(100vh-3rem)] lg:overflow-hidden'>
                        <div className='lg:h-full lg:overflow-y-auto'>
                            <ChatBox projectId={projectId}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProjectDetails