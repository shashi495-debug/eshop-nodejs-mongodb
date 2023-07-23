const jwt = require('jsonwebtoken');

exports.checkUserAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // check authorisation
  if (authHeader &&
    authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    jwt.verify(token, 'shhhhh', (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'You are not authorised to access this endpoint!' })
      }
      req.body.email = decoded.email;
      req.body.password = decoded.password;
    })
    next();
  } else {
    return res.status(403).json({ error: "Please Login first to access this endpoint!" });
  }
}