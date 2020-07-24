const sqlite3 = require("sqlite3").verbose();
const { Sequelize, QueryTypes, models } = require("sequelize");
const User = require("./models/User");
const Book = require("./models/Book");
const BorrowHistory = require("./models/BorrowHistory");
const db = require("./db");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./libraryCase.db",
});
const db_functions = {
  create_user: async (data) => {
    const user = await User.create({ name: data.name });
    return user;
  },

  get_user: async (data) => {
    const user = await User.findOne({
      where: { id: data.user_id },
      attributes: ["id", "name"],
    });
    if (!user) return false;
    const present_books = await BorrowHistory.findAll({
      where: { UserId: data.user_id, isReturned: false },
      include: Book,
      attributes: ["isReturned", "score"],
    });
    const resPresents = present_books.map((i) => ({
      name: i.Book.name,
    }));
    const past_books = await BorrowHistory.findAll({
      where: { UserId: data.user_id, isReturned: true },
      include: Book,
      attributes: ["isReturned", "score"],
    });
    const resPasts = past_books.map((i) => ({
      name: i.Book.name,
      userScore: i.score,
    }));
    return {
      id: user.dataValues.id,
      name: user.dataValues.name,
      books: {
        past: resPasts,
        present: resPresents,
      },
    };
  },

  list_users: async () => {
    const users = await User.findAll({ attributes: ["id", "name"] });
    // console.log(users.every((user) => user instanceof User)); // true
    const result = users.map((user) => user.dataValues);
    return result;
  },

  get_book: async (data) => {
    const book = await Book.findOne({
      where: { id: data.book_id },
      attributes: ["id", "name"],
    });
    if (!book) return false;
    const borrowings = await BorrowHistory.findAll({
      attributes: [[Sequelize.fn("AVG", Sequelize.col("score")), "avgScore"]],
      where: { BookId: data.book_id, isReturned: true },
      group: "BookId",
    });

    const score = borrowings[0] ? borrowings[0].dataValues.avgScore : -1;
    return { id: book.dataValues.id, name: book.dataValues.name, score };
  },

  create_book: async (data) => {
    const book = await Book.create({ name: data.name });
    return book;
  },

  list_books: async () => {
    const books = await Book.findAll({ attributes: ["id", "name"] });
    // console.log(users.every((book) => user instanceof User)); // true
    const result = books.map((book) => book.dataValues);
    return result;
  },

  borrow: async (data) => {
    const { user_id: UserId, book_id: BookId } = data;
    const isBorrowed = await BorrowHistory.findAll({
      where: { UserId, BookId, isReturned: false },
    });
    if (isBorrowed.length > 0) {
      return false;
    }

    const borrow = await BorrowHistory.create({
      UserId,
      BookId,
    });
    return borrow;
  },

  return: async (data) => {
    const { user_id: UserId, book_id: BookId, score } = data;

    const isBorrowed = await BorrowHistory.findAll({
      where: { UserId, BookId, isReturned: false },
    });
    if (isBorrowed.length > 0) {
      return await BorrowHistory.update(
        { isReturned: true, score: score },
        { where: { UserId, BookId, isReturned: false } }
      ).then((result) => result);
    } else return false;
  },
};

module.exports = db_functions;
