import { Button } from '../../components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog"
import { useDispatch, useSelector } from 'react-redux';

import ProjectForm from '../Project/ProjectForm'
import { PersonIcon } from '@radix-ui/react-icons'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../Redux/Auth/Action';

const Navbar = () => {
  
    const {auth} = useSelector(store => store)
  const  navigate=useNavigate();
  const dispatch = useDispatch()


const handleLogout = () => {
  dispatch(logout());
  navigate("/");
};
  return (
    <div className='sticky top-0 z-50 bg-white border-b py-4 px-5 flex items-center justify-between'>
      <div
  className="flex items-center text-black gap-3 bg-cover bg-center px-4 py-2 rounded"
  style={{ backgroundImage: "url('/Assests/team.jpg')" }}
>
  <p
    onClick={() => navigate("/")}
    className="cursor-pointer text-black"
  >
    Project Management
  </p>

        <Dialog>
          <DialogTrigger asChild>
            <Button className='text-black' variant="ghost">New Project</Button>
          </DialogTrigger>

          <DialogContent className='bg-[#7BB3E8] text-black'>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription className='text-black'>Fill out the form below to create a new project.</DialogDescription>
            </DialogHeader>

            <ProjectForm />
          </DialogContent>
        </Dialog>
        <Button onClick ={()=> navigate("/upgrade_plan")} variant="default" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
          Upgrade
        </Button>
      </div>
      
      <div className='flex gap-3 items-center'>
        <p className='text-sm font-medium text-black'>{auth.user?.username}</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <PersonIcon className="h-4 w-4 text-black " />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick ={handleLogout}className="text-red-600">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default Navbar
