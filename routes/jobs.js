const express = require('express');
const router = express.Router();
const { validateUserToken, isEmployer, isEmployee, hasAccess } = require('../util/authValidator');

const jobsController = require('../controllers/controller.jobs');
const inputValidator = require('../util/inputValidator');

/** READ */
router.get('/', jobsController.getAll);
router.get('/:_id', jobsController.getJobById);
router.get('/user/:userId', validateUserToken, isEmployer, hasAccess, jobsController.getJobsByUserId);
router.get('/applied/:userId', validateUserToken, isEmployee, hasAccess, jobsController.getAppliedByUserId);

/** CREATE */
router.post('/', validateUserToken, isEmployer,
  inputValidator.validate.addJob, inputValidator.validateResult, jobsController.addJob);

/** UPDATE */
router.put('/update/:id', validateUserToken, isEmployer, inputValidator.validate.updateJob, inputValidator.validateResult, jobsController.updateJobById);
router.put('/apply', validateUserToken, isEmployee, jobsController.applyToJob);

/** DELETE */
router.delete('/:id', validateUserToken, isEmployer, jobsController.delete);

module.exports = router;
