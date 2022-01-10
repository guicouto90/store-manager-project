const connection = require('./connection');

const findAll = async () => {
  const connect = await connection();
  const query = await connect.collection('products').find().toArray();

  return query;
};

const create = async (name, quantity) => {
  const connect = await connection();
  const { insertedId } = await connect.collection('products').insertOne({ name, quantity });

  return insertedId;
};

const findByName = async (name) => {
  const connect = await connection();
  const query = await connect.collection('products').findOne({ name });

  return query;
};

module.exports = {
  findAll,
  create,
  findByName,
};