import React from 'react'
import {
  Avatar,
  AvatarFallback
} from '@/Components/ui/avatar'
import { useSelector, useDispatch } from 'react-redux'
import { assignIssueToUser } from '../../Redux/Issue/Action'

const UserList = ({issueDetails}) => {
  const {project} = useSelector(store=>store)
  const dispatch = useDispatch()
  
  // Better handling of project data structure
  const projectData = project.projectDetails?.data || project.projectDetails;
  
  
  const handleAssignIssueToUser = (userId) => {
    
    // Fixed: Pass separate parameters instead of object
    dispatch(assignIssueToUser(issueDetails.id, userId));
  }
  
  
  // Guard clause to prevent errors if data is not loaded
  if (!projectData || !projectData.team) {
    return <div>Loading team members...</div>;
  }
  
  return (
    <>
      <div className='space-y-2'>
        <div className='border rounded-md'>
          {/* Fixed: Better handling of assignee display */}
          <p className='py-2 px-3'>
            {issueDetails?.assignee?.username || "Unassigned"}
          </p>
        </div>
        
        {/* Debug: Log the team data structure */}
        {projectData.team.map((item) => {
          return (
            <div 
              onClick={() => handleAssignIssueToUser(item.userId)} 
              key={item.userId} 
              className='py-2 group hover:bg-slate-800 cursor-pointer flex items-center space-x-4 rounded-md border px-4'
            >
            <Avatar>
              <AvatarFallback>
                {/* Fixed: Safe access to username */}
                {item.username?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className='space-y-1'>
              <p className='text-sm leading-none'>{item.username}</p>
              <p className='text-sm text-muted-foreground'>
                @{item.username?.toLowerCase() || 'unknown'}
              </p>
            </div>
                      </div>
          );
        })}
      </div>
    </>
  )
}

export default UserList