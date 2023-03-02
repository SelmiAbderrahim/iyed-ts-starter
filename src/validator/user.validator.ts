import Joi from "joi";  


const loginSchema = Joi.object({
   email:Joi.string().email().required(),
   password:Joi.string().min(6).max(20).required()
})

const registerSchema = Joi.object({
   firstname:Joi.string().min(3).max(20).required(),
   lastname:Joi.string().min(3).max(20).required(),
   phone:Joi.string().optional().pattern(/^[0-9]+$/).length(8),
   email:Joi.string().email().required(),
   password:Joi.string().min(6).max(20).required(),
})

const updateProfile = Joi.object({
   firstname: Joi.string().required(),
   email: Joi.string().email().required(),
})

const updateProfilePassword = Joi.object({
   oldPassword: Joi.string().min(8).max(20).required(),
   password: Joi.string().min(8).max(20).required(),
   confirmPassword : Joi.ref('password')
 })

 const forgotPasswordSchema = Joi.object({
   email: Joi.string().email().required(),
 })
 
 const resetPasswordSchema = Joi.object({
   password: Joi.string().min(8).max(20).required(),
   confirmPassword: Joi.ref('password'),
   token: Joi.string().required(),
 })


export default {
   loginSchema,
   registerSchema,
   updateProfile,
   updateProfilePassword,
   forgotPasswordSchema,
   resetPasswordSchema,
 }
 