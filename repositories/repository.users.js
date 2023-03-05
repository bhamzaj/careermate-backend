const User = require('../models/model.users');

module.exports = {
    getMe: async (_id) => {
        const user = await User.findOne({ _id }).exec();
        if (!user) {
            throw Error('User not found');
        }

        delete user._doc.password;
        return user;
    },
    updateProfile: async (_id, body) => {
        const user = await User.findByIdAndUpdate(_id,
            {
                email: body.email,
                firstName: body.firstName,
                lastName: body.lastName,
                organization: body.organization
            },
            { new: true }
        );
        return user;
    }
}