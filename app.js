import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cors from 'cors'

const app = express();
dotenv.config();


app.use(express.json())

// resolving errors from cors
app.use(cors({
    origin: "http://localhost:5173",
    methods: "POST, GET",
    credentials: true,
    headers: ['Content-Type, Authorization']
}))
// 


// routing
app.post("/send", (req, res) => {
  try {
    const { body } = req;
    const { email, subject, userName, phoneNumber, message } = body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_ADDRESS,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: email, // sender address
      to: process.env.GMAIL_ADDRESS, // list of receivers
      subject: subject, // Subject line
      replyTo: email,
      html: `<span>Hi there, my name is ${userName}</span><br /><br /><span>Phone number is ${phoneNumber}</span><br /><br /><span>${message}</span>`, // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(400).json({ success: false, message: "Email not sent" })
      } else {
        return res.status(200).json({ success: true, message: "Email sent successfully", data: info.response })
      }
    })
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      message: "Error Sending Email",
    });
  }
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
