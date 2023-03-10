import express from "express";
import userRoutes from "./user.routes"
import authRoutes from "./auth.routes"
const routes = express.Router()

routes.use('/', userRoutes)
routes.use('/', authRoutes)
export default routes