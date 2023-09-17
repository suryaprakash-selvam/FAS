require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/login');
const appointRoute = require('./routes/appoint');
const userRouter= require('./routes/userController')
const userDataRoute =  require('./routes/UserDataController')
const leavemgmtRouter= require('./routes/LeavemgmtController')
const ticketmgmtRouter= require('./routes/TicketManagementController')
const mongoString = process.env.DATABASE_URL;
const nodemailer=require("nodemailer");
// var nodeoutlook = require('nodejs-nodemailer-outlook')
mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})
database.once('connected', () => {
    console.log('Database Connected');
})
const app = express();
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');   
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
    next();
  });

app.use(express.json());

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})

app.use('/access', routes);
app.use('/appoint', appointRoute);
app.use('/hrms/user', userRouter);
app.use('/hrms/userData', userDataRoute);
app.use('/hrms/tkmt', ticketmgmtRouter);
app.use('/hrms/leavemgmt', leavemgmtRouter);

// app.get("/mail",async (req,res)=>{
//     var transport = nodemailer.createTransport("SMTP", {
//         host: "smtp-mail.outlook.in", // hostname
//         secureConnection: false, // TLS requires secureConnection to be false
//         port: 587, // port for secure SMTP
//         auth: {
//             user:"testacc1@outlook.in",
//             pass:"Acc1@123"
//         },
//         tls: {
//             ciphers:'SSLv3'
//         }
//     });

//     let info = await transporter.sendMail({
//         from: "testacc1@outlook.in", // sender address
//         to: "selvamssp204@gmail.com", // list of receivers
//         subject: "Appointment booked.", // Subject line
//         html: html, // html body
//     });
// })

// app.get("/mail1", (req,res)=> {
//    res.send( nodeoutlook.sendEmail({
//             auth: {
//                 user: "selvamssp204@hotmail.com",
//                 pass: "Suryassp@204"
//             },
//             from: 'selvamssp204@hotmail.com',
//             to: 'selvamssp204@gmail.com',
//             subject: 'Hey you, awesome!',
//             html: '<b>This is qoute text</b>',
//             text: 'This is text version!',
//             replyTo: 'selvamssp204@gmail.com',
//             onError: (e) => console.log(e),
//             onSuccess: (i) => console.log(i)
//         }


//     ));
// })