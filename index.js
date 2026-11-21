import express from 'express'
import dotenv from 'dotenv'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import db from './models/index.js'
import patientRoutes from './routes/patients.route.js'
import appointmentRoutes from './routes/appointments.route.js'
import queryRoutes from './routes/queries.route.js'

dotenv.config({ quiet: true })

const __dirname = dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT || 3000

const app = express()

app.set('view engine', 'ejs')
app.set('views', join(__dirname, 'views'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.redirect('/patients')
})

app.use('/patients', patientRoutes)
app.use('/appointments', appointmentRoutes)
app.use('/queries', queryRoutes)

app.use((req, res) => {
  res.status(404).render('404', { title: 'Sahifa topilmadi' })
})

const startServer = async () => {
  try {
    await db.sequelize.authenticate()
    await db.sequelize.sync({ alter: true })
    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()