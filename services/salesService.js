const Joi = require('@hapi/joi');
const { ObjectId } = require('mongodb');
const { create } = require('../models/salesModel');
// const { findById } = require('../models/productsModel');

const salesSchema = Joi.object({
  quantity: Joi.number().min(1).required().strict(),
});

const validateSale = async (body) => {
  for (let index = 0; index < body.length; index += 1) {
    const { quantity, productId } = body[index];
    const { error } = salesSchema.validate({ quantity });
    const validateId = ObjectId.isValid(productId);
    // const idExist = await findById(productId);
    if (error || !validateId) {
      const error1 = { status: 422, message: 'Wrong product ID or invalid quantity' };
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

module.exports = {
  validateSale,
  createSale,
};