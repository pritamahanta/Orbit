import { Job } from "../models/job.model.js";
import redis from "../config/redis.js";

export const postJob = async (req, res) => {
    try {
        const {
            title,
            description,
            requirements,
            salary,
            location,
            jobType,
            experienceLevel,
            position,
            companyId
        } = req.body;

        const userId = req.id;

        console.log(req.body, req.id);

        if (
            !title ||
            !description ||
            !requirements ||
            !salary ||
            !location ||
            !jobType ||
            !experienceLevel ||
            !position ||
            !companyId
        ) {
            return res.status(400).json({
                message: "Something is missing.",
                success: false
            });
        }

        const job = await Job.create({
            title,
            description,
            requirements,
            salary: Number(salary),
            location,
            jobType,
            experienceLevel,
            position,
            company: companyId,
            created_by: userId
        });

        const keys = await redis.keys("jobs:*");

        if (keys.length > 0) {
            await redis.del(keys);
        }

        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";

        // check redis ;

        const cache_key = `jobs:${keyword}`;
        const cached_jobs = await redis.get(cache_key) ;

        // redis hit 

        if(cached_jobs) {
            return res.status(200).json({
                jobs: JSON.parse(cached_jobs),
                success: true,
                source: "redis"
            });
        }

        // redis miss
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };
        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({ createdAt: -1 });

        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };

        // store result in redis 
        await redis.set(cache_key, JSON.stringify(jobs), "EX", 60) ;

        return res.status(200).json({ 
            jobs,
            success: true,
            source: "mongodb"
        })
    } 
    catch (error) {
        console.log(error);
          return res.status(500).json({ message: "Server error", success: false });
    }
}
// student
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;

    const cache_key = `job:${jobId}` ;
    const cached_job = await redis.get(cache_key) ;

    // redis hit
    if(cached_job) {
        return res.status(200).json({
            job: JSON.parse(cached_job), 
            success: true,
            source: "redis"
        })
    }

    // redis miss;
    const job = await Job.findById(jobId)
      .populate("company")
      .populate("applications");

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false
      });
    }

    // set in redis
    await redis.set(cache_key, JSON.stringify(job), "EX", 60) ;

    return res.status(200).json({ 
        job, 
        success: true,
        source: "mongodb" 
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// admin kitne job create kra hai abhi tk
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path:'company',
            createdAt:-1
        });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}