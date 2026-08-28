import { z } from "zod";

export const registerSchema = z.object({
    fullName: z
        .string()
        .min(2, "Full name must be at least 2 characters")
        .max(50, "Full name must be at most 50 characters")
        .trim(),

    email: z
        .string()
        .email("Please provide a valid email")
        .trim()
        .toLowerCase(),

    phoneNumber: z
        .string()
        .min(10, "Phone number must be at least 10 characters")
        .max(15, "Phone number must be at most 15 characters")
        .trim(),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters"),

    role: z.enum(["student", "recruiter"])
});