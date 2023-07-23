exports.checkAdminAuth = (req, res, next) => {
  const { email, password } = req.body;
  if (email == 'admin@upgrad.com' && password == 'password') {
    req.body.isAdmin = true;
    next();
  } else {
    return res.status(401).json({ error: "You are not authorised to access this endpoint!" });
  }
}