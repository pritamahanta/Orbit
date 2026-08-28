import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams, } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { setSingleJob } from '@/redux/jobSlice';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constants';

export const JobDescription = () => {
    const params = useParams();
    const jobId = params.id;

    console.log(jobId) ;
    const { singleJob } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const isInitiallyApplied = Array.isArray(singleJob?.applications) ? singleJob.applications.some(application => application.applicant === user?._id) : false;
    const [isApplied, setisApplied] = useState(isInitiallyApplied);

    const applyJobHandler = async () => {
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, { withCredentials: true });
            console.log(res);

            if (res.data.success) {
                setisApplied(true); // the user applied for the job
                const updatedSingleJob = { ...singleJob, applications: [...(singleJob.applications || []), { applicant: user?._id }] }; // from now the user is also a applicant for the job
                dispatch(setSingleJob(updatedSingleJob)); // for real time ui updation
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    }

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
                    withCredentials: true,
                });
                if (res.data.success) {
                    console.log("Fetched job", res.data.job);
                    dispatch(setSingleJob(res.data.job));
                    setisApplied(Array.isArray(res.data.job.applications) ? res.data.job.applications.some(app => app.applicant === user?._id) : false);
                }
            } catch (error) {
                console.log(error.response?.data || error.message);
                toast.error(error.response?.data?.message || "Something went wrong");
            }
        }
        fetchSingleJob();
    }, [jobId, dispatch, user?._id]);

    return (
        <div className='max-w-5xl mx-35 my-20'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='font-bold text-2xl'>{singleJob?.company?.name}</h1>
                    <div className='flex items-center gap-2 mt-3'>
                        <Badge className="font-bold text-[#cc1212]" variant="ghost">Positions {singleJob?.position} </Badge>
                        <Badge className="font-bold text-[#220c9d]" variant="ghost"> {singleJob?.jobType} </Badge>
                        <Badge className="font-bold text-[#027512]" variant="ghost" >{singleJob?.salary} LPA</Badge>
                    </div>
                </div>

                <div className='h-1 w-1'>
                    <Button
                        onClick={isApplied ? null : applyJobHandler} disabled={isApplied}
                        className={`rounded-lg ${isApplied ? `bg-gray-500 cursor-not-allowed` : `bg-[#cc1212] hover:bg-[#030101] cursor-pointer`}`}>
                        {
                            isApplied ? "Already Applied" : "Apply Now"
                        }
                    </Button>
                </div>
            </div>
            <h1 className='my-5 font-bold text-xl border-b-4 border-b-gray-200'>Job Details</h1>
            <div className='my-8'>
                <h1 className='font-bold my-1'>Role: <span className='pl-4 text-gray-800 font-medium'>{singleJob?.title}</span></h1>
                <h1 className='font-bold my-1'>Location: <span className='pl-4 text-gray-800 font-medium'>{singleJob?.location}</span></h1>
                <h1 className='font-bold my-1'>Description: <span className='pl-4 text-gray-800 font-medium'> {singleJob?.description} </span> </h1>
                <h1 className='font-bold my-1'>Experience: <span className='pl-4 text-gray-800 font-medium'>{singleJob?.experienceLevel}</span></h1>
                <h1 className='font-bold my-1'>Salary: <span className='pl-4 text-gray-800 font-medium'>{singleJob?.salary}</span></h1>
                <h1 className='font-bold my-1'>Total Applicants: <span className='pl-4 text-gray-800 font-medium'> {Array.isArray(singleJob?.applications) ? 
                singleJob.applications.length : 0} </span></h1>
                <h1 className='font-bold my-1'>Posted Data: <span className='pl-4 text-gray-800 font-medium'>{singleJob?.createdAt}</span></h1>
            </div>
        </div>
    )
}
