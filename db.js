// your credentials
const sqlite3 = require("sqlite3").verbose();
const { Sequelize, QueryTypes } = require("sequelize");
const User = require("./models/User");
const Book = require("./models/Book");
const BorrowHistory = require("./models/BorrowHistory");

const db = async () => {
  const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./libraryCase.db",
  });

  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }

  await BorrowHistory.sync();

  User.hasMany(BorrowHistory);
  Book.hasMany(BorrowHistory);
  BorrowHistory.belongsTo(Book);
  BorrowHistory.belongsTo(User);

  await User
    .sync
    // { force: true }
    ();
  await Book
    .sync
    // { force: true }
    ();
  console.log("synced");
};

module.exports = db;
