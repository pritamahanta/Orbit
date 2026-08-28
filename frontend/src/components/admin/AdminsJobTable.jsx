import React, { useEffect, useState } from 'react'
import { Table, TableCaption, TableHead, TableHeader, TableBody, TableRow, TableCell, } from '../ui/table'

import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover'
import { Edit2, Eye, MoreHorizontal } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'


export const AdminsJobTable = () => {
    
    const { searchJobByText } = useSelector(store => store.job) || "";
    const { allAdminJobs } = useSelector(store => store.job) || [];

    console.log(allAdminJobs) ;

    const [filterJobs, setFilterJobs] = useState(allAdminJobs);
    const navigate = useNavigate();

    useEffect(() => {
        const filteredJobs = allAdminJobs.length >= 0 && allAdminJobs.filter((job) => {
            if (!searchJobByText) {
                return true ;
            };
            return job?.company?.name.toLowerCase().includes(searchJobByText.toLowerCase()) 
            || job?.title.toLowerCase().includes(searchJobByText.toLowerCase()) ;

        });
        setFilterJobs(filteredJobs);
    }, [allAdminJobs, searchJobByText]);

    if (allAdminJobs.length === 0) {
        return (
            <div className="p-4 text-center text-gray-600">
                You haven't posted any job yet.
            </div>
        );
    }

    return (
        <Table>
            <TableCaption>A List of your recent posted jobs</TableCaption>

            <TableHeader>
                <TableRow>
                    <TableHead>Company Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {filterJobs.map(job => (
                    <TableRow key={job._id}>
                        <TableCell>{job?.company?.name}</TableCell>
                        <TableCell>{job?.title}</TableCell>
                        <TableCell>{new Date(job?.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                            <Popover>
                                <PopoverTrigger>
                                    <MoreHorizontal />
                                </PopoverTrigger>
                                <PopoverContent className="w-32">
                                    <div className="flex items-center gap-2 cursor-pointer" onClick={(e) => navigate(`/admin/jobs/${job?._id}`)}>
                                        <Edit2 />
                                        <span>Edit</span>
                                    </div>
                                    <div onClick = {() => navigate(`/admin/jobs/${job._id}/applicants`)}  className ='flex justify-center items-center w-fit gap-2 cursor-pointer mt-2 '>
                                        <Eye/> 
                                        <span className='w-4'>Applicants</span>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
