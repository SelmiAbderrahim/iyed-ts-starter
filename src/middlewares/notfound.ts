import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../utils/errorHandler';
import { HttpCode } from '../utils/httpCode';

const notfound = (req:Request , res : Response , next: NextFunction) =>{
   return (new ErrorHandler(`Not Found - ${req?.originalUrl}`, HttpCode.NOT_FOUND))
}
export default notfound