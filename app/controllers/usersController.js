const User = require('../models/user')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
//const nodemailer = require('nodemailer');
const {OTP} = require('../sequelize');
const nodemailer = require('nodemailer')
const usersController = {}

usersController.list = (req, res) => {
    User.find()
        .then(users => {
            res.send(users)
        })
}
router.post('/email/otp', async (req, res, next) => {
  try{
    const {email,type} = req.body;
    let email_subject, email_message
    if(!email){
      const response={"Status":"Failure","Details":"Email not provided"}
      return res.status(400).send(response) 
    }
    if(!type){
      const response={"Status":"Failure","Details":"Type not provided"}
      return res.status(400).send(response) 
    }

    //Generate OTP 
    const otp = otpGenerator.generate(6, { alphabets: false, upperCase: false, specialChars: false });
    const now = new Date();
    const expiration_time = AddMinutesToDate(now,10);
    //Create OTP instance in DB
    const otp_instance = await OTP.create({
      otp: otp,
      expiration_time: expiration_time
    });

    // Create details object containing the email and otp id
    var details={
      "timestamp": now, 
      "check": email,
      "success": true,
      "message":"OTP sent to user",
      "otp_id": otp_instance.id
    }

    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: 'gmail',
      port: 465,
      secure: true,
      auth: {
        user: `${process.env.EMAIL_ADDRESS}`,
        pass: `${process.env.EMAIL_PASSWORD}`
      },
    });


    const mailOptions = {
      from: `"Divyansh Agarwal"<${process.env.EMAIL_ADDRESS}>`,
      to: `${email}`,
      subject: email_subject,
      text: email_message ,
    };

    await transporter.verify();
    
    //Send Email
    await transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
          return res.status(400).send({"Status":"Failure","Details": err });
      } else {
        return res.send({"Status":"Success","Details":encoded});
      }
    });
  }
  catch(err){
    const response={"Status":"Failure","Details": err.message}
    return res.status(400).send(response)
  }
});
const subject_mail = "OTP: For Reset Password"

const message = (otp) =>{
    return `Dear User, \n\n` 
    + 'OTP for Reset Password is : \n\n'
    + `${otp}\n\n`
    + 'This is a auto-generated email. Please do not reply to this email.\n\n'
    + 'Regards\n'
    + 'Divyansh Agarwal\n\n'
}

usersController.register = (req, res) => {
    const body = req.body 
    const user = new User(body)
    bcryptjs.genSalt()
        .then((salt) => {
            bcryptjs.hash(user.password, salt)
                .then((encrypted) => {
                    user.password = encrypted
                    user.save()
                        .then((user) => {
                            res.json(user)
                        })
                        .catch((err) => {
                            res.json(err)
                        })
                })
        })
   
        
    /*
    const user = new User()
    user.username = body.username 
    user.email = body.email
    user.password = body.password
    */
}
usersController.update = (req,res) => {
    const id = req.params.id
    const { body } = req
    User.findOneAndUpdate({_id:id},body,{new: true})
        .then(customer => {
            res.json(customer)
        }).catch(err => res.json(err))
}

usersController.login = (req, res) => {
    const body = req.body 
    User.findOne({ email: body.email }) 
        .then((user) => {
            if(!user) {
                res.json({ 
                    errors: 'invalid email or password'
                })
            }

            bcryptjs.compare(body.password, user.password)
                .then((match) => {
                    if(match) {
                        const tokenData = {
                            _id: user._id,
                            email: user.email,
                            username: user.username
                        }
                        const token = jwt.sign(tokenData, 'dct123', { expiresIn: '2d'})
                        res.json({
                            token: `Bearer ${token}`
                        })
                    } else {
                         res.json({ errors: 'invalid email or password'})
                    }
                })
        })
}

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'youremail@gmail.com',
    pass: 'yourpassword'
  }
});

const mailOptions = {
  from: 'youremail@gmail.com',
  to: 'myfriend@yahoo.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
usersController.account = (req, res) => {
     return res.json(req.user)
}



module.exports = usersController