const express = require('express');

const salesRouter = express.Router();

const { 
  insertSale, 
  listAllSales, 
  listSaleId, 
  updateSale, 
  excludeSale, 
} = require('../controllers/salesController');

salesRouter.get('/', listAllSales);

salesRouter.get('/:id', listSaleId);

salesRouter.post('/', insertSale);

salesRouter.put('/:id', updateSale);

salesRouter.delete('/:id', excludeSale);

module.exports = salesRouter;