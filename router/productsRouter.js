const express = require('express');

const productsRouter = express.Router();

const { 
  listAllProducts, 
  insertProduct, 
  listId, 
  updateProduct, 
  excludeProduct, 
} = require('../controllers/productsController');

productsRouter.get('/', listAllProducts);

productsRouter.get('/:id', listId);

productsRouter.post('/', insertProduct);

productsRouter.put('/:id', updateProduct);

productsRouter.delete('/:id', excludeProduct);

module.exports = productsRouter;