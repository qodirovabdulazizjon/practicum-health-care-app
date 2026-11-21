import { Router } from 'express'
import {
  listAppointments,
  newAppointmentForm,
  createAppointment,
  editAppointmentForm,
  updateAppointment,
  deleteAppointment,
} from '../controllers/appointments.controller.js'

const router = Router()

router.get('/', listAppointments)
router.get('/new', newAppointmentForm)
router.post('/', createAppointment)
router.get('/:id/edit', editAppointmentForm)
router.post('/:id/update', updateAppointment)
router.post('/:id/delete', deleteAppointment)

export default router
