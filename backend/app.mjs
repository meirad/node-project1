import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { getUser } from './guard.mjs';
import dotenv from 'dotenv';
import morgan from 'morgan';
import chalk from 'chalk';
import moment from 'moment'; 


dotenv.config();


async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/fullstack');
    console.log('mongodb connection established on port 27017');
}

main().catch(err => console.log(err));

export const app = express();

app.use(express.json());

app.use(morgan((tokens, req, res) => {
    const status = tokens.status(req, res);

    return [
        chalk.blue(tokens.method(req, res)),
        chalk.green(tokens.url(req, res)),
        status >= 200 && status < 400 ? chalk.bgGreen(tokens.status(req, res)) : chalk.bgRed(tokens.status(req, res)),
        chalk.gray(moment().format("YYYY-MM-DD HH:mm")),
        chalk.bgBlack(tokens['response-time'](req, res), 'ms'),
    ].join(' ')
}));


app.use(express.static("public"));


app.use(cors({
    origin: true,
    credentials: true,
    methods: 'GET,PUT,POST,PATCH,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
}));

app.listen(8900, () => {
    console.log('listening on port http://localhost:8900');
});



app.use((req, res, next) => {
    const user = getUser(req);
    console.log(user?._id);
    next();
});



app.get('/', (req, res) => {
    res.send({
        message: "Welcome to MongoDB!",
    });
});


import("./handlers/users/users.mjs");
import("./handlers/users/auth.mjs");
import("./handlers/cards/cards.mjs");
import("./initial-data/initial-data.mjs"); 