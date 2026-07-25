import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env';

const app = express();


app.use(cors({
    origin: env.SITE_URL,
    credentials: true,
}));
app.use(express.json({
    limit: env.URL_FILE_SIZE
}));
app.use(express.urlencoded({
    extended: true,
    limit: env.URL_FILE_SIZE
}));
app.use(express.static("public"));
app.use(cookieParser());


export default app;