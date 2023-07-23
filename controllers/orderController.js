const Product = require('../models/product.model');
const Address = require('../models/address.model');
const Order = require('../models/order.model');
const User = require('../models/user.model');

exports.createOrder = async (req, res) => {
  const { productId, addressId, quantity, email } = req.body;
  try {
    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: `No Product found for ID - ${productId}!` });
    }
    // Check if the product is available
    if (product.availableItems < quantity) {
      return res.status(400).json({ message: `Product with ID - ${productId} is currently out of stock!` });
    }

    // Check if the address exists
    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(404).json({ message: `No Address found for ID - ${addressId}!` });
    }

    // get user id with provided email
    const user = await User.findOne({ email })

    // Create the order
    const order = new Order({
      product: productId,
      address: addressId,
      quantity,
      user
    });

    await order.save();
    const response = {
      addressId: order.address,
      productId: order.product
    }

    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

