import express from 'express'
import dotenv from 'dotenv'
dotenv.config({quiet: true})

const PORT = process.env.PORT

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.listen(PORT, () => {
  console.log(`Server running on  port: ${PORT}`)
})