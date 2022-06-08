const jwt = require('jsonwebtoken');

module.exports = (req, res , next) => {
  const clientToken = req.get('Authorization').split(' ')[1]; // split 'BEARER' away
  console.log(clientToken);
  let decodedToken;

  try {
    decodedToken = jwt.verify(clientToken, 'thisIsOurSecrectKeyThatOnlyKnowOurServer')
  }
  catch (err) {
    // techical issue
    err.statusCode = 500;
    throw err;
  }
  if(!decodedToken) {
    // workt well but invalid Token
    const error = new Error('Not Authenticated!')
    error.statusCode = 401;
    return next(error);
  }
  // we are authenticated and place the userID to req
  req._id = decodedToken._id
  next();
}
