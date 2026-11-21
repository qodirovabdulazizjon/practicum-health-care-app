import db from '../models/index.js'

const STATUSES = ['scheduled', 'completed', 'canceled']

export const listAppointments = async (req, res) => {
  try {
    const [appointments, patients] = await Promise.all([
      db.appointments.findAll({
        include: [{ model: db.patients, as: 'patient' }],
        order: [['appointment_date', 'DESC']],
      }),
      db.patients.findAll({ order: [['name', 'ASC']] }),
    ])
    res.render('appointments/index', {
      title: 'Uchrashuvlar',
      appointments,
      patients,
      statuses: STATUSES,
      message: req.query.message || '',
      error: req.query.error || '',
    })
  } catch (error) {
    res.status(500).render('appointments/index', {
      title: 'Uchrashuvlar',
      appointments: [],
      patients: [],
      statuses: STATUSES,
      message: '',
      error: error.message,
    })
  }
}

export const newAppointmentForm = async (req, res) => {
  try {
    const patients = await db.patients.findAll({ order: [['name', 'ASC']] })
    res.render('appointments/form', {
      title: 'Yangi uchrashuv',
      appointment: null,
      patients,
      statuses: STATUSES,
      action: '/appointments',
      error: '',
      selectedPatientId: req.query.patient_id || '',
    })
  } catch (error) {
    res.status(500).redirect(`/appointments?error=${encodeURIComponent(error.message)}`)
  }
}

export const createAppointment = async (req, res) => {
  try {
    const { patient_id, doctor_name, appointment_date, status } = req.body
    const patients = await db.patients.findAll({ order: [['name', 'ASC']] })
    if (!patient_id || !doctor_name || !appointment_date) {
      return res.status(400).render('appointments/form', {
        title: 'Yangi uchrashuv',
        appointment: req.body,
        patients,
        statuses: STATUSES,
        action: '/appointments',
        error: 'Bemor, shifokor va sana majburiy.',
        selectedPatientId: patient_id || '',
      })
    }
    await db.appointments.create({
      patient_id,
      doctor_name: doctor_name.trim(),
      appointment_date,
      status: STATUSES.includes(status) ? status : 'scheduled',
    })
    res.redirect('/appointments?message=Uchrashuv%20qo%27shildi')
  } catch (error) {
    res.status(500).redirect(`/appointments?error=${encodeURIComponent(error.message)}`)
  }
}

export const editAppointmentForm = async (req, res) => {
  try {
    const [appointment, patients] = await Promise.all([
      db.appointments.findByPk(req.params.id),
      db.patients.findAll({ order: [['name', 'ASC']] }),
    ])
    if (!appointment) return res.status(404).redirect('/appointments?error=Uchrashuv%20topilmadi')
    res.render('appointments/form', {
      title: 'Uchrashuvni tahrirlash',
      appointment,
      patients,
      statuses: STATUSES,
      action: `/appointments/${appointment.id}/update`,
      error: '',
      selectedPatientId: appointment.patient_id,
    })
  } catch (error) {
    res.status(500).redirect(`/appointments?error=${encodeURIComponent(error.message)}`)
  }
}

export const updateAppointment = async (req, res) => {
  try {
    const appointment = await db.appointments.findByPk(req.params.id)
    if (!appointment) return res.status(404).redirect('/appointments?error=Uchrashuv%20topilmadi')
    const { patient_id, doctor_name, appointment_date, status } = req.body
    if (!patient_id || !doctor_name || !appointment_date) {
      return res.status(400).redirect(`/appointments/${req.params.id}/edit?error=Majburiy%20maydonlar%20to%27ldirilmagan`)
    }
    await appointment.update({
      patient_id,
      doctor_name: doctor_name.trim(),
      appointment_date,
      status: STATUSES.includes(status) ? status : appointment.status,
    })
    res.redirect('/appointments?message=Uchrashuv%20yangilandi')
  } catch (error) {
    res.status(500).redirect(`/appointments?error=${encodeURIComponent(error.message)}`)
  }
}

export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await db.appointments.findByPk(req.params.id)
    if (!appointment) return res.status(404).redirect('/appointments?error=Uchrashuv%20topilmadi')
    await appointment.destroy()
    res.redirect('/appointments?message=Uchrashuv%20o%27chirildi')
  } catch (error) {
    res.status(500).redirect(`/appointments?error=${encodeURIComponent(error.message)}`)
  }
}
