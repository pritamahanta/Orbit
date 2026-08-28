import React, { useState } from 'react'
import NavBar from './shared/NavBar'
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from '@radix-ui/react-label'
import { AppliedJobsTable } from './AppliedJobsTable'
import { UpdateProfile } from './UpdateProfile'
import { useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useGetAppliedJobs } from '@/hook/useGetAppliedJobs'


export const Profile = () => {
  useGetAppliedJobs() ;
  const [open, setOpen] = useState(false);
  const { user } = useSelector(store => store.auth);

  const isResume = true;
  return (
    <div>
      <NavBar />
      <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
        <div className='flex justify-between items-center w-full'>
          <div className='flex items-center gap-6'>
            <Avatar>
              <AvatarImage
                src= {user?.profile?.profilePhoto || "https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png"}
                alt="profile"
                className='h-20 w-20 rounded-full'
              />
            </Avatar>
            <div>
              <h1 className='text-xl font-semibold'>{user?.fullName}</h1>
              <p className='text-gray-600 text-sm'>
                {user?.profile?.bio}
              </p>
            </div>
          </div>
          <Button onClick={() => setOpen(true)} variant="outline">
            <Pen className="w-4 h-4" />
          </Button>
        </div>
        <div className='my-3'>
          <div className='my-3 flex gap-5'>
            <Mail /> <span>{user?.email}</span>
          </div>
          <div className='my-3 flex gap-5'>
            <Contact /> <span>{user?.phoneNumber}</span>
          </div>
        </div>
        <div>
          <h1>Skills</h1>

          <div className='flex items-center gap-2'>
            {
              user?.profile?.skills.length ? user?.profile?.skills.map((item, index) => {
                return (
                  <Badge
                    key={index} > {item}
                  </Badge>
                )
              }) :
                (
                  <span>NA</span>
                )
            }
          </div>
        </div>
        <div className='m-2'>
          <div>
            <Label className='text-lg font-bold'>
              Resume
            </Label>
          </div>
          <div>
            {
              isResume ? <a target='_blank' href= {user?.profile?.resume} className='text-blue-500 hover:underline cursor-pointer' >{user?.profile?.resumeOriginalName}</a> : <span>NA</span>
            }
          </div>
        </div>
      </div>
      <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
        <h1 className='text-xl font-bold mb-3'>Applied Jobs</h1>
        <AppliedJobsTable />
      </div>
      <UpdateProfile setOpen={setOpen} open={open} />
    </div >
  )
}
