const express = require('express');
const counter = require("../model/counterModel");
const userData= require('../Hrentity/userData')
const userDataRouter = express.Router()


const validateUserExists = async (req, res, next) => {
    try {
        const userId = req.body.userId;

        const user = await userData.findOne({ userId });

        if (user) {
            return res.status(404).json({ message: 'User already exist' });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error validating user existence' });
    }
};

userDataRouter.post('/create', validateUserExists , async (req, res) =>{
    try {
        const cd = await counter.findOneAndUpdate(
            { id: "userDataModel" },
            { $inc: { Seq: 1 } },
            { new: true }
        );

        let seq;

        if (!cd) {
            const newval = new counter({
                id: "userDataModel",
                Seq: 1, // Make sure to use "Seq" here, not "seq"
            });

            await newval.save();
            seq = 1;
        } else {
            seq = cd.Seq;
        }
        console.log(seq)
        req.body.userDataId =seq;

        const newUserData = new userData({
            userDataId: seq,
            userId: req.body.userId,
            basic: req.body.basic,
            gratuity: req.body.gratuity,
            bonus: req.body.bonus,
            pf: req.body.pf,
            totalMonthlyAmount: req.body.totalMonthlyAmount,
            totalLeaveCredited: req.body.totalLeaveCredited,
            leaveBalance: req.body.leaveBalance,
            department: req.body.department
        });

        await newUserData.save();
        res.status(201).json({ message: 'Userdata updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Error creating user data'});
    }
})

module.exports= userDataRouter;