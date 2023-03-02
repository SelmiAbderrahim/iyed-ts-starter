import userRepository from "../database/repositories/user.repository";
import JWT_Helper from "../utils/JWT_Helper";
import { HttpCode } from "../utils/httpCode";
import { ErrorHandler } from "../utils/errorHandler";
import { TokenData } from "../types/tokenData";
import { TokenEnum } from "../constants/constants";
import userService from "./user.service";

const register = async(
   firstname: string,
   lastname: string,
   phone: string,
   email: string,
   password: string) => {
      let exists = await userRepository.getOneByQuery({email})

      if (exists){
         throw new ErrorHandler('the email already used !',HttpCode.FORBIDDEN)
      }
      password = await JWT_Helper.passwordHashing(password)
      const user = await userRepository.create(
       { firstname,
         lastname,
         phone,
         email,
         password}
      )
      user.role = "user"
       
      const payload : TokenData = {
         id : user?._id,
      }
      const token = JWT_Helper.GenerateToken(payload,TokenEnum.access)
      const refresh = JWT_Helper.GenerateToken(payload,TokenEnum.refresh)
       //@ts-ignore
       user.password = undefined
      return {token , refresh ,user}
      
}

const login = async(
   email:string, 
   password:string)=> {
      const user = await userRepository.getOneByQuery({email})
      if(!user){
         throw new ErrorHandler('user not found , check your email or your password',HttpCode.NOT_FOUND)
      }
      const matched = await JWT_Helper.PasswordCompare(password,user?.password)
      if (!matched){
         throw new ErrorHandler('invalid infos',HttpCode.BAD_REQUEST)
      }
      const payload : TokenData = {
         id : user?._id,
      }
      const token = JWT_Helper.GenerateToken(payload,TokenEnum.access)
      const refresh = JWT_Helper.GenerateToken(payload,TokenEnum.refresh)
      //@ts-ignore
      user.password = undefined
      return {token , refresh, user}



}

export default {
   register,
   login
}