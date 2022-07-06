import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { customlimiter } from "./middlewares/rateLimiting";
import { MAX_API_REQUEST } from "./config";
import authRouter from "./routes/auth.router";
import walletRouter from "./routes/wallets.router";

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


// Authentication
app.use("/api/auth", authRouter);

// Wallets
app.use("/api/wallet", walletRouter)


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server listening @ http://localhost:${PORT}`);
});
