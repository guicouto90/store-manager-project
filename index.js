const express = require('express');

const app = express();

const PORT = 3000;
const errHandler = require('./middlewares/errorHandler');
const { 
  listAllProducts, 
  insertProduct, 
  listId, 
  updateProduct, 
  excludeProduct } = require('./controllers/productsController');

app.use(express.json());

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.send();
});
app.get('/products/:id', listId);

app.get('/products', listAllProducts);

app.post('/products', insertProduct);

app.put('/products/:id', updateProduct);

app.delete('/products/:id', excludeProduct);

app.use(errHandler);

app.listen(PORT, () => console.log(`Port ${PORT} is working properly`));
