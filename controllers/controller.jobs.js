const repository = require('../repositories/repository.jobs');
const Jobs = require('../models/model.jobs')
const { respond } = require('../util/responder');


module.exports = {
  getAll: async (req, res) => {
    try {
      const result = await repository.getAll();
      return respond(res, result);
    } catch (err) {
      return respond(res, err.message, false);
    }
  },
  getJobById: async (req, res) => {
    try{
      const result = await repository.getById(req.params._id);
      return respond(res, result);
    }catch (err) {
      return respond(res, err.message, false);
    }
  },
  getJobsByUserId: async (req, res) => {
    try {
      const result = await repository.getAllByUserId(req.decoded);
      return respond(res, result);
    } catch (err) {
      return respond(res, err.message, false);
    }
  },
  getAppliedByUserId: async (req, res) => {
    try {
      const result = await repository.getAppliedByUserId(req.decoded);
      return respond(res, result);
    } catch (err) {
      return respond(res, err.message, false);
    }
  },
  addJob: async (req, res) => {
    try {
      const result = await repository.create(req.body, req.decoded);
      return respond(res, result);
    } catch (err) {
      return respond(res, err.message, false);
    }
  },
  updateJobById: async (req, res) => {
    try{
    const result = await repository.updateJobById(req.params.id, req.body, req.decoded);
    console.log(req.params.id)
    return respond(res, result);
    }catch (err) {
      return respond(res, err.message, false);
    }
  },
  applyToJob: async (req, res) => {
    try {
      const { jobId } = req.body;
      const result = await repository.applyTo(jobId, req.decoded);
      return respond(res, result);
    } catch (err) {
      return respond(res, err.message, false)
    }
  },
  delete: async(req, res) => {
    try {
      const result = await repository.delete(req.decoded, req.params.id);
      
      if(!result)
        return respond(res, 'Couldn\'t delete ', false);

      return respond(res, result);
    } catch (err) {
      return respond(res, err.message, false);
    }
  }

}
