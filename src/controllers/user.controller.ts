import { Request, Response, RequestHandler, NextFunction } from 'express'
import userService from '../services/user.service'
import AsyncHandler from 'express-async-handler'
import { HttpCode } from '../utils/httpCode'
import { Types } from 'mongoose'
import { DEFAULT_CURRENT_PAGE, DEFAULT_PAGE_SIZE, TokenEnum } from '../constants/constants'
import JWT_Helper from '../utils/JWT_Helper'
import { ErrorHandler } from '../utils/errorHandler'
import { TokenData } from '../types/tokenData'
import authService from '../services/auth.service'

const getAllUsers:RequestHandler = AsyncHandler(
   async(req:Request,res:Response):Promise<void> =>{
      const {firstname , page , pageSize} = req?.query
      const reslut = await userService.getAllUsers(
         String(firstname || ''),
         Number(page|| DEFAULT_CURRENT_PAGE),
         Number(pageSize || DEFAULT_PAGE_SIZE)
      )
      res.status(HttpCode.OK).json({
         success:true,
         message:'success',
         data:reslut
      })

    
      
})


const createUser:RequestHandler = AsyncHandler(async(req:Request,res:Response):Promise<void>=>{
   const user = await userService.createUser(req.body)
   res.status(HttpCode.CREATED).json({
      success:true,
      message:"user is create successfully",
      data:user
   })
})

const getUserById:RequestHandler = AsyncHandler(async(req:Request,res:Response):Promise<void>=>{
   const {id} = req?.params
   const user = await userService.getUserById(new Types.ObjectId(id))
   res.status(HttpCode.OK).json({
      success:true,
      message:"here is the user",
      data:user
   })
})

const updateUser:RequestHandler = AsyncHandler(async(req:Request,res:Response)=>{
   const {id} = req?.params
   const user = req?.body
   if (user.password){
        const hashedPassword = await JWT_Helper.passwordHashing(user?.password)
        delete user.password
        user.password=hashedPassword
   }
   const updatedUser = await userService.updateUser(new Types.ObjectId(id), user)
   res.status(HttpCode.ACCEPTED).json({
      success:true,
      message:"The user is updated successfully",
      data:updatedUser
   })
})

const deleteUser:RequestHandler = AsyncHandler(async(req:Request,res:Response)=>{
   const {id} = req?.params
   const reslut = await userService.deleteUser(new Types.ObjectId(id))
   res.status(HttpCode.OK).json({
      success:true,
      message:"The user is deleted successfully",
      data:reslut
   })
})

const forgetPassword:RequestHandler = AsyncHandler(async(req:Request,res:Response)=>{
   const {email}:{email:string}=req?.body
   await userService.forgetPassword(email.trim().toLocaleLowerCase())
   res.status(HttpCode.OK).json({
      success:true,
      message:`Email has been sent ot ${email}`
   })
})



export default {
   getAllUsers,
   createUser,
   getUserById,
   updateUser,
   deleteUser,
   forgetPassword
}