require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const router = require("./router/index")
const errorMiddleware = require("./middlewares/error-middleware")

const app = express()
const PORT = process.env.PORT | 5000

//Middleware
app.use(express.json())
app.use(cookieParser()) // для обработки cookie
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
)
app.use("/api", router)
app.use(errorMiddleware)


const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, options)
    app.listen(PORT, () => console.log(`Server started on ${PORT} port`))
  } catch (e) {
    console.log(e)
  }
}
start()
