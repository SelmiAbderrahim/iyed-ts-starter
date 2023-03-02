import { NextFunction , Request, Response } from "express";
import { EnvironmentEnum } from "../constants/constants";
import { HttpCode } from "../utils/httpCode";
import { ErrorHandler } from "../utils/errorHandler";
import dotenv from 'dotenv'

dotenv.config()
const errors = (
   err : ErrorHandler ,
   req : Request,
   res : Response ,
   next: NextFunction
) =>{
   const statusCode = err?.statusCode || HttpCode.INTERNAL_SERVER_ERROR
   res.status(statusCode).json({
      success:false,
      statusCode:err?.statusCode,
      message:err?.message,
      stack:process.env.NODE_ENV === EnvironmentEnum.dev ? err?.stack : undefined
   })
}

export default errors