import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";
import asyncHandler from "../utils/asyncHandler.js";

export const register = asyncHandler(async (req, res) => {
    const { fullName, email, phoneNumber, password, role } = req.body;

    const file = req.file;
    let fileUri;
    let cloudResponse;

    if (file) {
        fileUri = getDataUri(file);
        cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return res.status(400).json({
            message: "User already exists with this email.",
            success: false,
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        fullName,
        email,
        phoneNumber,
        password: hashedPassword,
        role,
    });

    if (cloudResponse) {
        newUser.profile = {
            ...newUser.profile,
            profilePhoto: cloudResponse.secure_url
        };

        await newUser.save();
    }

    return res.status(201).json({
        message: "Account created successfully.",
        success: true
    });
});


export const login = asyncHandler( async (req, res) => {

        const { email, password, role } = req.body;

        // console.log({ email, password, role });
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };

        // check role is correct or not

        if (role.toLowerCase() !== user.role.toLowerCase()) {
            console.log(role, user.role);
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            })
        };

        const tokenData = {
            userId: user._id
        }
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullName}`,
            user,
            success: true
        })
});

export const logout = asyncHandler( async (req, res) => {
  
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
})

export const updateProfile = asyncHandler( async (req, res) => {
  
        const { fullName, email, phoneNumber, bio, skills } = req.body;

        // cloudinary ayega idhar
        const file = req.file;
        let fileUri = null;
        let cloudResponse = null;

        if (file) {
            fileUri = getDataUri(file); // the file is being converted into an uri 
            cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                resource_type: "raw",
            });
            console.log("Cloudinary upload response:", cloudResponse);
        }


        let skillsArray;
        if (skills) {
            skillsArray = skills.split(",");
        }
        const userId = req.id; // middleware authentication
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            })
        }
        // updating data
        if (fullName) user.fullName = fullName
        if (email) user.email = email
        if (phoneNumber) user.phoneNumber = phoneNumber
        if (bio) user.profile.bio = bio
        if (skills) user.profile.skills = skillsArray

        if (cloudResponse) {
            user.profile.resume = cloudResponse.secure_url;
            user.profile.resumeOriginalName = file.originalname;
        }

        await user.save();

        user = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).json({
            message: "Profile updated successfully.",
            user,
            success: true
        })
});