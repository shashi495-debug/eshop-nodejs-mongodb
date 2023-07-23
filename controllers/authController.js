const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');

exports.signUp = async (req, res) => {
  const { firstName, lastName, email, contactNumber, password } = req.body;
  // check if user is already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(403).json({ error: 'Try any other email, this email is already registered!' })
  }

  // email format validation
  const emailFormatRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailFormatRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email-id format!' });
  }

  // Contact number format validation
  const contactNumberFormatRegex = /^\d{10}$/;
  if (!contactNumberFormatRegex.test(contactNumber)) {
    return res.status(400).json({ error: 'Invalid contact number!' });
  }

  // password encryption
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // save user
  const user = new User({
    isAdmin: false,
    name: firstName + ' ' + lastName,
    email,
    password: hashedPassword,
  })
  await user.save()
  console.log('a new user is created', user.name);

  // send user info
  const userInfo = {
    _id: user._id,
    firstName,
    lastName,
    email: user.email
  }
  res.status(200).json(userInfo);
}

exports.auth = async (req, res) => {
  const { email, password } = req.body;
  // check if user is already exists
  const userExists = await User.findOne({ email });
  if (!userExists) {
    return res.status(403).json({ error: 'This email has not been registered!' })
  }

  // check password
  const hashedPassword = userExists.password;
  const passwordIsCorrect = await bcrypt.compare(password, hashedPassword);
  if (!passwordIsCorrect) return res.status(400).json({ error: 'Invalid Credentials!' });

  // generate token and send to user
  const token = jwt.sign({ email, password }, 'shhhhh', { expiresIn: '7d' });
  res.setHeader('x-auth-token', token);

  // send user info
  const name = userExists.firstName + ' ' + userExists.lastName;
  const userInfo = {
    email,
    name,
    isAuthenticated: true
  }
  res.status(200).json(userInfo);
}