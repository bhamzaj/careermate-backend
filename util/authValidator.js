const jwt = require('jsonwebtoken');
const { respond } = require('./responder')
const User = require('../models/model.users');
const { USER_ROLES } = require('./constants');

module.exports = {
  validateUserToken: async (req, res, next) => {
    if(!req.headers.authorization){
      return respond(res, 'Token not provided', false)
    }
    const token = req.headers.authorization.split(' ')[1]
    try{
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.decoded = decoded._id

      const user = await User.findOne({_id: decoded._id }).exec()
      req.role = user.role
      next()
    }
    catch(err){
     return respond(res, 'Invalid Token', false)
   
    }
  },
  isAdmin: (req, res, next) => {
    if(req.role !== USER_ROLES.ADMIN){
      return respond(res, "You don't have access!", false);
    }
    next();
  },
  isEmployer: (req, res, next) => {
    if(req.role !== USER_ROLES.EMPLOYER){
      return respond(res, "You need an Employer account to perform this action!", false);
    }
    next();
  },
  isEmployee: (req, res, next) => {
    if(req.role !== USER_ROLES.EMPLOYEE){
      return respond(res, "You need an Employee account to perform this action!", false);
    }
    next();
  },
  hasAccess: (req, res, next) => {
    const {userId} = req.params;
    if(userId !== req.decoded){
      return respond(res, 'No access', false);
    }
    next();
  }
}