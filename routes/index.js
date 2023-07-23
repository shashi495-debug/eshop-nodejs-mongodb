const express = require('express');
const router = express.Router();
const { auth, signUp } = require('../controllers/authController');
const { addAddress } = require('../controllers/shippingAddressController');
const {
  searchProduct,
  getProductCategories,
  getProductById,
  saveProduct,
  updateProductDetails,
  deleteProduct,
} = require('../controllers/productController');
const { createOrder } = require('../controllers/orderController');
const { checkUserAuth } = require('../middleware/checkUserAuth');
const { checkAdminAuth } = require('../middleware/checkAdminAuth');

//auth routes
router.post('/users', signUp);
router.post('/auth', auth);

// shipping address routes
router.post('/addresses', checkUserAuth, addAddress);

// product routes
router.get('/products', searchProduct);
router.post('/products', checkUserAuth, saveProduct);
router.get('/products/categories', getProductCategories);
router.get('/products/:id', getProductById);
router.put('/products/:id', checkUserAuth, checkAdminAuth, updateProductDetails);
router.delete('/products/:id', checkUserAuth, checkAdminAuth, deleteProduct);

router.post('/orders', checkUserAuth, createOrder);

module.exports = router;
