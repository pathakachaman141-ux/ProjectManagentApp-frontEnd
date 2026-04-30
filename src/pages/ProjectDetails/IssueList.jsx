import { Button } from '@/Components/ui/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/Components/ui/dialog"
import { Card, CardHeader, CardContent, CardFooter } from '@/Components/ui/card'

import CreateIssueForm from './CreateIssueForm'

import IssueCard from './IssueCard'
import { PlusIcon } from '@radix-ui/react-icons'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { getIssuesByProjectId } from '../../Redux/Issue/Action'


 
const IssueList = ({title, status}) => {
  const dispatch = useDispatch();
  const {issue} = useSelector(store=>store)
  const {id} = useParams();

  useEffect(()=>{
    dispatch(getIssuesByProjectId(id))
  },[id])
  return (
    <div>
      <Dialog>
        <Card className="w-full bg-[#7BB3E8] md:w-[300px] lg:w-[310px]">
            <CardHeader>
                {title}
            </CardHeader>
            <CardContent className="px-2">
                <div className='space-y-2'> 
                    {issue.issues.filter((issue=>issue.status===status)).map((item)=><IssueCard projectId={id} key={item.id} item={item}/>)}

                </div>
            </CardContent>

            <CardFooter>
                <DialogTrigger>
                    <Button variant="outline" className="w-fulll bg-[#C49A7F] flex items-center gap-2">
                        <PlusIcon/>
                        Create Issue</Button>
                </DialogTrigger>
            </CardFooter>
        </Card>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Create New Issue</DialogTitle>
            </DialogHeader>
            <CreateIssueForm status={status}/>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default IssueList
