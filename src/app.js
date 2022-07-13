import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { customlimiter } from "./middlewares/rateLimiting";
import authRouter from "./routes/auth.router";
import walletRouter from "./routes/wallets.router";
import Fetch from "./utils/fetch";
import { DATABASE_URL } from "./config"
import mongoose from "mongoose"

const app = express();

// Middlewares
app.use(cors({
  credentials: true,
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
}));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: false }));

// router  middlewares
app.use(customlimiter);

app.get("/", (req, res) => {
  res.send(`WELCOME`);
});


// test rapyd api
app.get('/country', async (req, res) => {

  try {
    const result = await Fetch('GET', '/v1/payment_methods/country?country=mx');

    res.json(result);
  } catch (error) {
    res.json(error);
  }

})

app.get('/payment', async (req, res) => {

  try {
    const body = {
      amount: 230,
      currency: 'MXN',
      payment_method: {
        type: 'mx_diestel_cash'
      }
    };
    const result = await Fetch('POST', '/v1/payments', body);
    res.json(result);
  } catch (error) {
    res.json(error);
  }

})

// Authentication
app.use("/api/auth", authRouter);

// Wallets
app.use("/api/wallet", walletRouter)


const PORT = process.env.PORT || 8080;

const LOCAL_DB = "local mongodb url"

const DB_URL = process.env.NODE_ENV == "development" ? LOCAL_DB : DATABASE_URL

mongoose.connect(DB_URL, { useNewUrlParser: true }).then((res) => {
  console.log("MONGODB CONNECTED")
  return app.listen(PORT, () => {
    console.log(`Server listening @ http://localhost:${PORT}`);
  })

}).catch((err) => {
  console.log(`Error connecting database: ${err.message}`);
})