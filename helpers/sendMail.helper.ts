import nodemailer from 'nodemailer'

const sendMailOTP = (email: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD
    }
  })

  const mailOptions = {
    from: process.env.SMTP_USERNAME,
    to: email,
    subject: subject,
    html: html
  };

  transporter.sendMail(mailOptions, (error: Error, info: any) => {
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })
}

export default sendMailOTP