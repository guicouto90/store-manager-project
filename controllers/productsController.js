const { 
  getAllProducts, 
  createProduct, 
  validateProduct, 
  validId, 
  editProduct, 
  deleteProduct } = require('../services/productsService');

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

const listId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const productId = await validId(id);

    return res.status(200).json(productId);
  } catch (err) {
    console.error(err.message);
    return next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { name, quantity } = req.body;
    const { id } = req.params;
    await validateProduct(name, quantity);
    await validId(id);
    const product = await editProduct(id, name, quantity);
    
    return res.status(200).json(product);
  } catch (err) {
    console.error(err.message);
    return next(err);
  }
};

const excludeProduct = async (req, res, next) => {
  try {
    const { name, quantity } = req.body;
    const { id } = req.params;

    await validId(id);
    const product = await deleteProduct(id, name, quantity);
    
    return res.status(200).json(product);
  } catch (err) {
    console.error(err.message);
    return next(err);
  }
};

module.exports = {
  listAllProducts,
  insertProduct,
  listId,
  updateProduct,
  excludeProduct,
};