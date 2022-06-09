const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  let clientToken = req.get('Authorization').split(' ')[1]; // split 'BEARER' away

  if (clientToken === 'null') {
    req.isAuthenticated = false
    return next();
  }
  let decodedToken
  try {
    decodedToken = jwt.verify(clientToken, 'ourSecureKeyForValidationTokenOnTheServer');
  }
  catch {
    req.isAuthenticated = false;
    return next()
  }

  req.isAuthenticated = true;
  req.user_id = decodedToken.user_id;
  next();
}
