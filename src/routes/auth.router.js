import express from "express";
import AuthControler from "../controller/auth.controller";

const Router = express.Router();

const Auth = new AuthControler();

// login
Router.post("/login", (req, res) => {
  const payload = req.body;
  Auth.login(res, payload);
});

// register
Router.post("/register", (req, res) => {
  const payload = req.body;
  Auth.register(res, payload);
});

export default Router;
