const express = require('express');

const Model = require('../model/userModel');
const counter = require('../model/counterModel');

const {model} = require("mongoose");
const login = express.Router()
//Post Method
login.post('/post', async (req, res) => {
    console.log("checking", req.body)
    await counter.findOneAndUpdate({id:"login"},{"$inc":{"Seq":1}},{new:true},async (err, cd)=>{
        console.log("checking",cd);
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
      console.log("snjuund",seq)
        const data = new Model({
            Pwd:req.body.Pwd,
            Email:req.body.Email,
            MobileNumber:req.body.MobileNumber,
            FirstName:req.body.FirstName,
            LastName:req.body.LastName,
            Role:req.body.Role,
            Department:req.body.Department,
            SnoId:seq
        })

        try {

            const dataToSave = await data.save();
            console.log("date to save ", dataToSave);
            res.status(200).json(dataToSave);
        }
        catch (error) {
            res.status(400).json({message: error.message})
        }
    });

})

//Get all Method
login.get('/getAll',async (req, res) => {
    try{
        const data = await Model.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Get by ID Method
login.get('/getOne/:id/:pwd', async (req, res) => {

    try{
        const data = await Model.findOne({Email:req.params.id} )
        if(data.Pwd=== req.params.pwd){
            res.json(data);
        }else {
            res.send("invalid user name and password");
        }
    }
    catch(error){
        res.status(500).send("invalid user name and password");
    }
})

//Update by ID Method
login.patch('/update/:id/:key', async (req, res) => {
    try{
        const data = await Model.updateOne({Email:req.params.id},
            {Role:req.params.key})
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

//Delete by ID Method
login.delete('/delete/:id', (req, res) => {
    res.send('Delete by ID API')
})
module.exports = login;