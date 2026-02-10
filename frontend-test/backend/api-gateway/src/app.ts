import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";

import { registerProxies } from "./proxy/registerProxies.js";
import notFound from "./middlewares/default/notFound.js";
import errorHandler from "./middlewares/default/errorHandler.js";
import { responseFormatter } from "./middlewares/default/responseFormater.js";
import { Request, Response } from "express";
import rateLimiter from "./middlewares/default/rateLimiter.js";

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(cors());
// app.use(express.json()); 
app.use(compression());

app.use(responseFormatter);
app.use(rateLimiter());

app.get("/", (req: Request, res: Response) => {
  res.send("API Gateway is running 🚀");
});

app.get("/home", (req: Request, res: Response) => {
  res.send("This is home page !");
});

registerProxies(app);

app.use(notFound);
app.use(errorHandler);

export default app;
