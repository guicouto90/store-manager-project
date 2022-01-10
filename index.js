const express = require('express');

const app = express();

const PORT = 3000;
const errHandler = require('./middlewares/errorHandler');
const { listAllProducts, insertProduct } = require('./controllers/productsController');

app.use(express.json());

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.send();
});

app.get('/products', listAllProducts);

app.post('/products', insertProduct);

app.use(errHandler);

app.listen(PORT, () => console.log(`Port ${PORT} is working properly`));
