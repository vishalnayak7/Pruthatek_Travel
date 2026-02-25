import express from 'express';
import cors from 'cors';

import notFound from './middlewares/default/notFound.js';
import errorHandler from './middlewares/default/errorHandler.js';
import morgan from 'morgan';
import helmet from 'helmet';
import { responseFormatter } from './middlewares/default/responseFormater.js';
import connectDB from './config/db.js';

import userRoute from './modules/user/user.routes.js';
import corporateRoute from './modules/corporate/corporate.routes.js'

import compression from 'compression';

const app = express();

// default middlewares
app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(compression());
app.use(express.static("public")); 

connectDB();

app.use(responseFormatter);
app.get('/', (req, res) => {
     res.send('This is user service !');
})

app.use('/api/v1/user', userRoute);
app.use("/api/v1/user/corporate", corporateRoute);

app.use(notFound);
app.use(errorHandler);


export default app;