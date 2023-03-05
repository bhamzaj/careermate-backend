const jwt = require('jsonwebtoken')
const {getTransporter} = require('../configs/emailSender');


module.exports = {
  sendVerificationEmail: async (user) => {
    const transporter = getTransporter()

    const emailText = `
      Welcome to Job Portal!
      To verify your account please click on the button/link bellow: \n
    `

    const token = jwt.sign({ _id: user._id }, process.env.JWT_VERIFICATION_SECRET)
    const link = `http://localhost:3001/verify-account?token=${token}`

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'Account verification',
      text: emailText + link,
      html: emailText + ` <a href=${link}>Verify Account</a>`,
    })
  },
  sendPasswordResetEmail: async (user) => {
    const transporter = getTransporter()
    const emailText = `
      You requested to reset your password!

      Please click on the link below:

    `
    const token = jwt.sign({ _id: user._id }, process.env.JWT_VERIFICATION_SECRET)
    const link = `http://localhost:3001/reset-password?token=${token}`

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'Reset Password Request',
      text: emailText + link,
      html: emailText + ` <a href=${link}>Reset Password</a>`,
    })
  },
  sendVerificationConfirmedEmail: async (user) => {
    const transporter = getTransporter()
    const emailText = `
      You have successfully verified your email.

    `
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'Email verified successfully',
      text: emailText,
      html: emailText,
    })
  }
}
