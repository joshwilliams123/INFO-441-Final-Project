import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import usersRouter from './routes/users.js';
import teamRoutes from './routes/team.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

//TODO: ADD AUTHENTICATION
const authConfig = {
    auth: {
   clientId: "62e6fe3d-2690-4bc8-95c9-fa0bb375b106",
    authority: "https://login.microsoftonline.com/f6b6dd5b-f02f-441a-99a0-162ac5060bd2",
    clientSecret: "vc98Q~NztQdevW1pekVv2jbehjrK62yqwsIZjbD5",
    redirectUri: "https://a7-websharer.vaibavproject.me/redirect",
    },
system: {
    loggerOptions: {
        loggerCallback(loglevel, message, containsPii) {
            console.log(message);
        },
        piiLoggingEnabled: false,
        logLevel: 3,
    }
}
};

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.enable('trust proxy')
const oneDay = 1000 * 60 * 60 * 24;  

app.use(sessions({
    secret: process.env.SECRET,
    cookie: { 
        maxAge: oneDay,
        secure: true,
        sameSite: 'none'
    },
    resave: false,
    saveUninitialized: true,
}))
const authProvider = await WebAppAuthProvider.WebAppAuthProvider.initialize(authConfig);
app.use(authProvider.authenticate());

app.use('/users', usersRouter);
app.use('/api/team', teamRoutes);

export default app;
