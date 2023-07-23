const Address = require('../models/address.model');
const User = require('../models/user.model');

exports.addAddress = async (req, res) => {
  const {
    name,
    contactNumber,
    street,
    landmark,
    city,
    state,
    zipcode,
    email
  } = req.body;

  // zip code format validation
  const zipCodeFormatRegex = /^\d{6}$/;
  if (!zipCodeFormatRegex.test(zipcode)) {
    return res.status(400).json({ error: 'Invalid zip code!' });
  }

  // contact number format validation
  const contactNumberFormatRegex = /^\d{10}$/;
  if (!contactNumberFormatRegex.test(contactNumber)) {
    return res.status(400).json({ error: 'Invalid contact number!' });
  }

  const user = await User.findOne({ email });

  // save shipping address
  const address = new Address({
    name,
    contactNumber,
    street,
    landmark,
    city,
    state,
    zipcode,
    user: user._id
  })
  const savedAddress = await address.save();
  res.status(200).json(savedAddress);
}