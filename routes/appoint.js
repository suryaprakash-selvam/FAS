const express = require('express');
const Model = require("../model/appointmentModel");
const counter = require('../model/counterModel');

const appoint = express.Router()

appoint.post('/post', async (req, res) => {
    console.log("checking", req.body.ApDate)
    await counter.findOneAndUpdate({id:"appoint"},{"$inc":{"Seq":1}},{new:true},async (err, cd)=>{
        console.log("checking",cd);
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
            res.status(200).json(dataToSave);
        }
        catch (error) {
            res.status(400).json({message: error.message})
        }
    });
})



appoint.get('/getAll',async (req, res) => {
    try{
        const data = await Model.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

appoint.get('/getfac/:id', async (req, res) => {

    try{
        const data = await Model.find({FacutlyEmail:req.params.id})
        res.json(data);
    }
    catch(error){
        res.status(500).send("invalid user name and password");
    }
})

async function getData(req) {
    return await Model.find({FacutlyEmail: req.params.id, ApDate: req.params.data});
}

appoint.get('/getfac/:id/:data', async (req, res) => {
    try{
        const a=[];
        const slot=[];
        const data = await Model.find({FacutlyEmail: req.params.id, ApDate: req.params.data});
        for (let dataKey in data) {
            a.push(data[dataKey])
        }
        a.forEach(re=>{
            slot.push(re.Slot);
        })
        res.json(slot);
    }
    catch(error){
        res.status(500).send("invalid user name and password");
    }
})

appoint.patch('/update', async (req, res) => {
    try{
        console.log("data",req.body.Status,"app no:", req.body.AppointmentNo);
        const data = await Model.updateOne({AppointmentNo:req.body.AppointmentNo},{Status:req.body.Status})
        console.log("data",data);
        if(data.modifiedCount===1){
            res.send(true);
        }else {
            res.send(false)
        }
    }
    catch(error){
        res.status(500).send("error in update");
    }
})

module.exports = appoint;