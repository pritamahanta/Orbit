import React from 'react'
import { Button } from './ui/button'
import { Bookmark } from 'lucide-react'
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export const JobCard = ({job}) => {
  const navigate = useNavigate() ;

  const daysAgoFunction = (mongodbTime) => {
    const createdTime = new Date(mongodbTime) ;
    const currentTime = new Date() ;
    const timeDifference = currentTime - createdTime ;

    return Math.floor(timeDifference / (60 * 60 * 24 * 1000));
  }
 
  return (
    <div className='gap-5 border border-gray-200 shadow-xl p-4 rounded-xl'>
      <div className='mx-auto flex items-center justify-between'>
        <p className='text-sm text-gray-500'> {daysAgoFunction(job?.createdAt) > 0 ? `${daysAgoFunction(job?.createdAt)} days ago` : 'Today'} </p>
        <Button variant="ghost" className="rounded-full" size="icon">
          <Bookmark /> save
        </Button>
      </div>

      <div className='flex items-center gap-4 mt-4'>
        <Avatar>
          <AvatarImage
            src= {job?.company?.logo}
            alt="Company Logo"
            className="w-10 h-10 rounded-full"
          />
        </Avatar>

        <div>
          <h1 className='font-semibold'>{job?.company?.name}</h1>
          <p className='text-sm text-gray-600'>{job?.location}</p>
        </div>
      </div>

      <div className='mt-4'>
        <h1 className='text-lg font-medium'>{job?.title}</h1>
        <p className='text-sm text-gray-700 mt-1'>
         {job?.description}
        </p>
      </div>
      <div className='flex items-center gap-2 mt-3'>
        <Badge className="font-bold text-[#cc1212]" variant="ghost">{job?.position} Positions</Badge>
        <Badge className="font-bold text-[#220c9d]" variant="ghost">{job?.jobType}</Badge>
        <Badge className="font-bold text-[#027512]" variant="ghost" >{job?.salary}</Badge>
      </div>
      <div className='flex items-center gap-3 mt-5 '>
        <Button variant = "ghost" className= " hover:bg-gray-200" onClick = {() => navigate(`/description/${job?._id}`)}>Details</Button>
        <Button variant = "ghost" className= "bg-[#cc1212] hover:bg-[#030101] text-white hover:text-white">Save for later</Button>
      </div>
    </div>
  )
}
