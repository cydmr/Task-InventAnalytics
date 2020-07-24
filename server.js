const express = require("express");
const app = express();
const db = require("./db");

app.use(express.json({ extended: true }));

// To create/connect libraryCase.db
db();

app.use("/users", require("./routes/users"));
app.use("/books", require("./routes/books"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
