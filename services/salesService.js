const Joi = require('@hapi/joi');
const { ObjectId } = require('mongodb');
const { 
  create, 
  findAllSales, 
  findSaleById, 
  editSale, 
  deleteSaleId } = require('../models/salesModel');
const { findProductById } = require('../models/productsModel');

const salesSchema = Joi.object({
  quantity: Joi.number().min(1).required().strict(),
});

const getAllSales = async () => {
  const sales = await findAllSales();

  return {
    sales: [...sales],
  };
};

const validateSale = async (body) => {
  await Promise.all(body.map(async ({ productId, quantity }) => {
    const { error } = salesSchema.validate({ quantity });
    const validateId = ObjectId.isValid(productId);
    const idExist = await findProductById(productId);
    if (error || !validateId || !idExist) {
      const error1 = { 
        status: 422, 
        message: 'Wrong product ID or invalid quantity', 
        code: 'invalid_data' };
      throw error1;
    }
  }));
  /* for (let index = 0; index < body.length; index += 1) {
    const { quantity, productId } = body[index];
    const { error } = salesSchema.validate({ quantity });
    const validateId = ObjectId.isValid(productId);
    // const idExist = await findSaleById(productId);
    if (error || !validateId) {
      const error1 = { 
        status: 422, 
        message: 'Wrong product ID or invalid quantity', 
        code: 'invalid_data' };
      throw error1;
    }
  } */
};

const createSale = async (body) => {
  const saleId = await create(body);

  const newSale = {
    _id: saleId,
    itensSold: body,
  };

  return newSale;
};

const validId = async (id) => {
  // REF: https://www.geeksforgeeks.org/how-to-check-if-a-string-is-valid-mongodb-objectid-in-node-js/
  // Verificar se o ID é valido em mongoDB.
  const valid = ObjectId.isValid(id);
  if (!valid) {
    const error = { status: 404, message: 'Sale not found', code: 'not_found' };
    throw error;
  }
  const saleId = await findSaleById(id);

  if (!saleId) {
    const error = { status: 404, message: 'Sale not found', code: 'not_found' };
    throw error;
  }  
  
  return saleId;
};

const changeSale = async (id, body) => {
  await editSale(id, body);

  const edit = {
    _id: id,
    itensSold: body,
  };

  return edit;
};

const deleteSale = async (id) => {
  const valid = ObjectId.isValid(id);
  if (!valid) {
    const error = { status: 422, message: 'Wrong sale ID format', code: 'invalid_data' };
    throw error;
  }

  const saleId = await findSaleById(id);

  if (!saleId) {
    const error = { status: 422, message: 'Wrong sale ID format', code: 'invalid_data' };
    throw error;
  }

  const deleted = {
    _id: id,
    itensSold: saleId.itensSold,
  };

  await deleteSaleId(id, saleId.itensSold);

  return deleted;
};

const validateQuantity = async (body) => {
  await Promise.all(body.map(async ({ productId, quantity }) => {
    const product = await findProductById(productId);
    if (product.quantity < quantity) {
      const error = { 
        status: 404, 
        message: 'Such amount is not permitted to sell', 
        code: 'stock_problem' };
      throw error;
    }
  }));
};

module.exports = {
  validateSale,
  createSale,
  getAllSales,
  validId,
  changeSale,
  deleteSale,
  validateQuantity,
};