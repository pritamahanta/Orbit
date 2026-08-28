import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover.jsx"
import { Avatar, AvatarImage } from "../ui/avatar.jsx"
import { Button } from "../ui/button.jsx";
import { LogOut, User2 } from "lucide-react";
import { useDispatch, useSelector, useStore } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constants.js';
import { setUser } from '@/redux/authSlice.js';
import { toast } from 'sonner';


export default function NavBar() {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, {
                withCredentials: true,
            });

            if (res.data.success) {
                dispatch(setUser(null));
                navigate('/');
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    }

    return (
        <div className="bg-white p-4 shadow">

            <div className='flex items-center justify-between mx-auto max-w-7xl h-16'>
                {/* left part */}
               <Link to ='/'>
                <div>
                    <h1 className="text-3xl font-bold">
                        <span className="text-[#cc1212] ">O</span>rbit
                    </h1>
                </div>
               </Link>
                {/* right part */}
                <div className='flex items-center gap-12' >
                    <ul className='flex font-medium gap-5'>
                        {
                            user && user.role === 'Recruiter' ? (
                                <>
                                    <li> <Link to="/admin/companies">Companies</Link></li>
                                    <li> <Link to="/admin/jobs">Jobs</Link></li>
                                </>
                            ) : (
                                <>
                                    <li> <Link to="/">Home</Link></li>
                                    <li> <Link to="/jobs">Jobs</Link></li>
                                    <li> <Link to="/browse">Browse</Link></li></>
                            )
                        }
                    </ul>
                    {
                        // ternary operator 
                        !user ? (
                            <div className='flex items-center gap-1' >
                                <Link to="/login"><Button variant="outline" className=" hover:bg-gray-200"> Login </Button> </Link>
                                <Link to="/signup"><Button className="bg-[#cc1212] hover:bg-[#030101]"> SignUp </Button></Link>
                            </div>
                        ) :
                            (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Avatar className="cursor-pointer">
                                            <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />
                                        </Avatar>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <div className='flex gap-5 space-y-4'>
                                            <Avatar className="cursor-pointer">
                                                <AvatarImage onClick = {() => navigate('/profile') } src={user?.profile?.profilePhoto} alt="@shadcn" />
                                            </Avatar>
                                            <div>
                                                <h4 className='font-medium'>{user?.fullName}</h4>
                                                <p className='text-xs text-muted-foreground'>{user?.profile?.bio}</p>
                                            </div>
                                        </div>
                                        <div className=' mx-4 my-1 gap-6 pt-4 text-gray-600 '>
                                           {
                                            user && user.role === "Student" &&  <div className='flex text-sm'>
                                                <User2 /> <Button variant="link"> <Link to="/profile">View Profile</Link></Button>
                                            </div>
                                           }
                                            <div className='flex text-sm' onClick={logoutHandler}>
                                                <LogOut /> <Button variant="link">Logout</Button>
                                            </div>
                                        </div>

                                    </PopoverContent>
                                </Popover>
                            )
                    }
                </div>
            </div>
        </div>
    );
}
