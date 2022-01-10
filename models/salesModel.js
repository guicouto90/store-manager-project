const connection = require('./connection');

const create = async (body) => {
  const connect = await connection();
  // console.log(productId)
  const { insertedId } = await connect.collection('sales').insertOne({ body });

  return insertedId;
};

module.exports = {
  create,
};