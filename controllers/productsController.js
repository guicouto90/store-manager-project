const { getAllProducts, createProduct, validateProduct } = require('../services/productsService');

const listAllProducts = async (req, res, next) => {
  try {
    const products = await getAllProducts();
    return res.status(200).json(products);
  } catch (err) {
    console.error(err.message);
    return next(err);
  }
};

const insertProduct = async (req, res, next) => {
  try {
    const { name, quantity } = req.body;
    await validateProduct(name, quantity);

    const product = await createProduct(name, quantity);
    return res.status(201).json(product);
  } catch (err) {
    console.error(err.message);
    return next(err);
  }
};

module.exports = {
  listAllProducts,
  insertProduct,
};