import { Router } from 'express'
import {
  queriesPage,
  patientsByDateRange,
  patientsByCondition,
  appointmentsByDoctor,
  patientsWithoutRecentAppointments,
} from '../controllers/queries.controller.js'

const router = Router()

router.get('/', queriesPage)
router.get('/patients-by-date-range', patientsByDateRange)
router.get('/patients-by-condition', patientsByCondition)
router.get('/appointments-by-doctor', appointmentsByDoctor)
router.get('/patients-without-recent-appointments', patientsWithoutRecentAppointments)

export default router
