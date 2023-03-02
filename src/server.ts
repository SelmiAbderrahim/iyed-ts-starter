import app from './app'
import connection from './database/config'

process.on('uncaughtException',(err:Error)=>{
   console.log(`ERROR : ${err.message}`)
   console.log(`Shutting down due to uncaught exception`)
   process.exit(1)
})

const port:number = Number(process.env.PORT) || 5000
const server = app.listen(port,()=>{
   console.log(`Server started on port ${port} in ${process.env.NODE_ENV} mode`)
})
connection() // connecting to the server 
process.on('unhandledRejection',(err:Error)=>{
   console.log(`ERROR : ${err.message}`)
   console.log(`Shutting down due to unhandled rejection`)
   server.close(()=>{
      process.exit(1)
   })
})