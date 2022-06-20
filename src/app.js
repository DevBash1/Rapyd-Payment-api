import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import { customlimiter } from "./middlewares/rateLimiting"
import { MAX_API_REQUEST } from "./config"

const app = express()


// Middlewares
app.use(cors())
app.use(bodyParser.json({ limit: "50mb" }))
app.use(bodyParser.urlencoded({ extended: false }))


// router  middlewares

app.use(customlimiter)

app.get("/api/v1/test", (req, res) => {
    res.send("rate limiting test.")
})

app.get("/", (req, res) => {
    res.send(`
        <h1>FlixMenu<h1>
        <p>Revolutionizing restaurants menus and Automating restaurants workflow.</p>
        <p>Follow us <a href="https://twitter.com/flixxmenu" target="_blank">@flixxmenu</a> <p> :)
    `)
})




const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`Server listening @ http://localhost:${PORT}`);
})
