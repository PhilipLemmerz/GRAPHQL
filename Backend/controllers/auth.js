const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../model/users');
const jwt = require('jsonwebtoken');


exports.signUp = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //... errors-handling
    const error = new Error('Validation Error !');
    error.statusCode = 422;
    error.data = errors.array();
    next(error); // will be handled by error use function in app.js
  }

  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;

  bcrypt.hash(password, 12).then(hashedPassword => {
    const user = new User({
      email: email,
      name: name,
      password: hashedPassword
    })
    return user.save();
  })
    .then(createdUser => res.status(201).json({ message: 'User successfully created', userID: createdUser._id }))
    .catch(error => {
      if (!err.statusCode) {
        error.statusCode = 500;
        next(error)
      }
    })
}

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let foundUser;

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        const error = new Error('No User with E-Mail found');
        error.statusCode = 401;
        next(error)
      }
      foundUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
      if (!isEqual) {
        const error = new Error('wrong Password');
        error.statusCode = 401;
        return next(error);
      }
      const jwtToken = jwt.sign(
        {
          email: foundUser.email,
          _id: foundUser._id.toString()
        },
        'thisIsOurSecrectKeyThatOnlyKnowOurServer',
        { expiresIn: '1h' } // hiermit authtentifiziert sich der Client -> gültig für eine Std.
      );
      console.log(jwtToken)
      res.status(200).json({token: jwtToken, _id: foundUser._id.toString() })
    })
    .catch(err => next(err))


}
