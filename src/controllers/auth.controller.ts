import { Request, Response, RequestHandler, NextFunction } from 'express'
import userService from '../services/user.service'
import AsyncHandler from 'express-async-handler'
import { HttpCode } from '../utils/httpCode'
import { Types } from 'mongoose'
import authService from '../services/auth.service'
import dotenv from 'dotenv'
import { DAY_IN_MILLISECOND, TokenEnum } from '../constants/constants'
import { EnvironmentEnum } from '../constants/constants'
import { user } from '../database/models/user.modal'
import JWT_Helper from '../utils/JWT_Helper'
import { ErrorHandler } from '../utils/errorHandler'
import { TokenData } from '../types/tokenData'
import userController from './user.controller'
import { sendEmail } from '../utils/Send_mail-v1'


dotenv.config()

const register: RequestHandler = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
   const { email, firstname, lastname, phone, password } = req?.body
   const registerData = await authService.register(firstname,
      lastname,
      phone,
      email.trim().toLowerCase(),
      password)
   res.cookie('refreshToken', registerData.refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === EnvironmentEnum.prod,
      maxAge: Number(process.env.COOKIE_EXPIRES_TIME) * DAY_IN_MILLISECOND
   })
   res.status(HttpCode.OK).json({
      success: "accepted",
      status: "user created successfuly",
      token: registerData.token,
      data: registerData.user
   })

})

const login: RequestHandler = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
   const { email, password } = req?.body


   // await sendEmail({
   //    email: 'psiabdou@gmail.com',
   //    subject: 'test',
   //    message: 'test'

   // }, false)

   const user = await authService.login(
      email.trim().toLowerCase(),
      password)
   res.cookie('refreshToken', user.refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === EnvironmentEnum.prod,
      maxAge: Number(process.env.COOKIE_EXPIRES_TIME) * DAY_IN_MILLISECOND
   })
   res.status(HttpCode.OK).json({
      success: "accepted",
      status: "user logged in with success",
      token: user.token,
      data: user.user
   })

})

const checkAuthorization = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
   const { id } = req?.params
   const authHeader = req.headers.authorization
   if (authHeader) {
      const token = authHeader.split(' ')[1] //get the token .
      const decodedToken = JWT_Helper.decodeJwtToken(token)
      const currentUserId = decodedToken.payload.id
      const curentUser = await userService.getUserById(currentUserId)
      if (curentUser?.role === 'user' && id !== currentUserId) {
         throw new ErrorHandler('we are not access to edit this user , only admins or the account owner', HttpCode.BAD_REQUEST)
      }
      next()
   }
})

const checkAuthentication = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
   const authHeader = req?.headers.authorization
   if (authHeader) {
      const token = authHeader.split(' ')[1] //get the token .
      const result = JWT_Helper.checkJWToken(token)
      if (result) {
         next()
      }
      else {
         const decodedToken = JWT_Helper.decodeJwtToken(token)
         const { refreshToken } = req?.cookies
         const id = decodedToken.payload.id
         const CheckUserInDB = await userService.getUserById(id)
         const payload: TokenData = {
            id: decodedToken.payload.id
         }
         const checkRefreshToken = JWT_Helper.ExtractToken(refreshToken, 'refresh')
         if (checkRefreshToken) {
            const newtoken = JWT_Helper.GenerateToken(payload, TokenEnum.access)
            res.status(HttpCode.OK).json({
               message: "Your session has been expired",
               token: newtoken
            })
         }
         else {
            throw new ErrorHandler('the JWT is no valid or expired resign .', HttpCode.BAD_REQUEST)
         }
      }
   }
   else {
      throw new ErrorHandler('You are not logged in for long time re-login !', HttpCode.FORBIDDEN)
   }
   next()
})
export default {
   register,
   login,
   checkAuthorization,
   checkAuthentication
}
