import React from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import UserList from './UserList'

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/Components/ui/dropdown-menu'
import {
  DotsVerticalIcon,
  PersonIcon
} from '@radix-ui/react-icons'
import {
  Avatar,
  AvatarFallback
} from '@/Components/ui/avatar'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { deleteIssue, getIssuesByProjectId } from '../../Redux/Issue/Action'

const IssueCard = ({item, projectId}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      // Delete the issue
      await dispatch(deleteIssue(item.id));
      // Refetch the issues for the project to refresh the list
      dispatch(getIssuesByProjectId(projectId));
    } catch (error) {
     
    }
  }

  return (
    <Card className="rounded-md py-1 pb-2">
      <CardHeader className="py-0 pb-1 space-y-2">
        <div className="flex justify-between items-center">
          <CardTitle 
            className="cursor-pointer" 
            onClick={() => navigate(`/project/${projectId}/issue/${item.id}`)}
          >
            {item.title}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-full" size="icon" variant="ghost">
                <DotsVerticalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>In Progress</DropdownMenuItem>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Done</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      {/* Fixed: Moved CardContent outside CardHeader and fixed invalid CSS class */}
      <CardContent className="p-0 pt-2 px-4">
        <div className="flex items-center justify-between">
          {/* You might want to use a dynamic identifier from item */}
          <p className="text-sm text-muted-foreground">{item.identifier || "FBP - 1"}</p>
          {/* Fixed: Removed invalid CSS class 'w--[30rem]' */}
          <DropdownMenu className="border border-red-400">
            <DropdownMenuTrigger>
              <Button
                size="icon"
                className="bg-gray-900 hover:text-black text-white rounded-full"
              >
                <Avatar>
                  <AvatarFallback>
                    <PersonIcon />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <UserList issueDetails={item}/>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
}

export default IssueCard