import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'
import patientsModel from './patients.model.js'
import appointmentsModel from './appointments.model.js'

dotenv.config({quiet: true})

const DB_URL = process.env.DB_URL

const sequelize = new Sequelize(DB_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
       require: true,
       rejectUnauthorized: false,
    }
  },
   logging: false,
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.patients = patientsModel(sequelize, Sequelize)
db.appointments = appointmentsModel(sequelize, Sequelize)

db.patients.hasMany(db.appointments, {
  foreignKey: 'patient_id',
  as: 'appointments',
  onDelete: 'CASCADE',
  hooks: true,
})

db.appointments.belongsTo(db.patients, {
  foreignKey: 'patient_id',
  as: 'patient',
})


export default db