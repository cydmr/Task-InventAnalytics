const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./libraryCase.db",
});
const Book = require("./Book");
const User = require("./User");

const BorrowHistory = sequelize.define(
  "BorrowHistory",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    UserId: {
      type: DataTypes.INTEGER,
      references: {
        model: "User",
        key: "id",
      },
    },
    BookId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Book",
        key: "id",
      },
    },
    isReturned: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: -1,
    },
  },
  { tableName: "BorrowHistory" }
);

module.exports = BorrowHistory;
// `sequelize.define` also returns the model
// console.log(User === sequelize.models.User); // true
