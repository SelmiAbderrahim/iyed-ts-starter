import expressAsyncHandler from "express-async-handler";
import { Schema , model } from "mongoose";
import { mongoosePagination , Pagination } from "mongoose-paginate-ts";
import { RolesEnum } from "../../constants/constants";
export default interface User {
   firstname?:string
   lastname?:string
   email:string
   password:string
   phone?:string
   role?:string
}


const schema = new Schema<User>(
   {
      firstname:{
         type:Schema.Types.String,
         required:[true,"The First name is required"],
         min:[3,"Firstname length must be less then or equal to 3 chars"],
         max:[253,"Firstname length must be greater then or equal to 25 chars"]

      },
      lastname:{
         type:Schema.Types.String,
         required:[true,"The First name is required"],
         min:[3,"Firstname length must be less then or equal to 3 chars"],
         max:[253,"Firstname length must be greater then or equal to 25 chars"]
      },
      email:{
         type:Schema.Types.String,
         required:[true,"the e-mail is required !"]
      },
      password:{
         type:Schema.Types.String,
         required:[true,"the password is required"],
      },
      phone: {
         type: Schema.Types.String,
         length: [8, 'Phone length must be = 8 numbers'],
       },
       role: {
         type: Schema.Types.String,
         required: true,
         enum: [RolesEnum.admin, RolesEnum.user],
         default: RolesEnum.user,
       }
   },{timestamps:true}
)

schema.plugin(mongoosePagination)

export const user = model<User , Pagination<User>>('User',schema,'users')