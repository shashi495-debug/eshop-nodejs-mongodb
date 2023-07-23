const Product = require('../models/product.model');

exports.searchProduct = async (req, res) => {
  try {
    const { category = '',
      direction = 'DESC',
      name = '',
      sortBy = 'productId',
      pageNo = 0,
      pageSize = 10 } = req.query;

    // Validate direction parameter
    if (direction !== 'ASC' && direction !== 'DESC') {
      return res.status(400).json({ error: 'Invalid direction value. Only ASC or DESC allowed.' });
    }

    // Validate pageSize and pageNo parameters
    const parsedPageSize = parseInt(pageSize);
    const parsedPageNo = parseInt(pageNo);
    if (isNaN(parsedPageSize) || parsedPageSize <= 0 || isNaN(parsedPageNo) || parsedPageNo < 0) {
      return res.status(400).json({ error: 'Invalid pageSize or pageNo value.' });
    }

    // find products based on the user provided criteria
    const products = await Product.find({ category, name })
      .sort({ [sortBy]: direction })
      .skip(parsedPageNo * parsedPageSize)
      .limit(parsedPageSize);

    // sort products based on sort direction provided by user
    const sortedProducts = products.sort({ sortBy: 1 })
    res.status(200).json(sortedProducts)
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

exports.getProductCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    return res.status(200).json(categories);
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

exports.getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findOne({ _id: id });

    if (!product) {
      return res.status(404).json({ message: `No Product found for ID - ${id}!` });
    }

    return res.status(200).json(product);
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

exports.saveProduct = async (req, res) => {
  try {
    const { name, category, price, description, manufacturer, availableItems, imageUrl } = req.body;
    console.log(imageUrl);
    // create a new product and save it in the database
    const product = new Product({
      name,
      category,
      price,
      description,
      manufacturer,
      availableItems,
      imageUrl
    });
    const savedProduct = await product.save();

    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.updateProductDetails = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    availableItems,
    price,
    category,
    description,
    imageUrl,
    manufacturer,
  } = req.body;

  try {
    const product = await Product.findOne({ _id: id });
    if (!product) {
      return res.status(404).json({ message: `No Product found for ID - ${id}!` });
    }

    // updtae product details
    product.name = name;
    product.availableItems = availableItems;
    product.price = price;
    product.category = category;
    product.description = description;
    product.imageUrl = imageUrl;
    product.manufacturer = manufacturer;
    product.updatedAt = Date.now();

    await product.save();

    return res.status(200).json(product);
  } catch (err) {
    console.log(err.message)
    return res.status(500).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findOne({ _id: id });
    if (!product) {
      return res.status(404).json({ message: `No Product found for ID - ${id}!` });
    }

    // delete the product
    const deletedProduct = await product.deleteOne({ _id: id })

    return res.status(200).json(deletedProduct);
  } catch (err) {
    console.log(err.message)
    return res.status(500).json({ message: err.message });
  }
}