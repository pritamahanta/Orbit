import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import NavBar from "../shared/NavBar";

import axios from "axios";
import { toast } from "sonner";
import { JOB_API_END_POINT } from "@/utils/constants";

const EditJob = () => {

    const { jobId } = useParams();
    const navigate = useNavigate();

    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experienceLevel: "",
        position: "",
    });

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);


    // Fetch existing job
    useEffect(() => {

        const fetchJob = async () => {
            try {

                const response = await axios.get(
                    `${JOB_API_END_POINT}/get/${jobId}`,
                    {
                        withCredentials: true,
                    }
                );

                if (response.data.success) {

                    const job = response.data.job;

                    setInput({
                        title: job?.title || "",
                        description: job?.description || "",
                        requirements: job?.requirements || "",
                        salary: job?.salary || "",
                        location: job?.location || "",
                        jobType: job?.jobType || "",
                        experienceLevel: job?.experienceLevel || "",
                        position: job?.position || "",
                    });
                }

            } catch (error) {

    console.log("UPDATE ERROR:", error);
    console.log("STATUS:", error?.response?.status);
    console.log("DATA:", error?.response?.data);

    toast.error(
        error?.response?.data?.message ||
        "Failed to update job"
    );

            } finally {
                setLoading(false);
            }
        };

        fetchJob();

    }, [jobId]);


    const changeEventHandler = (e) => {

        setInput({
            ...input,
            [e.target.name]: e.target.value,
        });

    };


    const submitHandler = async (e) => {

        e.preventDefault();

        try {

            setUpdating(true);

            const response = await axios.put(
                `${JOB_API_END_POINT}/update/${jobId}`,
                input,
                {
                    withCredentials: true,
                }
            );

            if (response.data.success) {

                toast.success("Job updated successfully");

                navigate("/admin/jobs");
            }

        } catch (error) {

            console.log(error);

            toast.error(
                error?.response?.data?.message ||
                "Failed to update job"
            );

        } finally {
            setUpdating(false);
        }

    };


    if (loading) {

        return (
            <>
                <NavBar />

                <div className="flex justify-center items-center min-h-[60vh]">
                    <p className="text-gray-500">
                        Loading job details...
                    </p>
                </div>
            </>
        );

    }


    return (
        <>
            <NavBar />

            <div className="max-w-5xl mx-auto my-7 px-4">

                {/* Header */}
                <div className="mb-4">

                    <p className="text-gray-500 text-sm">
                        Update the details of your job posting.
                    </p>

                </div>


                {/* Form */}
                <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">

                    <form
                        onSubmit={submitHandler}
                        className="space-y-4"
                    >

                        {/* Job Title */}
                        <div className="space-y-1.5">

                            <Label htmlFor="title">
                                Job Title
                            </Label>

                            <Input
                                id="title"
                                name="title"
                                value={input.title}
                                onChange={changeEventHandler}
                                placeholder="e.g. Software Engineer"
                                className="h-9"
                            />

                        </div>


                        {/* Description */}
                        <div className="space-y-1.5">

                            <Label htmlFor="description">
                                Description
                            </Label>

                            <textarea
                                id="description"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                                placeholder="Write a description for this position..."
                                className="w-full min-h-24 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#cc1212] resize-none"
                            />

                        </div>


                        {/* Requirements */}
                        <div className="space-y-1.5">

                            <Label htmlFor="requirements">
                                Requirements
                            </Label>

                            <textarea
                                id="requirements"
                                name="requirements"
                                value={input.requirements}
                                onChange={changeEventHandler}
                                placeholder="e.g. React.js, Node.js, MongoDB, REST APIs"
                                className="w-full min-h-20 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#cc1212] resize-none"
                            />

                        </div>


                        {/* Salary + Location */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* Salary */}
                            <div className="space-y-1.5">

                                <Label htmlFor="salary">
                                    Salary
                                </Label>

                                <Input
                                    id="salary"
                                    name="salary"
                                    type="text"
                                    value={input.salary}
                                    onChange={changeEventHandler}
                                    placeholder="e.g. 90000"
                                    className="h-9"
                                />

                            </div>


                            {/* Location */}
                            <div className="space-y-1.5">

                                <Label htmlFor="location">
                                    Location
                                </Label>

                                <Input
                                    id="location"
                                    name="location"
                                    value={input.location}
                                    onChange={changeEventHandler}
                                    placeholder="e.g. London, United Kingdom"
                                    className="h-9"
                                />

                            </div>

                        </div>


                        {/* Job Type + Experience */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* Job Type */}
                            <div className="space-y-1.5">

                                <Label htmlFor="jobType">
                                    Job Type
                                </Label>

                                <select
                                    id="jobType"
                                    name="jobType"
                                    value={input.jobType}
                                    onChange={changeEventHandler}
                                    className="w-full h-9 rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-[#cc1212]"
                                >

                                    <option value="">
                                        Select job type
                                    </option>

                                    <option value="Full-time">
                                        Full-time
                                    </option>

                                    <option value="Part-time">
                                        Part-time
                                    </option>

                                    <option value="Contract">
                                        Contract
                                    </option>

                                    <option value="Internship">
                                        Internship
                                    </option>

                                </select>

                            </div>


                            {/* Experience */}
                            <div className="space-y-1.5">

                                <Label htmlFor="experienceLevel">
                                    Experience Level
                                </Label>

                                <select
                                    id="experienceLevel"
                                    name="experienceLevel"
                                    value={input.experienceLevel}
                                    onChange={changeEventHandler}
                                    className="w-full h-9 rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-[#cc1212]"
                                >

                                    <option value="">
                                        Select experience
                                    </option>

                                    <option value="0-1 years">
                                        0-1 years
                                    </option>

                                    <option value="1-2 years">
                                        1-2 years
                                    </option>

                                    <option value="2-4 years">
                                        2-4 years
                                    </option>

                                    <option value="4-6 years">
                                        4-6 years
                                    </option>

                                    <option value="6+ years">
                                        6+ years
                                    </option>

                                </select>

                            </div>

                        </div>


                        {/* Number of Positions */}
                        <div className="space-y-1.5">

                            <Label htmlFor="position">
                                Number of Positions
                            </Label>

                            <Input
                                id="position"
                                name="position"
                                type="number"
                                min="1"
                                value={input.position}
                                onChange={changeEventHandler}
                                placeholder="e.g. 2"
                                className="h-9"
                            />

                        </div>


                        {/* Buttons */}
                        <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => navigate("/admin/jobs")}
                                disabled={updating}
                            >
                                Cancel
                            </Button>


                            <Button
                                type="submit"
                                size="sm"
                                disabled={updating}
                                className="bg-[#cc1212] hover:bg-[#b01010] text-white"
                            >

                                {updating
                                    ? "Updating..."
                                    : "Update Job"
                                }

                            </Button>

                        </div>

                    </form>

                </div>

            </div>
        </>
    );
};

export default EditJob;