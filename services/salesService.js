const Joi = require('@hapi/joi');
const { ObjectId } = require('mongodb');
const { create, findAllSales, findById, editSale } = require('../models/salesModel');
// const { findById } = require('../models/productsModel');

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
  for (let index = 0; index < body.length; index += 1) {
    const { quantity, productId } = body[index];
    const { error } = salesSchema.validate({ quantity });
    const validateId = ObjectId.isValid(productId);
    // const idExist = await findById(productId);
    if (error || !validateId) {
      const error1 = { 
        status: 422, 
        message: 'Wrong product ID or invalid quantity', 
        code: 'invalid_data' };
      throw error1;
    }
  }
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
  const saleId = await findById(id);

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

module.exports = {
  validateSale,
  createSale,
  getAllSales,
  validId,
  changeSale,
};