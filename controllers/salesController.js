const { 
  validateSale,
  createSale,
  getAllSales,
  validId,
} = require('../services/salesService');

const listAllSales = async (req, res, next) => {
  try {
    const sales = await getAllSales();
    return res.status(200).json(sales);
  } catch (err) {
    console.error(err.message);
    return next(err);
  }
};

const insertSale = async (req, res, next) => {
  try {
    await validateSale(req.body);
    
    const sale = await createSale(req.body);
    return res.status(200).json(sale);
  } catch (err) {
    console.error(err.message);
    return next(err);
  }
};

const listSaleId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const saleId = await validId(id);

    return res.status(200).json(saleId);
  } catch (err) {
    console.error(err.message);
    return next(err);
  }
};

module.exports = {
  insertSale,
  listAllSales,
  listSaleId,
};