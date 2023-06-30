import express, { Request, Response, NextFunction, Application, ErrorRequestHandler } from 'express';
import { Server } from 'http';
import { config } from 'dotenv';
config();

const app: Application = express();

import { EventEmitter } from 'events';

import multer from 'multer';

import nodemailer from 'nodemailer';

import { connectNodeDatabase } from "../src/Database/connectDatabase"

import router from '../src/Routes/Routes'

import bodyParser from 'body-parser';

import path from 'path'

app.use(bodyParser.json(),bodyParser.urlencoded({extended:false}))

app.set("views", path.join(__dirname, "public"))

app.set('views-engine', "ejs")

const eventBroker = new EventEmitter();

eventBroker.on('event-1', () => {
    console.log("event 1 is fired")
})


eventBroker.on('event-2', (ar1, ar2) => {
    console.log(`event 2 is fired ${ar1} ,${ar2}`)
})


// eventBroker.emit('event-1')

// eventBroker.emit('event-2', 'hello', 'world')



const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, './src')
    },
    filename(req, file, callback) {
        callback(null, file.originalname)
    },
})

const upload = multer({ storage: storage })

app.get('/uploadFile', upload.single('file34'), (req: Request, res: Response, next: NextFunction) => {

    try {
        const file = req.file;
        console.log("🚀 ~ file: app.ts:46 ~ app.get ~ file:", file)
        res.status(200).send("file is sucessfully saved")
    } catch (error) {
        console.log("🚀 ~ file: app.ts:51 ~ app.get ~ error:", error)
    }
})

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: "ritikasrivastava5439@gmail.com", pass: "wbhsdtmjkwerlifs" }
})

let mailOptions = {
    from: "ritikasrivastava5439@gmail.com",
    to: "ritika.sumfactor@gmail.com",
    subject: "NODEJS",
    text: "THIS IS NODEJS TUTORIAL"
}

app.get('/sendEmail', async (req: Request, res: Response, next: NextFunction) => {

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) return res.status(500).send({ error: error })

        console.log("🚀 ~ file: app.ts:80 ~ transporter.sendMail ~ info:", info)

        return res.status(200).send({ info: info })
    })

})


// create table 
// Insert in table
// read from table
// update table
//  delete from table
// login user


app.use(express.json());

app.use('/', router)




const port: number = Number(process.env.PORT);


connectNodeDatabase().then((response) => {

    console.log(response)
    const server: Server = app.listen(port, () => console.log(`server is running at port http://localhost:${3000}`))

}).catch((error) => {
    console.log("🚀 ~ file: app.ts:102 ~ connectNodeDatabase ~ error:", error)
})

// import { createServer, IncomingMessage, ServerResponse } from "http";
// import * as fs from 'fs';
// import * as path from 'path'
// import * as url from "url";

const Port = 3000

const server = createServer((request: IncomingMessage, response: ServerResponse) => {
    console.log("🚀 ~ file: app.ts:60 ~ server ~ request:", request)

    if(request.url=="/name"){
        if(request.method==="GET"){

            response.end("hello world")
        }else{
            response.end("Worng method for this api")
        }
    }

//     // if (request.url == "/name") {
//     //     const dir = fs.readdirSync(__dirname)
//     //     // console.log("🚀 ~ file: app.ts:71 ~ server ~ __dirname:", __dirname)
//     //     // console.log("🚀 ~ file: app.ts:70 ~ server ~ dir:", dir)
//     //     // const writeFile = fs.writeFile("myFile.txt", "This is NodeJs Tutorial", function (err) {
//     //     //     if (err) throw err;
//     //     //     console.log("File written Sucessfully ")})}

//     //     // console.log("🚀 ~ file: app.ts:77 ~ server ~ path:", path)

//     //     // const readFile = fs.readFileSync(path.join(__dirname, 'myFile.txt'), { encoding: 'utf-8' })
//     //     // console.log("🚀 ~ file: app.ts:79 ~ //writeFile ~ __dirname:", __dirname)


//     //     // const readFile = fs.appendFile('mynewfile1.txt', 'Hello content!', function (err) {
//     //     //     if (err) throw err;
//     //     //     console.log('Saved!');
//     //     // });

//     //     // const readFile = fs.unlink('mynewfile1.txt', function (err) {
//     //     //     if (err) throw err;
//     //     //     console.log('File deleted!');
//     //     //   });


//     //     // const readFile = fs.rename('myFile.txt', 'myrenamedfile.txt', function (err) {
//     //     //     if (err) throw err;
//     //     //     console.log('File Renamed!');
//     //     // });

//     //     // console.log("🚀 ~ file: app.ts:77 ~ server ~ readFile:", readFile)


//     //     // var adr = 'http://localhost:3000/default.htm?year=2020&month=february&name=ritika&tech=fullstack';

//     //     // var q = url.parse(adr, true);

//     //     // console.log("🚀 ~ file: app.ts:105 ~ server ~ q:", q)


//     // }
// })

// server.listen(port, () => console.log(`server islistining at port ${port}`))
