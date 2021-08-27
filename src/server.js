import express from "express"

import listEndpoints from "express-list-endpoints"
import cors from "cors"
import createError from "http-errors"
import morgan from "morgan"
import mongoose from "mongoose"

import usersRouter from "./services/users/index.js"
import accomodationsRouter from "./services/accomodations/index.js"
import authRouter from "./services/auth.js"

import { errorMiddlewares } from "./errorMiddlewares.js"
import cookieParser from "cookie-parser"
import passport from "passport"
import facebookStrategy, { googleStrategy } from "./auth/oauth.js"

const port = process.env.PORT || 3001
const server = express()

server.use(cookieParser())
passport.use("facebook", facebookStrategy)
passport.use("google", googleStrategy)

// Middlewares
const whitelist = [process.env.FRONTEND_URL, process.env.FRONTEND_PROD_URL]

server.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error("Not allowed by cors!"))
      }
    },
    credentials: true,
  })
)
server.use(passport.initialize())
server.use(express.json())
server.use(morgan("dev"))

server.use("/users", usersRouter)
server.use("/accomodation", accomodationsRouter)
server.use("/auth", authRouter)

server.use([errorMiddlewares])

console.table(listEndpoints(server))

server.use((req, res) => {
  if (!req.route) {
    const error = createError(404, "This route is not found!")
    res.status(error.status).send(error)
  }
})

mongoose
  .connect(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    server.listen(port, () => {
      console.log("Server running on port ", port)
    })
  )
  .catch((err) => console.log(err))
