const express = require('express');

const app = express();
const PORT = 3000;
const errHandler = require('./middlewares/errorHandler');
const productsRouter = require('./router/productsRouter');
const salesRouter = require('./router/salesRouter');

app.use(express.json());

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.send();
});

app.use('/products', productsRouter);

app.use('/sales', salesRouter);

app.use(errHandler);

app.listen(PORT, () => console.log(`Port ${PORT} is working properly`));
