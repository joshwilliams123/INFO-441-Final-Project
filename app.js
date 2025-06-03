import express from 'express';
import sessions from 'express-session';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import apiRouter from './routes/api.js';

import models from './models.js';

import WebAppAuthProvider from 'msal-node-wrapper'

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

//TODO: ADD AUTHENTICATION
const authConfig = {
    auth: {
        clientId: "9c6b9dfa-e30d-4cc7-a7fe-168dfc3903ec",
        authority: "https://login.microsoftonline.com/f6b6dd5b-f02f-441a-99a0-162ac5060bd2",
        clientSecret: "~da8Q~oPPNDK22dQaijoJkCDPiRw-F6mlPR7-b_Y",
        redirectUri: "https://info-441-final-project.onrender.com/redirect",
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
    secret: "mysecret",
    cookie: { maxAge: oneDay },
    resave: false,
    saveUninitialized: true,
}))

const authProvider = await WebAppAuthProvider.WebAppAuthProvider.initialize(authConfig);
app.use(authProvider.authenticate());

app.get('/signin', (req, res, next) => {
    return req.authContext.login({
        postLoginRedirectUri: "/", 
    })(req, res, next);

});
app.get('/signout', (req, res, next) => {
    return req.authContext.logout({
        postLogoutRedirectUri: "/", 
    })(req, res, next);

});

app.use((req, res, next) => {
    req.models = models;
    next();
});

app.use('/api', apiRouter);

export default app;
