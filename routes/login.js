const express = require('express');

const Model = require('../model/userModel');
const counter = require('../model/counterModel');

const {model} = require("mongoose");
const constants = require("constants");
const login = express.Router()
//Post Method
login.post('/post', async (req, res) => {
    console.log("checking2 :", req.body)
    await counter.findOneAndUpdate({id:"login"},{"$inc":{"Seq":1}},{new:true},async (err, cd)=>{
        console.log("checking :",cd);
        let seq;
        if(cd==null){
            const newval=new counter({
                id:"login",
                seq:1
            });
           await newval.save();
           seq=1;
        }else {
            seq=cd.Seq;
        }
        const data = new Model({
            Pwd:req.body.Pwd,
            Email:req.body.Email,
            MobileNumber:req.body.MobileNumber,
            FirstName:req.body.FirstName,
            LastName:req.body.LastName,
            Role:req.body.Role,
            Department:req.body.Department,
            UserId:seq
        })
        try {
                    const dataToSave = await data.save();
                    console.log("date to save ", dataToSave);
                    res.status(200).send({
                        "isSuccess":true,
                        "message":dataToSave
                    })
        }
        catch (error) {
            if(error.keyPattern.Email >=1){
                res.status(200).json({
                    "isSuccess":false,
                    "errorMessage": "Email is already existed"
                })
            }else if(error.keyPattern.MobileNumber >=1){
                res.status(200).json({
                    "isSuccess":false,
                    "errorMessage": "Mobile number is already existed"
                })
            }
        }
    });
})
/// response object ta send pannu  // rmail validate   --> resolved

//Get all Method
login.get('/getAll',async (req, res) => {
    try{
        const data = await Model.find();
        res.json(data)
    }
    catch(error){
        res.status(200).json({
            "isSuccess":false,
            "errorMessage": error.message
        })
    }
})

//Get by ID Method
login.post('/getlogin', async (req, res) => {

    try{
        const data = await Model.findOne({Email:req.body.id})
        if(data.Pwd=== req.body.pwd){
            res.json(data);
        }else {
            res.send({
                "isSuccess":false,
                "errorMessage": "Invalid user name and password"});
        }
    }
    catch(error){
        res.status(200).send({
            "isSuccess":false,
            "errorMessage": "Invalid user name and password"});
    }
})
//// user id is not coming in response


//Update by ID Method
login.patch('/update/:id/:key', async (req, res) => {
    try{
        const data = await Model.updateOne({Email:req.params.id},
            {Role:req.params.key})
        if(data.modifiedCount===1){
            res.send({
                "isSuccess":true});
        }else {
            res.send({
                "isSuccess":false,
                "errorMessage": "no date modified"})
        }

    }
    catch(error){
        res.status(200).send({
            "isSuccess":false,
            "errorMessage": "error in update"});
    }
})

//Update by ID Method
login.patch('/reset', async (req, res) => {
    try{
        const data = await Model.updateOne({Email:req.body.email},
            {Pwd:req.body.password})
        if(data.modifiedCount===1){
            res.send({
                "isSuccess":true});
        }else {
            res.send({
                "isSuccess":false,
                "errorMessage": "no data modified"})
        }

    }
    catch(error){
        res.status(200).send({
            "isSuccess":false,
            "errorMessage": "error in update"});
    }
})


//Delete by ID Method
login.delete('/delete/:id', (req, res) => {
    res.send('Delete by ID API')
})
module.exports = login;