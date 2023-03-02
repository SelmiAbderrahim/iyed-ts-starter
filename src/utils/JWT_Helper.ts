import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { TokenEnum } from '../constants/constants'
import { TokenData } from '../types/tokenData'
import dotenv from 'dotenv'
dotenv.config()

const passwordHashing = async(password:string): Promise<string> => {
   const result = await bcrypt.hash(password,Number(process.env.PASSWORD_SALT))
   return  result
}

const PasswordCompare = async(password:string,passwordHash:string):Promise<boolean>=>{
   const matched = await bcrypt.compare(password,passwordHash)
   return matched
}

const GenerateToken = (data:TokenData , type:string): string => {
   let secretKey 
   let expireTime
   if (type === TokenEnum.access) {
      secretKey = process.env.JWT_ACCESS_TOKEN as string
      expireTime = process.env.JWT_ACCESS_EXPIRES_TIME as string
   }
   else if (type === TokenEnum.refresh) {
      secretKey = process.env.JWT_REFRESH_TOKEN as string
      expireTime = process.env.JWT_REFRESH_EXPIRES_TIME as string
   }
   else {
      secretKey = process.env.JWT_RESET_PASSWORD_TOKEN as string
      expireTime = process.env.RESET_PASSWORD_EXPIRES_TIME as string
  
   }//type === rest
   const token = jwt.sign(data , secretKey , {expiresIn:String(expireTime)})
   return token
}

const ExtractToken = (token:string , type:string):TokenData | null=> {
   let secretKey
   if (type === TokenEnum.access) {
     secretKey = process.env.JWT_ACCESS_TOKEN as string
   } else if (type === TokenEnum.refresh) {
     secretKey = process.env.JWT_REFRESH_TOKEN as string
   } else {
     secretKey = process.env.JWT_RESET_PASSWORD_TOKEN as string
   }
   let resData : any
   jwt.verify(token,secretKey,(err , decoded) => {
      if (err) {
         resData = null
      }
      else {
         resData = {decoded}
      }
   })
    if (resData) {
      const result : TokenData = <TokenData>resData
      return result
    }
    return null
}

interface DecodedToken {
   header: { [key: string]: any };
   payload: { [key: string]: any };
   signature: string;
 }
 
 const  decodeJwtToken = (token: string): DecodedToken => {
   // Split the token into its three components: header, payload, signature
   const [headerB64, payloadB64, signatureB64] = token.split('.');
   // Decode the base64-encoded header and payload
   const header = JSON.parse(atob(headerB64.padEnd(headerB64.length + (4 - headerB64.length % 4) % 4, '=')));
   const payload = JSON.parse(atob(payloadB64.padEnd(payloadB64.length + (4 - payloadB64.length % 4) % 4, '=')));
   // Return the decoded token components as a dictionary
   return { header, payload, signature: signatureB64 };
 }


 const checkJWToken = (token:string) => {
   const result = ExtractToken(token,'access')
      if (result){
         return true
      }
      else {
         return  false
      }
 }

 const refreshJAToken = () =>{

 }
export default {
   passwordHashing,
   PasswordCompare,
   GenerateToken,
   ExtractToken,
   decodeJwtToken,
   checkJWToken,
   refreshJAToken
}
