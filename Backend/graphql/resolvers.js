const User = require('../model/users');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const Entry = require('../model/entry');
const entry = require('../model/entry');
const { nextTick } = require('process');

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

    if (validator.isEmpty(args.userData.password)) {
      errors.push({ message: 'password not set' })
    }

    if (!validator.isLength(args.userData.password, { min: 5 })) {
      errors.push({ message: 'password to short' })
    }

    if (errors.length > 0) {
      const error = new Error('Invalid entry');
      error.data = errors;
      error.status = 422;
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
  },


  login: async function ({ email, password }) {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error('No User found');
      error.code = 401
      throw error
    }
    const pswCheck = await bcrypt.compare(password, user.password);

    if (!pswCheck) {
      const error = new Error('Password invalid');
      error.code = 401;
      throw error
    }

    const token = jwt.sign(
      {
        user_id: user._id,
        email: user.email
      },
      'ourSecureKeyForValidationTokenOnTheServer',
      {
        expiresIn: '1h'
      }
    );

    return {
      token: token,
      _id: user._id.toString()
    }
  },

  createPost: async function createPost({ title, content }, req) {
    console.log(req.isAuthenticated)

    if (req.isAuthenticated === false) {
      const error = new Error('User not Authenticated!')
      throw error
    }

    const user = await User.findById(req.user_id);

    if (!user) {
      const error = new Error('no authenticated user found');
      throw error
    }

    if (validator.isEmpty(title) || validator.isEmpty(content)) {
      const error = new Error('no Title oder Content send');
      throw error
    }

    const entry = new Entry({
      title: title,
      content: content,
      user_id: user._id
    });
    const newEntry = await entry.save();

    user.posts.push(entry);
    await user.save();

    return {
      title: newEntry._doc.title,
      _id: newEntry._doc._id.toString(),
      content: newEntry._doc.content,
      user_id: newEntry._doc.user_id
    }
  },

  posts: async function (args, req) {
    if (!req.isAuthenticated) {
      const error = new Error('User not Authenticated');
      throw error
    }
    const user = await User.findById(req.user_id);

    const postArray = []

    for (let id of user.posts) {
      let post = await Entry.find({ _id: id });
      let mappedPost = {
        title: post[0].title,
        content: post[0].content,
        _id: post[0]._id.toString()
      }
      postArray.push(mappedPost);
    }
    return postArray
  },

  deletePost: async function deletePost({ _id }, req) {
    if (!req.isAuthenticated) {
      const error = new Error('Not Authenticated !')
      throw error
    }
    try {
      const deletedEntry = await Entry.findByIdAndDelete(_id);
      const user = await  User.findById(deletedEntry.user_id);
      const index = user.posts.findIndex( post => post._id == _id);
      console.log(index)
      user.posts.splice(index, 1);
      await user.save();
      console.log(_id)
      return { _id: _id }
    }
    catch {
      const error = new Error('an error occured !')
      throw error
    }

  }

}
