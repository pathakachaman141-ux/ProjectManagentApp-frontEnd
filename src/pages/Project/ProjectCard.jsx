import React, { useEffect } from 'react'
import { Card } from '@/Components/ui/Card'
import { Badge } from "@/Components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/Dropdown-menu"

import { Button } from '@/Components/ui/Button'
import { DotFilledIcon, DotsVerticalIcon } from '@radix-ui/react-icons'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { deleteProject } from '../../Redux/Project/Action'

const ProjectCard = ({ item }) => { // ✅ Added item prop
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      dispatch(deleteProject(item.id))
    }
  }

  const handleEdit = () => {
    // You can implement edit functionality here
    navigate(`/project/${item.id}/edit`)
  }

  const handleShare = () => {
    // You can implement share functionality here
    alert(`Sharing project: ${item.name}`)
  }


  return (
    <Card className='p-5 w-full lg:max-w-3xl bg-[#7BB3E8]'>
      <div className='space-y-5 text-black' >
        <div className='space-y-2'>
          <div className='flex justify-between'>
            <div className='flex items-center gap-5 '>
              <h1 
                onClick={() => navigate(`/project/${item.id}`)} 
                className='cursor-pointer font-bold text-lg hover:text-blue-600 transition-colors text-black'
              >
                {item.name|| 'Untitled Project'} {/* ✅ Use actual project name */}
              </h1>
              <DotFilledIcon />
              <p className='text-sm text-black'>
                {item.category || 'uncategorized'} {/* ✅ Use actual category */}
              </p>
            </div>
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className='rounded-full' variant="ghost" size="icon">
                    <DotsVerticalIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={handleEdit}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleShare}>
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <p className='text-black text-sm'>
            {item.description || 'No description provided.'} {/* ✅ Use actual description */}
          </p>
        </div>
        <div className='flex flex-wrap gap-2 items-center'>
          {/* ✅ Use actual tags instead of hardcoded ones */}
          {item.tags && item.tags.length > 0 ? (
            item.tags.map((tag, index) => (
              <Badge className = "bg-[#D49266CC] text-black"key={index} variant="outline">
                {tag}
              </Badge>
            ))
          ) : (
            <Badge variant="outline">No tags</Badge>
          )}
        </div>
      </div>
    </Card>
  )
}

export default ProjectCard