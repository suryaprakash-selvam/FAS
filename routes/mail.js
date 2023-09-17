const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "unboxs13@gmail.com",
        pass: "thzo hnkw nqop psrk"
    },
    tls: {
        rejectUnauthorized: false
    }
});



exports.sendMail = async (req) => {
    console.log(req)
    const mailConfigurations = {
        // It should be a string of sender email
        from: 'unboxs13@gmail.com',
        // Comma Separated list of mails
        to: req.emailId,
        // Subject of Email
        subject: 'NOTIFICATION: Account Creation for '+ req.userName,
        // This would be the text of email body
        text:
            'Hi '+req.userName+',\n'
            + 'To login our portal please find the password : '
            +req.password+' \n '+'Please contact your admin In case any issue.\n'+
            '\nThanks, \nAdmin, \n Company Name.'
    };
    await transporter.sendMail(mailConfigurations, function(error, info){
        if (error) throw error;
        console.log('Email Sent Successfully');
        console.log(info);
        return info;
    });
}