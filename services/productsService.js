const Joi = require('@hapi/joi');
const { ObjectId } = require('mongodb');
const { 
  findAll, 
  create, 
  findByName, 
  findProductById, 
  edit, 
  deleteId } = require('../models/productsModel');

// REF: https://stackoverflow.com/questions/57993305/how-can-i-validate-number-of-digits-from-joi-using-nodejs
// Para desabilitar a conversao automatica do number para string.
const productSchema = Joi.object({
  name: Joi.string().min(5).required(),
  quantity: Joi.number().min(1).required().strict(), 
});

const getAllProducts = async () => {
  const products = await findAll();
  
  return {
    products: [...products],
  };
};

const validateProduct = async (name, quantity) => {
  const { error } = productSchema.validate({ name, quantity });

  if (error) {
    const error1 = { status: 422, message: error.message, code: 'invalid_data' };
    throw error1;
  }
};

const createProduct = async (name, quantity) => {
  await validateProduct(name, quantity);
  const verify = await findByName(name);
  if (verify) {
    const error = { status: 422, message: 'Product already exists', code: 'invalid_data' };
    throw error;
  }

  const productId = await create(name, quantity);

  const newProduct = {
    _id: productId,
    name,
    quantity,
  };

  return newProduct;
};

const validId = async (id) => {
  // REF: https://www.geeksforgeeks.org/how-to-check-if-a-string-is-valid-mongodb-objectid-in-node-js/
  // Verificar se o ID é valido em mongoDB.
  const valid = ObjectId.isValid(id);

  if (!valid) {
    const error = { status: 422, message: 'Wrong id format', code: 'invalid_data' };
    throw error;
  }
  const productId = await findProductById(id);
  
  return productId;
};

const editProduct = async (id, name, quantity) => {
  await validateProduct(name, quantity);
  await validId(id);

  await edit(id, name, quantity);
  return {
    _id: id,
    name, 
    quantity,
  };
};

const deleteProduct = async (id, name, quantity) => {
  await validId(id);
  await deleteId(id);

  return {
    _id: id,
    name,
    quantity,
  };
};

module.exports = {
  getAllProducts,
  createProduct,
  validateProduct,
  validId,
  editProduct,
  deleteProduct,
};
