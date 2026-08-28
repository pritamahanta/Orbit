import express from "express";
import { login, logout, register, updateProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {singleUpload} from "../middlewares/multer.js"
import rateLimiter from "../middlewares/rateLimiter.js";
import validate from "../middlewares/validate.middleware.js";
import { registerSchema } from "../validations/user.validation.js";

 
const router = express.Router();

router.route("/register").post(rateLimiter, singleUpload, validate(registerSchema), register);
router.route("/login").post(rateLimiter, login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated, singleUpload, updateProfile);

export default router;
