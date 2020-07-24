const { Sequelize, DataTypes } = require("sequelize");

// const BorrowHistory = require("./BorrowHistory");
// const Book = require("./Book");
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./libraryCase.db",
});
const User = sequelize.define(
  "User",
  {
    // Model attributes are defined here
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,

      // defaultValue: 1,
      // allowNull defaults to true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "User", // Other model options go here
  }
);
// User.belongsToMany(Book, { through: BorrowHistory });

// User.hasMany(BorrowHistory, { foreignKey: "user_id" });
module.exports = User;
// `sequelize.define` also returns the model
// console.log(User === sequelize.models.User); // true
