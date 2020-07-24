const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../db");
const db_functions = require("../db_functions");

// @route   GET /users
// @desc    Get user list with ids and names
// @access  Public
router.get("/", async (req, res) => {
  const result = await db_functions.list_users();
  res.json({ result: result });
});

// @route   GET /user/:_id
// @desc    Get a user
// @access  Public
router.get("/:user_id", async (req, res) => {
  try {
    const result = await db_functions.get_user({ user_id: req.params.user_id });
    result
      ? res.json({ result })
      : res.status(400).send({ msg: "User does not exist" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err);
  }
});

// @route   POST /users
// @desc    Create a user
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
      db_functions.create_user({ name }).then((result) => {
        res.json({ result });
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).send(err);
    }
  }
);

// @route   POST /users/:user_id/borrow|return/:book_id
// @desc    Borrow/Return a book
// @access  Public
router.post("/:user_id/:action(borrow|return)/:book_id", async (req, res) => {
  try {
    if (req.params.action === "borrow") {
      const result = await db_functions.borrow({
        user_id: req.params.user_id,
        book_id: req.params.book_id,
      });

      result
        ? res.status(204).send()
        : res.status(500).send("Can not borrow book");
    } else {
      const result = await db_functions.return({
        user_id: req.params.user_id,
        book_id: req.params.book_id,
        score: req.body.score,
      });
      result
        ? res.status(204).send()
        : res.status(500).send("Can not return book");
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
