import { deleteModel, Types } from "mongoose";
import { paginationObj } from "../../types/pagination";
import  User,{ user} from "../models/user.modal";
import { PaginationModel } from "mongoose-paginate-ts";
import JWT_Helper from "../../utils/JWT_Helper";

const getAll = async (condition:object,paging:paginationObj,query:object) => {
   let findAllQuery = user.find({...condition})
   const options = {
      limit : paging.limit ? paging.limit : null,
      page : paging.page ? paging.page : null
   }
   const res = (await user.paginate(options)) as PaginationModel<User>
   return res
}

const create = async (TheUser:object) => {
   return await user.create(TheUser)
}
const getById = async (id:Types.ObjectId , select:string = '' , populate:string = "") => {
   const TheUSer = await user.findById(id)
   //@ts-ignore
   TheUSer?.password = undefined
   return TheUSer
}

const edit = async (id:Types.ObjectId , TheUser:object) => {
  await user.findByIdAndUpdate(id,TheUser)
  return await getById(id)
}

const remove = async (id:Types.ObjectId) => {
   return await user.findByIdAndDelete(id)
}

const getOneByQuery = async (options:object,select:string = '',populate:string = '') => {
  return await user.findOne(options).select(select).populate(populate)
}

export default {
   getAll,
   create,
   getOneByQuery,
   getById,
   edit,
   remove,
 }