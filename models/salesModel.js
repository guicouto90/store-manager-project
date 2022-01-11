const { ObjectId } = require('mongodb');
const connection = require('./connection');

const findAllSales = async () => {
  const connect = await connection();
  const query = await connect.collection('sales').find().toArray();

  return query;
};

const create = async (body) => {
  const itensSold = body;
  const connect = await connection();
  // REF: https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
  await Promise.all(body.map(async ({ productId, quantity }) => {
    await connect.collection('products').updateOne(
      { _id: ObjectId(productId) },
      { $inc: { quantity: -quantity } },
    );
  }));
  /* for (let index = 0; index < body.length; index += 1) {
    const { productId, quantity } = body[index];
    await connect.collection('products').updateOne(
      { _id: ObjectId(productId) },
      { $inc: { quantity: -quantity } },
    );
  } */
  const { insertedId } = await connect.collection('sales').insertOne({ itensSold });

  return insertedId;
};

const findById = async (id) => {
  const connect = await connection();
  const query = await connect.collection('sales').findOne({ _id: ObjectId(id) });
  return query;
};

const editSale = async (id, body) => {
  const itensSold = body;
  const connect = await connection();
  await connect.collection('sales').updateOne(
    { _id: ObjectId(id) }, 
    { $set: { itensSold } },
  );
};

const deleteSaleId = async (id, body) => {
  const connect = await connection();
  // REF: https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
  await Promise.all(body.map(async ({ productId, quantity }) => {
    await connect.collection('products').updateOne(
      { _id: ObjectId(productId) },
      { $inc: { quantity } },
    );
  }));
  /* for (let index = 0; index < body.length; index += 1) {
    const { productId, quantity } = body[index];
    console.log(quantity);
    await connect.collection('products').updateOne(
      { _id: ObjectId(productId) },
      { $inc: { quantity } },
    );
  } */
  await connect.collection('sales').deleteOne({ _id: ObjectId(id) });
};

module.exports = {
  findAllSales,
  create,
  findById,
  editSale,
  deleteSaleId,
};