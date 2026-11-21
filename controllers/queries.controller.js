import { Op } from 'sequelize'
import db from '../models/index.js'

const MEDICAL_CONDITIONS = ['diabetes', 'hypertension', 'asthma', 'heart_disease', 'none']

export const queriesPage = async (req, res) => {
  try {
    const doctorsRows = await db.appointments.findAll({
      attributes: ['doctor_name'],
      group: ['doctor_name'],
      order: [['doctor_name', 'ASC']],
    })
    res.render('queries/index', {
      title: 'So‘rovlar',
      conditions: MEDICAL_CONDITIONS,
      doctors: doctorsRows.map((d) => d.doctor_name),
      results: null,
      queryType: '',
      params: {},
      error: req.query.error || '',
    })
  } catch (error) {
    res.status(500).render('queries/index', {
      title: 'So‘rovlar',
      conditions: MEDICAL_CONDITIONS,
      doctors: [],
      results: null,
      queryType: '',
      params: {},
      error: error.message,
    })
  }
}

export const patientsByDateRange = async (req, res) => {
  const { from, to } = req.query
  try {
    if (!from || !to) {
      return res.redirect('/queries?error=Sana%20oralig%27ini%20kiriting')
    }
    const patients = await db.patients.findAll({
      include: [{
        model: db.appointments,
        as: 'appointments',
        where: {
          appointment_date: { [Op.between]: [from, to] },
          status: 'scheduled',
        },
        required: true,
      }],
      order: [['name', 'ASC']],
    })
    const doctorsRows = await db.appointments.findAll({ attributes: ['doctor_name'], group: ['doctor_name'], order: [['doctor_name', 'ASC']] })
    res.render('queries/index', {
      title: 'So‘rovlar',
      conditions: MEDICAL_CONDITIONS,
      doctors: doctorsRows.map((d) => d.doctor_name),
      results: { type: 'patients', items: patients },
      queryType: 'date-range',
      params: { from, to },
      error: '',
    })
  } catch (error) {
    res.redirect(`/queries?error=${encodeURIComponent(error.message)}`)
  }
}

export const patientsByCondition = async (req, res) => {
  const { condition } = req.query
  try {
    if (!condition) return res.redirect('/queries?error=Tibbiy%20holatni%20tanlang')
    const where = condition === 'none'
      ? { [Op.or]: [{ medical_history: { [Op.iLike]: '%none%' } }, { medical_history: null }, { medical_history: '' }] }
      : { medical_history: { [Op.iLike]: `%${condition}%` } }
    const patients = await db.patients.findAll({ where, order: [['name', 'ASC']] })
    const doctorsRows = await db.appointments.findAll({ attributes: ['doctor_name'], group: ['doctor_name'], order: [['doctor_name', 'ASC']] })
    res.render('queries/index', {
      title: 'So‘rovlar',
      conditions: MEDICAL_CONDITIONS,
      doctors: doctorsRows.map((d) => d.doctor_name),
      results: { type: 'patients', items: patients },
      queryType: 'condition',
      params: { condition },
      error: '',
    })
  } catch (error) {
    res.redirect(`/queries?error=${encodeURIComponent(error.message)}`)
  }
}

export const appointmentsByDoctor = async (req, res) => {
  const { doctor_name } = req.query
  try {
    if (!doctor_name) return res.redirect('/queries?error=Shifokor%20nomini%20kiriting')
    const appointments = await db.appointments.findAll({
      where: { doctor_name: { [Op.iLike]: doctor_name.trim() } },
      include: [{ model: db.patients, as: 'patient' }],
      order: [['appointment_date', 'DESC']],
    })
    const doctorsRows = await db.appointments.findAll({ attributes: ['doctor_name'], group: ['doctor_name'], order: [['doctor_name', 'ASC']] })
    res.render('queries/index', {
      title: 'So‘rovlar',
      conditions: MEDICAL_CONDITIONS,
      doctors: doctorsRows.map((d) => d.doctor_name),
      results: { type: 'appointments', items: appointments },
      queryType: 'doctor',
      params: { doctor_name },
      error: '',
    })
  } catch (error) {
    res.redirect(`/queries?error=${encodeURIComponent(error.message)}`)
  }
}

export const patientsWithoutRecentAppointments = async (req, res) => {
  const months = Number(req.query.months || 6)
  try {
    if (!Number.isFinite(months) || months < 1) return res.redirect('/queries?error=Oylar%20soni%20noto%27g%27ri')
    const since = new Date()
    since.setMonth(since.getMonth() - months)
    const sinceStr = since.toISOString().slice(0, 10)

    const recent = await db.appointments.findAll({
      attributes: ['patient_id'],
      where: {
        appointment_date: { [Op.gte]: sinceStr },
        status: { [Op.ne]: 'canceled' },
      },
      group: ['patient_id'],
    })
    const recentIds = recent.map((r) => r.patient_id)

    const patients = await db.patients.findAll({
      where: recentIds.length ? { id: { [Op.notIn]: recentIds } } : {},
      include: [{ model: db.appointments, as: 'appointments' }],
      order: [['name', 'ASC']],
    })

    const doctorsRows = await db.appointments.findAll({ attributes: ['doctor_name'], group: ['doctor_name'], order: [['doctor_name', 'ASC']] })
    res.render('queries/index', {
      title: 'So‘rovlar',
      conditions: MEDICAL_CONDITIONS,
      doctors: doctorsRows.map((d) => d.doctor_name),
      results: { type: 'patients', items: patients, since: sinceStr },
      queryType: 'inactive',
      params: { months },
      error: '',
    })
  } catch (error) {
    res.redirect(`/queries?error=${encodeURIComponent(error.message)}`)
  }
}
