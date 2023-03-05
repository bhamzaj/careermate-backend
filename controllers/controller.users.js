const User = require('../models/model.users');
const Job = require('../models/model.jobs')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { USER_ROLES } = require('../util/constants');
const { sendVerificationEmail, sendPasswordResetEmail, sendVerificationConfirmedEmail } = require('../util/emails');
const repository = require('../repositories/repository.users');
const { respond } = require('../util/responder');
const dummyData = require('../configs/dummyData');


module.exports = {
  register: async (body) => {
    const { email, firstName, lastName, organization, password, role } = body

    const hashPassword = bcrypt.hashSync(password, parseInt(process.env.SALT))

    const user = await User.create({
      email: email,
      firstName: firstName,
      lastName: lastName,
      organization: organization,
      password: hashPassword,
      role: role,
    })

    sendVerificationEmail(user)

    delete user._doc.password
    return user
  },

  login: async (body) => {
    const { email, password } = body
    const user = await User.findOne({ email }).exec()
    if (!user) {
      throw Error('Invalid User!')
    }
    if (!bcrypt.compareSync(password, user.password)) {
      throw Error('Incorrect password')
    }

    if (!user.verified) {
      throw Error('Account not verified!')
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)

    return token
  },

  getMe: async (req, res) => {
    try {
      const result = await repository.getMe(req.decoded);
      return respond(res, result);
    } catch (err) {
      return respond(res, err.message, false);
    }
  },
  updateProfile: async (req, res) => {
    try {
      const result = await repository.updateProfile(req.params._id, req.body);
      return respond(res, result);
    } catch (err) {
      return respond(res, err.message, false);
    }
  },
  verifyAccount: async (token) => {
    if (!token) {
      throw Error('Token not provided!');
    }
    const decoded = jwt.verify(token, process.env.JWT_VERIFICATION_SECRET)
    const user = await User.findOne({ _id: decoded }).exec()
    if (!user) {
      throw Error('Invalid User!')
    }
    await User.findByIdAndUpdate(user._id, { verified: true }).exec()
    sendVerificationConfirmedEmail(user);
    return true
  },

  requestResetPassword: async (body) => {
    const { email } = body
    const user = await User.findOne({ email }).exec()
    if (!user) {
      throw Error('Invalid User!')
    }
    sendPasswordResetEmail(user)
    return true
  },

  resetPassword: async (body) => {
    const { token, password } = body

    const decoded = jwt.verify(token, process.env.JWT_VERIFICATION_SECRET)
    const user = await User.findOne({ _id: decoded }).exec()
    if (!user) {
      throw Error('Invalid User!')
    }
    const hashPassword = bcrypt.hashSync(password, parseInt(process.env.SALT))
    await User.findByIdAndUpdate(user._id, { password: hashPassword }).exec()
    return true
  },
  changePassword: async (req) => {
    const { password, newPassword } = req.body

    const user = await User.findOne({ _id: req.decoded }).exec()
    if (!user) {
      throw Error('Invalid User!')
    }
    if (!bcrypt.compareSync(password, user.password)) {
      throw Error('Incorrect password')
    }
    const hashPassword = bcrypt.hashSync(newPassword, parseInt(process.env.SALT))
    await User.findByIdAndUpdate(user._id, { password: hashPassword }).exec()
    return true
  },
  createDemo: async () => {
    const employer = await User.findOne({ role: USER_ROLES.EMPLOYER }).exec()
    const employee = await User.findOne({ role: USER_ROLES.EMPLOYEE }).exec()

    const hashPassword = bcrypt.hashSync(process.env.DEMO_PASSWORD, parseInt(process.env.SALT))

    if (!employer) {
      User.create({
        email: process.env.EMPLOYER_EMAIL,
        password: hashPassword,
        verified: true,
        firstName: 'John',
        lastName: 'Doe',
        organization: 'Oracle',
        role: USER_ROLES.EMPLOYER,
      })
    } if (!employee) {
      User.create({
        email: process.env.EMPLOYEE_EMAIL,
        password: hashPassword,
        verified: true,
        firstName: 'Emily',
        lastName: 'Doe',
        organization: 'Oracle',
        role: USER_ROLES.EMPLOYEE,
      })
    }
  },
  insertJobs: async () => {
    try {
      const jobs = await Job.find();
      if (jobs.length < 8) {
        for (let job of dummyData) {
          await Job.create(job);
        }
        console.log('Dummy data added to db!');

      }
    } catch (error) {
      console.error(error);
    }

  }
}
