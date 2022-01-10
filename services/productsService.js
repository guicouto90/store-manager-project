const Joi = require('@hapi/joi');
const { findAll, create, findByName } = require('../models/productsModel');

// REF: https://stackoverflow.com/questions/57993305/how-can-i-validate-number-of-digits-from-joi-using-nodejs
// Para desabilitar a conversao automatica do number para string.
const productSchema = Joi.object({
  name: Joi.string().min(5).required(),
  quantity: Joi.number().min(1).required().strict(), 
});

const getAllProducts = async () => {
  const products = await findAll();
  
  return products;
};

const validateProduct = async (name, quantity) => {
  const { error } = productSchema.validate({ name, quantity });
  const verify = await findByName(name);

  if (error) {
    const error1 = { status: 422, message: error.message };
    throw error1;
  }

  if (verify) {
    const error2 = { status: 422, message: 'Product already exists' };
    throw error2;
  }
};

const createProduct = async (name, quantity) => {
  const productId = await create(name, quantity);

  const newProduct = {
    _id: productId,
    name,
    quantity,
  };

  return newProduct;
};

module.exports = {
  getAllProducts,
  createProduct,
  validateProduct,
};
