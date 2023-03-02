import { Types } from "mongoose";
import userRepository from "../database/repositories/user.repository";
import { HttpCode } from "../utils/httpCode";
import User from "../database/models/user.modal";
import user from "../database/models/user.modal";
import { ErrorHandler } from "../utils/errorHandler";
import multer from 'multer';
import { TokenExpiredError } from "jsonwebtoken";
import { TokenData } from "../types/tokenData";
import JWT_Helper from "../utils/JWT_Helper";
import { TokenEnum } from "../constants/constants";
import { sendEmail } from "../utils/Send_mail-v1";
const upload = multer({ dest: '../images' })

const getAllUsers = async (firstname: string, page: number, pageSize: number) => {
   const options = {
      page: page,
      limit: pageSize,
   }
   const { docs, ...meta } = await userRepository.getAll({}, options, {
      firstname,
   })
   docs.forEach((el: object) => {
      //@ts-ignore
      delete el?.password
   })
   return { docs, meta }
}

const createUser = async (TheUser: User) => {
   const createdUser = await userRepository.create(TheUser)
   return createdUser
}

const getUserById = async (id: Types.ObjectId) => {
   const user = await userRepository.getById(id)
   if (!user) {
      throw new ErrorHandler('USER NOT FOUND !!!', HttpCode.NOT_FOUND)
   }
   //@ts-ignore
   delete user?.delete
   return user
}

const updateUser = async (id: Types.ObjectId, user: User) => {
   const USER = await userRepository.getById(id)
   if (!USER) {
      throw new ErrorHandler("USER NOT FOUND !!!", HttpCode?.NOT_FOUND)
   }
   const newUSer = await userRepository.edit(id, user)

   return newUSer
}


const deleteUser = async (id: Types.ObjectId) => {
   const USER = await userRepository.getById(id)

   if (!USER) {
      throw new ErrorHandler('USER NOT FOUND !!!', HttpCode.NOT_FOUND)
   }
   await userRepository.remove(id)
   //@ts-ignore
   delete USER.password
   return USER
}

const forgetPassword = async (email: string): Promise<string> => {
   const user = await userRepository.getOneByQuery({ email })
   const subject = "verify your Identity"
   const message = "hello user we think that you requested an e-mail reset code . if you did not request this code plz ignore this message"
   // const EMAIL = user?.email
   // try {
   //    await sendEmail({EMAIL,subject,message})
   // } catch (error) {
   //    throw new ErrorHandler('Error occur when sending email',HttpCode.BAD_REQUEST)
   // }
   return email
}

const uploadFile = async (filename: string) => {
   if (!filename) {
      throw new ErrorHandler('', HttpCode.BAD_REQUEST)
   }



}
export default {
   getAllUsers,
   createUser,
   getUserById,
   updateUser,
   deleteUser,
   forgetPassword
}