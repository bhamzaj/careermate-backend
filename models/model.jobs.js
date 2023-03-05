const mongoose = require('mongoose')
const { UserSchema } = require('../models/model.users')
const jobSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    city: { type: String, required: true },
    applicants: {
      type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }],
      default: []
    },
    views: { type: Number },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Jobs', jobSchema)
