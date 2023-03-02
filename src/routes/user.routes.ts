import { Router } from "express";
import userController from "../controllers/user.controller";
import authController from "../controllers/auth.controller";
import validator from "../validator";
import userValidator from "../validator/user.validator";

const router : Router = Router()

router
   .route('/users')
   .get(authController.checkAuthentication,userController.getAllUsers)

router
   .route('/users/:id')
   .post(userController.updateUser)
   .get(authController.checkAuthentication,userController.getUserById)
   .put(authController.checkAuthentication,authController.checkAuthorization,userController.updateUser)
   .delete(authController.checkAuthorization,userController.deleteUser)

router
   .route('/forgetPassword')
   .post(validator(userValidator.forgotPasswordSchema),userController.forgetPassword)
export default router
