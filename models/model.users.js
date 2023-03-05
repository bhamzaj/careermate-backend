const mongoose = require('mongoose')
const {USER_ROLES} = require('../util/constants')
const userSchema = mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true, min: 2, max: 50 },
    lastName: { type: String, required: true, min: 2, max: 50 },
    organization: {type: String},
    password: { type: String, required: true, min: 6 },
    verified: { type: Boolean, default: false },
    role: { type: String, enum: Object.values(USER_ROLES), required: true },
  },
  {
    timestamps: true,
  }
)
exports.userSchema;
module.exports = mongoose.model('User', userSchema)
