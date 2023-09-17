const express = require('express');
const Model = require("../model/appointmentModel");
const counter = require('../model/counterModel');
const nodeoutlook = require("nodejs-nodemailer-outlook");

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "unboxs13@gmail.com",
        pass: "gxtcjfjzegdybkte"
    },
    tls: {
        rejectUnauthorized: false
      }
});

const appoint = express.Router()

appoint.post('/post', async (req, res) => {
    console.log("checking", req.body.ApDate)
    await counter.findOneAndUpdate({id:"appoint"},{"$inc":{"Seq":1}},{new:true},async (err, cd)=>{
        let seq;
        if( cd==null ){
            const newval=new counter({
                id:"appoint",
                seq:1
            });
            await newval.save();
            seq=1;
        }else {
            seq=cd.Seq;
        }

        console.log("snjuund",seq)
        const data = new Model({
            AppointmentNo: seq,
            UserId :req.body.UserId,
            UserName:req.body.UserName,
            userEmailId:req.body.userEmailId,
            Department:req.body.Department,
            FacutlyId:req.body.FacutlyId,
            FacutlyEmail:req.body.FacutlyEmail,
            ApDate:req.body.ApDate,
            Slot:req.body.Slot,
            Reason:req.body.Reason,
            Status:req.body.Status
        })

        try{
            const dataToSave = await data.save();
            console.log("date to save ", dataToSave);
            const mailConfigurations = {

                // It should be a string of sender email
                from: 'unboxs13@gmail.com',

                // Comma Separated list of mails
                to: req.body.FacutlyEmail,
                // Subject of Email
                subject: 'NOTIFICATION: APPOINTMENT NUMBER '+ dataToSave.AppointmentNo,

                // This would be the text of email body
                text: 'Hi ,\n\n'
                    + 'New Appointment has been scheduled to you. Please take necessary actions '
                    +'\n\n'+'User Email'+'\t'+dataToSave.userEmailId+'\n'+'User Name: '+'\t'+dataToSave.UserName+
                    '\n\nThanks, \nAdmin.'
            };
            console.log('mailconfigurations------',mailConfigurations)
            await transporter.sendMail(mailConfigurations, function(error, info){
                if (error) throw console.log('error------',error);
                console.log('Email Sent Successfully');
                console.log(info);
            });
            res.status(200).json({
                "isSuccess":true,
                "message":data
                });
        }
        catch (error) {
            res.status(400).json({
                "isSuccess":false,
                "errorMessage": "Please check the entered details"})
        }
    });
})
//
// appoint.get('/getAll',async (req, res) => {
//     try{
//         const data = await Model.find();
//         res.json(data)
//     }
//     catch(error){
//         res.status(500).json({message: error.message})
//     }
// })

appoint.get('/getfac/:id', async (req, res) => {

    try{
        const data = await Model.find({FacutlyEmail:req.params.id})
        res.json(data);
    }
    catch(error){
        res.status(500).send({
            "isSuccess":false,
            "errorMessage": "Unable to find the faculty details"});
    }
})

appoint.get('/getstudent/:id', async (req, res) => {
    try{
        const data = await Model.find({UserId:req.params.id})
        res.json(data);
    }
    catch(error){
        res.status(400).send({
            "isSuccess":false,
            "errorMessage": "Unable to find the student"});
    }
})

appoint.post('/getfac', async (req, res) => {
    try{
        const a=[];
        const slot=[];
        console.log(req.body.facEmail + "shndiu" + req.body.Date)
        const data = await Model.find({FacutlyEmail: req.body.facEmail, ApDate: req.body.Date});
        console.log(data)
        for (let dataKey in data) {
            a.push(data[dataKey])
        }
        a.forEach(re=>{
            slot.push(re.Slot);
        })
        //// send parse int ===> resolved
        res.json(slot);
    }
    catch(error){
        res.status(500).send({
            "isSuccess":false,
            "errorMessage": "Unable to find the time slot"});
    }
})

appoint.patch('/update', async (req, res) => {
    try{
        console.log("data",req.body.Status,"app no:", req.body.AppointmentNo);
        const data = await Model.updateOne({AppointmentNo:req.body.AppointmentNo},{Status:req.body.Status})
        console.log("data",data);
        const data2= await  Model.findOne({AppointmentNo:req.body.AppointmentNo});
        console.log("data 2", data2)
        if(data.modifiedCount===1){
            const mailConfigurations = {
                // It should be a string of sender email
                from: 'unboxs13@gmail.com',

                // Comma Separated list of mails
                to: req.body.Email,
                // Subject of Email
                subject: 'NOTIFICATION: APPOINTMENT NUMBER '+ req.body.AppointmentNo,

                // This would be the text of email body
                text:
                    'Hi ,\n'
                    + 'Your appointment has been '
                    +req.body.Status+' by '+ data2.FacutlyEmail+'.\n'+
                    '\nThanks, \nAdmin.'
            };
            await transporter.sendMail(mailConfigurations, function(error, info){
                if (error) throw error;
                console.log('Email Sent Successfully');
                console.log(info);
            });
            res.send({
                "isSuccess":true,
            });
        }else {
            res.send({
                "isSuccess":false,
                "errorMessage": "Unable to update the status"})
        }
    }
    catch(error){
        res.status(500).send({
            "isSuccess":false,
            "errorMessage": "Unable to update the status"});
    }
})
/// res map object


module.exports = appoint;