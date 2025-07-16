import express from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import userRouter from "./Routers/userRouter.js"
import jwt from "jsonwebtoken"

const  app = express()

app.use(bodyParser.json())

app.use(
  (req, res, next) => {
     const value = req.headers["Authorization"]
     if (value != null) {
    const token = value.replace("Bearer ","")
    jwt.verify(
        token,
        "cbc-6503",
        (err,decoded)=>{
      if(decoded==null){
            res.status(403).json({
            message:"Unauthorized"
        })
                    }else{
                      req.user = decoded
                      next()
                    
                    }                    
                }
            )
        }else{
            next()
        }        
    }
)

const connectionString="mongodb+srv://admin:123@cluster0.2ttddum.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(connectionString).then(
    ()=>{
        console.log("Database connected")
    }
).catch(
    ()=>{
        console.log("Failed to connect to te database")
    }
)


app.use("/users", userRouter);




app.listen(5000,
    ()=>{
        console.log("Server started")
    }
)