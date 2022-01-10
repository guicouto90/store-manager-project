const { 
  validateSale,
  createSale,
} = require('../services/salesService');

const insertSale = async (req, res, next) => {
  try {
    // const { productId, quantity } = req.body;
    await validateSale(req.body);
    
    const sale = await createSale(req.body);
    return res.status(200).json(sale);
  } catch (err) {
    console.error(err.message);
    return next(err);
  }
};

module.exports = {
  insertSale,
};