const pg = require('../db/pg')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer');
require('dotenv').config();
const jwt = require('jsonwebtoken')
const secret = process.env.Secret;

const Register = async(req,res) => {
try {
    const { username,email,password } = req.body;
    const findUser = await pg("select * from auth where username = $1 or email = $2",username,email)
    if (findUser.length) {
        res.status(400).json({message:"error username or email"})
    }
    else {
        const hashPassword = await bcrypt.hash(password,5);
        const newUser = await pg("insert into auth(username,email,password,verify)values($1,$2,$3,$4) returning *",username,email,hashPassword,false);
        const id = await jwt.sign(newUser[0].id,secret)
        console.log(newUser,id);
        const transporter = nodemailer.createTransport({
            port: 465, // true for 465, false for other ports
            host: "smtp.gmail.com",
            auth: {
              user: "bohoikromov403@gmail.com",
              pass: "twffvlecflywvvup",
            },
            secure: true,
          });
        
          const mailData = {
            from: "bohoikromov403gmail.com", // sender address
            to: "boho4121boho@gmail.com", // list of receivers
            subject: "Sending Email using Node.js",
            text: "verify!",
            html: `<b>Hey there! </b><br>http:http://localhost:8000/verify/${id}<br/>`,
          };
          await transporter.sendMail(mailData);
          res.status(200).json({message: "Successfully sent"});     
    }
} catch (error) {
    res.status(500).json(error.message)
}
}

const Login = async(req,res) => {
    try {
        const { username,password,email } = req.body;
        const notVerify = (await pg("select * from auth where username = $1 and email = $2 and verify = $3",username,email,false))[0];
        const user = (await pg("select * from auth where username = $1 and email = $2 and verify = $3",username,email,true))[0];
        const pass = user ? await bcrypt.compare(password,user.password) : false
        if (user && pass) {
            
          
            res.status(200).json({message:"succes"}) 
          
        }
       else if (notVerify) {
            res.status(404).json({message:"you not verify email"})
        }
        else{
            res.status(403).json({message:"error password or email or usernam"})
        }
    } catch (error) {
        res.status(500).json(error.message)
    }
}


const Verify = async(req,res) => {
try {
    const { id } = req.params;
    const userId = await jwt.verify(id,secret)
    const data = (await pg("select * from auth where id = $1",userId))[0];
    if (data) {
        await pg("update auth set verify =$1 where id = $2",true,userId)
        res.status(200).json({message:"succes verify"})
    }
    else{
        res.status(404).json({message:"you not register"})
    }
} catch (error) {
    res.status(500).json(error.message)
}
}
module.exports = {
    Register,
    Login,
    Verify
}