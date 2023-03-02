import express, { Express } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/routes';
import notfound from './middlewares/notfound';
import errors from './middlewares/errors';


dotenv.config()

const app: Express = express()

const corsOptions = {
   origin: process.env.CORS_ORIGIN,
   optionsSuccessStatus: 200,
   credentials: true,
}

app.use(hpp()) //prevents HPP attacks by parsing the incoming HTTP request and removing any duplicate parameters or parameters with unexpected values
app.use(helmet()) //set various HTTP headers to improve the security of the web application.
app.use(morgan('dev')) //
app.use(express.json())
app.use(cookieParser()) //parse cookies sent in the HTTP request.
app.use(mongoSanitize()) //, it replaces any keys in the request body, query string, or request parameters that contain a . or a $ with an underscore (_)
app.use(express.urlencoded({ extended: true })) // parsing URL-encoded bodies with rich objects and arrays.
app.use(cors(corsOptions)) //  handle cross-origin requests in a secure and controlled way
// 
app.use('/api', routes)

app.use(notfound)
app.use(errors)

export default app



//TODO Create Sending mail with nodemailer
//TODO getting and posting images
//TODO logout
//TODO forget password => send mail with nodemailer
//TODO avatar upload
