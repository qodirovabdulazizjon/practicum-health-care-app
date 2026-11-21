import { Router } from 'express'
import {
  listPatients,
  newPatientForm,
  createPatient,
  editPatientForm,
  updatePatient,
  deletePatient,
} from '../controllers/patients.controller.js'

const router = Router()

router.get('/', listPatients)
router.get('/new', newPatientForm)
router.post('/', createPatient)
router.get('/:id/edit', editPatientForm)
router.post('/:id/update', updatePatient)
router.post('/:id/delete', deletePatient)

export default router
