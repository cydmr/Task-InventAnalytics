const { Sequelize, DataTypes } = require("sequelize");
// const sequelize = new Sequelize("sqlite::memory:");
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./libraryCase.db",
});
// const BorrowHistory = require("./BorrowHistory");
// const User = require("./User");

const Book = sequelize.define(
  "Book",
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,

      // allowNull defaults to true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "Book",
    // Other model options go here
  }
);
// Book.belongsToMany(User, { through: BorrowHistory });

// Book.hasMany(BorrowHistory);

module.exports = Book;

// `sequelize.define` also returns the model
// console.log(Book === sequelize.models.Book); // true
