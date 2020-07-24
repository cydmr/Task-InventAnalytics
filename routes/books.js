const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const db_functions = require("../db_functions");

// @route   GET /books/:book_id
// @desc    Get a book with id
// @access  Public
router.get("/:book_id", async (req, res) => {
  try {
    const result = await db_functions.get_book({ book_id: req.params.book_id });
    result
      ? res.json({ result })
      : res.status(400).send({ msg: "Book does not found" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err);
  }
});

// @route   GET /books
// @desc    Get book list
// @access  Public
router.get("/", async (req, res) => {
  const result = await db_functions.list_books();
  res.json({ result: result });
});

// @route   POST /books
// @desc    Create a book
// @access  Public
router.post(
  "/",
  [check("name", "Name of the user is required ").exists()],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name } = req.body;
    try {
      db_functions.create_book({ name }).then((result) => {
        res.json({ result });
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
