const mongoose = require('mongoose')
const userController = require('../controllers/controller.users')
module.exports = {
  connect: () => {
    mongoose.connect(process.env.DATABASE_URL).then(async () => {
      console.log('Connected!');
      userController.createDemo();
      userController.insertJobs();
    })
  },
}
