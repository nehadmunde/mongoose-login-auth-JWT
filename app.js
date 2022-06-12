import dotenv from 'dotenv'
import connectDB from './config/connectdb.js'
dotenv.config()
import express from 'express'
import cors from 'cors';// to handle errors which occuers after we connect our project with react (frontend)
import userRoutes from './routes/userRoutes.js'

const app=express()
const port=process.env.port || 7000
const DATABASE_URL=process.env.DATABASE_URL

app.use(cors())

//database connection
connectDB(DATABASE_URL)

app.use(express.json())

app.use("/api/user",userRoutes)

app.listen(port,()=>{
    console.log(`App listening at port : $http://localhost:${port}`)
})

