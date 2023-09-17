const express = require('express');
const user= require('../Hrentity/user')
const userData = require('../Hrentity/userData')
const counter = require("../model/counterModel");
const mail= require('../routes/mail')
const userRouter = express.Router()


const validateUserFields = async (req, res, next) => {
    const { userId, mobileNumber, emailId , userRole , department } = req.body;

    if(userRole == "HR"){
        const existingHR = await user.findOne({ userRole: userRole, department: department });
        if(existingHR){
            return res.status(400).json({ isError:true, message: 'HR is already present in the department' });
        }
    }

    if (!/^\d{10}$/.test(mobileNumber)) {
        return res.status(400).json({ isError:true, message: 'Invalid mobileNumber' });
    }

    const existingNumber = await user.findOne({ mobileNumber });
    if (existingNumber) {
        return res.status(400).json({ isError:true, message: 'Mobile Number is already existed' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailId)) {
        return res.status(400).json({ isError:true, message: 'Invalid emailId' });
    }

    const existingUser = await user.findOne({ emailId });
    if (existingUser) {
        return res.status(400).json({ isError:true, message: 'Email is duplicated' });
    }
    next();
};


// {
//     "userName": "surya",
//         "userRole": "HR/employee",
//     "mobileNumber": "7373553917",
//     "emailId": "xyz@gmail.com",
//     "password": "pass",
//     "department": "department"
// }

userRouter.post('/signUp', validateUserFields ,async (req, res)=>{
    console.log("checking", req.body)
    const cd = await counter.findOneAndUpdate(
        { id: "userModel" },
        { $inc: { Seq: 1 } },
        { new: true }
    );

    let seq;

    if (!cd) {
        const newval = new counter({
            id: "userModel",
            Seq: 1, // Make sure to use "Seq" here, not "seq"
        });

        await newval.save();
        seq = 1;
    } else {
        seq = cd.Seq;
    }
    console.log(seq)
    const newUser = new user({
        userId: seq,
        userName: req.body.userName,
        userRole: req.body.userRole,
        mobileNumber: req.body.mobileNumber,
        emailId: req.body.emailId,
        password: req.body.password,
        department: req.body.department
    });

    console.log("data ",newUser)

   await newUser.save( (err) =>{
       if(err){
           console.error(err);
           res.status(500).json({ message: 'Error saving user' });
       }else{
          const response = mail.sendMail(newUser);
           res.status(200).json({ message: 'New user added' });
       }
   });
})




/// Login api function

userRouter.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;

        // Find a user by emailId and password
        const user1 = await user.findOne({ emailId, password });

        if (!user1) {
            return res.status(403).json({
                isError: true,
                errorMessage: 'Invalid emailId/password',
            });
        }

        res.status(200).json({
            status: 200,
            isError: false,
            user: {
                userId: user1.userId,
                userName: user1.userName,
                userRole: user1.userRole,
                mobileNumber: user1.mobileNumber,
                emailId: user1.emailId,
                password: user1.password, // Note: Storing passwords in plaintext is not secure; use hashing and salting for production
                department: user1.department,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ isError: true, errorMessage: 'Internal server error' });
    }
});


userRouter.get('/getAllEmployees', async (req, res) => {
    try {
        // Find all users in the "User" collection
        const userList = await user.find({}, {
            _id: 0, // Exclude the "_id" field from the response
            password: 0 // Exclude the "password" field from the response for security
        });

        // Create a response object with the desired structure
        const response = {
            isError: false,
            userList: userList.map(user => ({
                userId: user.userId,
                userName: user.userName,
                userRole: user.userRole,
                mobileNumber: user.mobileNumber,
                emailId: user.emailId,
                password: user.password,
                department: user.department,
            })),
        };

        // Respond with the formatted response object
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ isError: true, errorMessage: 'Internal server error' });
    }
});


// Define a route to get all employees by department
userRouter.get('/getAllEmployeesByDepartment/:department', async (req, res) => {
    try {
        const department = req.params.department;

        // Find all users in the "User" collection with the specified department
        const userList = await user.find({ department }, {
            _id: 0, // Exclude the "_id" field from the response
            password: 0 // Exclude the "password" field from the response for security
        });

        // Create a response object with the desired structure
        const response = {
            isError: false,
            userList: userList.map(user => ({
                userId: user.userId,
                userName: user.userName,
                userRole: user.userRole,
                mobileNumber: user.mobileNumber,
                emailId: user.emailId,
                password: user.password,
                department: user.department,
            })),
        };

        // Respond with the formatted response object
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ isError: true, errorMessage: 'Internal server error' });
    }
});

// Define a route to get employee details by userId
userRouter.get('/getEmployeeDetails/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find the user by userId in the "User" collection
        const user1 = await user.findOne({ userId }, {
            _id: 0, // Exclude the "_id" field from the response
            password: 0 // Exclude the "password" field from the response for security
        });

        // Find the userData by userId in the "UserData" collection
        const userDatares = await userData.findOne({ userId });

        if (!user1 ) {
            return res.status(404).json({
                isError: true,
                errorMessage: 'User not found',
            });
        }else if (!userDatares){
            return res.status(200).json({
                isError: true,
                errorMessage: 'UserData not found',
                User: user1
            });
        }

        // Create a response object with the desired structure
        const response = {
            isError: false,
            User: user1,
            userData: userDatares,
        };

        // Respond with the formatted response object
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ isError: true, errorMessage: 'Internal server error' });
    }
});



// Define a route to update a user by userId
userRouter.put('/updateEmployee/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find and update the user by userId in the "User" collection
        const updatedUser = await user.findOneAndUpdate(
            { userId },
            req.body, // Use the request body for updates
            {
                new: true, // Return the updated user
                fields: { password: 0 }, // Exclude the "password" field from the response for security
            }
        );

        if (!updatedUser) {
            return res.status(404).json({
                isError: true,
                errorMessage: 'User not found',
            });
        }

        // Create a response object with the desired structure
        const response = {
            status: 200,
            message: 'Successfully updated',
            user: updatedUser,
        };

        // Respond with the formatted response object
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ isError: true, errorMessage: 'Internal server error' });
    }
});




module.exports = userRouter;