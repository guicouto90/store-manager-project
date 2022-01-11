const { expect } = require('chai');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server-core');
const mongoConnection = require('../../models/connection')
const Sinon = require('sinon');

const { findAll, findProductById } = require('../../models/productsModel');

describe('Busca todos os produtos no BD', () => {
  let DBServer = new MongoMemoryServer();
  let connectionMock;

  before(async () => {
    const URLMock = await DBServer.getUri();

    connectionMock = await MongoClient.connect(URLMock, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then((conn) => conn.db('StoreManager'));

    Sinon.stub(mongoConnection).resolves(connectionMock);
  });

  after(async() => {
    await mongoConnection.restore();
  });

  describe('quando nao existe nenhum produto cadastrado', () => {
    before(async() => {
      await connectionMock.collection('products').deleteMany({})
    });

    it(' retorna um array', async () => {
      const response = await findAll();

      expect(response).to.be.a('array');
    });

    it('o array está vazio', async () => {
      const response = await findAll();

      expect(response).to.be.empty;
    })
  });

  describe('quando existem produtos cadastrados', () => {
    before(async() => {
      await connectionMock.collection('products'.insertOne({
        name: 'Bola de futebol',
        quantity: 30,
      }))
    })
    it('retorna um array', async() => {
      const response = await findAll();

      expect(response).to.be.a('array');
    });
    it('não retorna um array vazio', async() => {
      const response = await findAll();

      expect(response).to.be.not.empty;
    });
    it('deve ter um produto cadastrado', async() => {
      const response = await findAll();

      expect(response[0].name).to.be.eq('Bola de futebol');
    });
  });

  describe('Quando existe produto cadastrado é possivel achar por um ID valido', async () => {
    let id;
    before(async() => {
      const { insertedId } = await connectionMock.collection('products'.insertOne({
        name: 'Bola de futebol',
        quantity: 30,
      }))
      id = insertedId
    });
    it('verifica se o id é valido', async () => {
      const valid = await findProductById(id);

      expect(valid).to.be.eq(true);
    })
  })
})