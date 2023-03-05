const Jobs = require('../models/model.jobs');
const User = require('../models/model.users');

module.exports = {
    getAll: async () => {
        const jobs = await Jobs.find();
        return jobs;
    },
    getById: async (_id) => {
        //const job = await Jobs.findById(_id);
        const job = await Jobs.findOneAndUpdate(
            { _id },
            { $inc: { views: 1 } },
            { new: true }
        );

        return job;
    },
    getAllByUserId: async (userId) => {
        const jobs = Jobs.find({ userId }).populate('applicants');
        return jobs;

    },
    getAppliedByUserId: async (userId) => {
        const jobs = await Jobs.find({ "applicants": userId }).populate('applicants');
        return jobs;
    },
    create: async (body, userId) => {
        const { title, description, category, city } = body;

        const job = await Jobs.create({
            userId: userId,
            title: title,
            description: description,
            category: category,
            city: city,
            views: 0,
        });
        return job;
    },
    updateJobById: async (_id, body, userId) => {
        const { title, description, category, city } = body;

        const job = await Jobs.findByIdAndUpdate(
            _id,
            {
                title,
                description,
                category,
                city
            },
            {
                new: true
            }
        );
        return job;
    },
    applyTo: async (jobId, userId) => {
        const job = await Jobs.findById(jobId);
        const user = await User.findOne({ _id: userId}).exec();
        const hasUser = job.applicants.some(user => user.toString() === userId)

        if (hasUser) {
            job.applicants = job.applicants.filter(user => user.toString() !== userId); //remove userId from array
        } else {
            job.applicants.push(user);
        }
        const updatedJob = await Jobs.findByIdAndUpdate(
            jobId,
            { applicants: job.applicants },
            { new: true }
        ).populate('applicants');
        return updatedJob;
    },
    delete: async (userId, _id) => {
        return await Jobs.findOneAndDelete({ _id, userId });
    }
}