//using mongodb driver
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;
const mongoConnect = (cb) => {
  MongoClient.connect(
    `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}/${process.env.DB}?retryWrites=true&w=majority`,
    { useUnifiedTopology: true }
  )
    .then((client) => {
      console.log("Connected to DB");
      _db = client.db();
      cb();
    })
    .catch((err) => console.log("ERROR", err));
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw Error("No DB Found!");
};

module.exports.mongoConnect = mongoConnect;
module.exports.getDb = getDb;
