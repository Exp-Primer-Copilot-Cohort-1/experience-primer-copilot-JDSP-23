// Create web server
// 1. Create a web server
// 2. Create a route for GET /comments
// 3. Create a route for POST /comments
// 4. Create a route for PUT /comments/:id
// 5. Create a route for DELETE /comments/:id

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

let comments = [];

app.get("/comments", (req, res) => {
  res.json(comments);
});

app.post("/comments", (req, res) => {
  const comment = req.body;
  comment.id = comments.length + 1;
  comments.push(comment);
  res.status(201).json(comment);
});

app.put("/comments/:id", (req, res) => {
  const id = req.params.id;
  const comment = req.body;
  comment.id = parseInt(id);
  comments = comments.map((c) => (c.id === comment.id ? comment : c));
  res.json(comment);
});

app.delete("/comments/:id", (req, res) => {
  const id = req.params.id;
  comments = comments.filter((c) => c.id !== parseInt(id));
  res.status(204).end();
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});