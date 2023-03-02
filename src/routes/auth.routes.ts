import express, { Router } from "express";
import authController from "../controllers/auth.controller";
import validator from "../validator";
import userValidator from "../validator/user.validator";

const router : Router = Router()
router.route('/register').post(validator(userValidator.registerSchema),authController.register)
router.route('/login').post(validator(userValidator.loginSchema),authController.login)
export default router