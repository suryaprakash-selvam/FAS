const express = require('express');
const LeaveManagement= require('../Hrentity/leavemgmt')
const counter = require("../model/counterModel");
const UserData=require("../Hrentity/userData");

const leavemgmtRouter = express.Router()

// Define a route to create a leave request
leavemgmtRouter.post('/createLeaveRequest', async (req, res) => {
    try {
        const cd = await counter.findOneAndUpdate(
            { id: "leavemgmtSeq" },
            { $inc: { Seq: 1 } },
            { new: true }
        );

        let seq;

        if (!cd) {
            const newval = new counter({
                id: "leavemgmtSeq",
                Seq: 1, // Make sure to use "Seq" here, not "seq"
            });

            await newval.save();
            seq = 1;
        } else {
            seq = cd.Seq;
        }
        console.log(seq)

        req.body.leaveId=seq;
        // Create a new leave request using the request body
        const newLeaveRequest = new LeaveManagement(req.body);

        // Save the new leave request to the database
        await newLeaveRequest.save();

        // Create a response object with the desired structure
        const response = {
            status: 200,
            message: 'Leave request created successfully',
        };

        // Respond with the formatted response object
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ isError: true, errorMessage: 'Internal server error' });
    }
});


// Define a route to get leave details by employee (userId)
leavemgmtRouter.get('/getLeaveDetailsByEmployee/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find all leave requests for the specified userId
        const leaveList = await LeaveManagement.find({ userId });

        // Check if the leaveList is empty
        if (leaveList.length === 0) {
            return res.status(404).json({
                isError: true,
                errorMessage: 'No leave details available for the specified employee',
            });
        }

        // Create a response object with the desired structure
        const response = {
            leaveList,
        };

        // Respond with the formatted response object
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ isError: true, errorMessage: 'Internal server error' });
    }
});

// Define a route to get leave details by department
leavemgmtRouter.get('/getLeaveDetailsByDepartment/:department', async (req, res) => {
    try {
        const department = req.params.department;

        // Find all leave requests for the specified department
        const leaveList = await LeaveManagement.find({ department });

        // Check if the leaveList is empty
        if (leaveList.length === 0) {
            return res.status(404).json({
                isError: true,
                errorMessage: 'No leave details available for the specified department',
            });
        }
        // Create a response object with the desired structure
        const response = {
            isError: false,
            leaveList: leaveList
        };
        // Respond with the formatted response object
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ isError: true, errorMessage: 'Internal server error' });
    }
});

// Define a route to approve a leave request
leavemgmtRouter.put('/approveLeaveRequest', async (req, res) => {
    try {
        const { leaveId, leaveStatus } = req.body;

        // Find the leave request in the "LeaveManagement" collection
        const leaveRequest = await LeaveManagement.findOne({ leaveId });

        if (!leaveRequest) {
            return res.status(404).json({
                isError: true,
                errorMessage: 'Leave request not found',
            });
        }

        // Find the corresponding user's data in the "UserData" table
        const userData = await UserData.findOne({ userId: leaveRequest.userId });

        if (!userData) {
            return res.status(404).json({
                isError: true,
                errorMessage: 'User data not found',
            });
        }

        // Check if the user has enough leave balance
        if (userData.leaveBalance <= leaveRequest.noOfDays) {
            return res.status(400).json({
                isError: true,
                errorMessage: 'Insufficient leave balance',
            });
        }

        // Update the leave request status to "Approved"
        leaveRequest.leaveStatus = leaveStatus;
        await leaveRequest.save();

        // Update the "UserData" table to adjust leave balance
        userData.leaveBalance -= leaveRequest.noOfDays;
        await userData.save();

        // Create a response object with the desired structure
        const response = {
            status: 200,
            message: 'Leave request approved successfully',
            leaveRequest: leaveRequest,
        };

        // Respond with the formatted response object
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ isError: true, errorMessage: 'Internal server error' });
    }
});



module.exports = leavemgmtRouter;