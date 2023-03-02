import mongoose from "mongoose";

const connection = async () => {
   try {
      mongoose.set('strictQuery', false)
      if (process.env.MONGO_URL) {
         const con = await mongoose.connect(process.env.MONGO_URL)
         console.log(`Mongo DB is connected on : ${process.env.MONGO_URL}`)
      }
   } catch (error) {
      console.log(`Connection Error => ${error}`)
      process.exit(1)
   }
}

export default connection;