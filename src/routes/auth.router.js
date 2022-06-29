import express from "express";

const Router = express.Router();

// login
Router.post("/login", (req, res) => {
  res.send("login");
});

// register
Router.post("/register", (req, res) => {
  res.send("register");
});

export default Router;
