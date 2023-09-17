const express = require('express');
const Ticket= require('../Hrentity/ticketManagement')
const counter = require("../model/counterModel");

const ticketmgmtRouter = express.Router()
// Define a route to create a ticket
ticketmgmtRouter.post('/createTicket', async (req, res) => {
    try {
        const cd = await counter.findOneAndUpdate(
            { id: "tkmtSeq" },
            { $inc: { Seq: 1 } },
            { new: true }
        );

        let seq;

        if (!cd) {
            const newval = new counter({
                id: "tkmtSeq",
                Seq: 1, // Make sure to use "Seq" here, not "seq"
            });

            await newval.save();
            seq = 1;
        } else {
            seq = cd.Seq;
        }
        console.log(seq)

        // Create a new ticket using the request body
        req.body.ticketId=seq;
        const newTicket = new Ticket(req.body);

        // Save the new ticket to the database
        await newTicket.save();

        // Create a response object with the desired structure
        const response = {
            status: 200,
            message: 'Ticket created successfully',
            ticketDetails: newTicket,
        };

        // Respond with the formatted response object
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ isError: true, errorMessage: 'Internal server error' });
    }
});


// Define a route to get ticket details by department
ticketmgmtRouter.get('/getTicketDetails/:department', async (req, res) => {
    try {
        const department = req.params.department;

        // Find all tickets in the "Ticket" collection with the specified department
        const ticketList = await Ticket.find({ department });

        if (ticketList.length === 0) {
            return res.status(404).json({
                isError: true,
                errorMessage: 'No ticket data available for the specified department',
            });
        }
        // Create a response object with the desired structure
        const response = {
            status: 200,
            message: 'Ticket details retrieved successfully',
            ticketList: ticketList
        };

        // Respond with the formatted response object
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ isError: true, errorMessage: 'Internal server error' });
    }
});


ticketmgmtRouter.get('/GetTicketDetailsByEmployee/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find all tickets in the "Ticket" collection with the specified department
        const ticketList = await Ticket.find({ userId });

        if (ticketList.length === 0) {
            return res.status(404).json({
                isError: true,
                errorMessage: 'No ticket data available for the specified userId',
            });
        }
        // Create a response object with the desired structure
        const response = {
            status: 200,
            message: 'Ticket details retrieved successfully',
            ticketList: ticketList
        };

        // Respond with the formatted response object
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ isError: true, errorMessage: 'Internal server error' });
    }
});


// Define a route to update a ticket by userId
ticketmgmtRouter.put('/updateTicket', async (req, res) => {
    try {
        const {  ticketId } = req.body;

        // Find and update the ticket by ticketId in the "Ticket" collection
        const updatedTicket = await Ticket.findOneAndUpdate(
            { ticketId },
            req.body, // Use the request body for updates
            {
                new: true, // Return the updated ticket
            }
        );

        if (!updatedTicket) {
            return res.status(404).json({
                isError: true,
                errorMessage: 'Ticket not found',
            });
        }

        // Create a response object with the desired structure
        const response = {
            status: 200,
            message: 'Ticket updated successfully',
            ticketDetails: updatedTicket,
        };

        // Respond with the formatted response object
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ isError: true, errorMessage: 'Internal server error' });
    }
});


// Define a route to get leave details by employee (userId)
ticketmgmtRouter.get('/getLeaveDetailsByEmployee/:userId', async (req, res) => {
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
ticketmgmtRouter.get('/getLeaveDetailsByDepartment/:department', async (req, res) => {
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




module.exports = ticketmgmtRouter;