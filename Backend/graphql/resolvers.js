const User = require('../model/users');
const bcrypt = require('bcryptjs');
const validator = require('validator');

module.exports = {
  createUser: async function (args, req) {
    const existingUser = await User.findOne({ email: args.userData.email });
    const errors = [];

    if (existingUser) {
      const error = new Error('User exists already');
      throw error
    }

    if (!validator.isEmail(args.userData.email)) {
      errors.push({ message: 'Email is invalid' });
    }

    if (!validator.isEmpty(args.userData.password) || !validator.isLength(args.userData.password, { min: 5 })) {
      errors.push({ message: 'password is invalid' })
    }

    if (errors.length > 0) {
      const error = new Error('Invalid entry');
      error.data = errors;
      errors.status = 422;
      throw error
    }

    const hashedPassword = await bcrypt.hash(args.userData.password, 12)

    const user = new User({
      email: args.userData.email,
      password: hashedPassword,
      name: args.userData.name
    })

    const createdUser = await user.save();

    return { ...createdUser._doc, _id: createdUser._id.toString() }


  }
}
