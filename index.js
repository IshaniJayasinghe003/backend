import express from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import userRouter from "./Routers/userRouter.js"
import productRouter from "./Routers/productRouter.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import cors from "cors"
import orderRouter from "./Routers/orderRouter.js"
dotenv.config()

const app = express()

app.use(bodyParser.json())
app.use(cors())

app.use(
    (req, res, next) => {
        const value = req.headers["authorization"]
        if (value != null) {
            const token = value.replace("Bearer ", "")
            jwt.verify(
                token,
                process.env.JWT_SECRET,
                (err, decoded) => {
                    if (decoded == null) {
                        res.status(403).json({
                            message: "Unauthorized"
                        })
                    } else {
                        req.user = decoded
                        next()

                    }
                }
            )
        } else {
            next()
        }
    }
)

const connectionString = process.env.MONGO_URI

mongoose.connect(connectionString).then(
    () => {
        console.log("Database connected")
    }
).catch(
    () => {
        console.log("Failed to connect to te database")
    }
)


app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);




app.listen(5000,
    () => {
        console.log("Server started")
    }
)