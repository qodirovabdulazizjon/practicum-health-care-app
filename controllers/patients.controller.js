import db from '../models/index.js'

const MEDICAL_CONDITIONS = ['diabetes', 'hypertension', 'asthma', 'heart_disease', 'none']

const buildContactInfo = (body) => ({
  phone: (body.phone || '').trim(),
  email: (body.email || '').trim(),
  address: (body.address || '').trim(),
})

export const listPatients = async (req, res) => {
  try {
    const patients = await db.patients.findAll({
      include: [{ model: db.appointments, as: 'appointments' }],
      order: [['created_at', 'DESC']],
    })
    res.render('patients/index', {
      title: 'Bemorlar',
      patients,
      conditions: MEDICAL_CONDITIONS,
      message: req.query.message || '',
      error: req.query.error || '',
    })
  } catch (error) {
    res.status(500).render('patients/index', {
      title: 'Bemorlar',
      patients: [],
      conditions: MEDICAL_CONDITIONS,
      message: '',
      error: error.message,
    })
  }
}

export const newPatientForm = (req, res) => {
  res.render('patients/form', {
    title: 'Yangi bemor qo‘shish',
    patient: null,
    conditions: MEDICAL_CONDITIONS,
    action: '/patients',
    error: '',
  })
}

export const createPatient = async (req, res) => {
  try {
    const { name, age, medical_history } = req.body
    if (!name || name.trim() === '' || age === undefined || age === '') {
      return res.status(400).render('patients/form', {
        title: 'Yangi bemor qo‘shish',
        patient: { ...req.body, contact_info: buildContactInfo(req.body) },
        conditions: MEDICAL_CONDITIONS,
        action: '/patients',
        error: 'Ism va yosh majburiy.',
      })
    }

    await db.patients.create({
      name: name.trim(),
      age: Number(age),
      medical_history: (medical_history || 'none').trim(),
      contact_info: buildContactInfo(req.body),
    })

    res.redirect('/patients?message=Bemor%20muvaffaqiyatli%20qo%27shildi')
  } catch (error) {
    res.status(500).render('patients/form', {
      title: 'Yangi bemor qo‘shish',
      patient: { ...req.body, contact_info: buildContactInfo(req.body) },
      conditions: MEDICAL_CONDITIONS,
      action: '/patients',
      error: error.message,
    })
  }
}

export const editPatientForm = async (req, res) => {
  try {
    const patient = await db.patients.findByPk(req.params.id)
    if (!patient) {
      return res.status(404).redirect('/patients?error=Bemor%20topilmadi')
    }
    res.render('patients/form', {
      title: 'Bemor maʼlumotlarini tahrirlash',
      patient,
      conditions: MEDICAL_CONDITIONS,
      action: `/patients/${patient.id}/update`,
      error: '',
    })
  } catch (error) {
    res.status(500).redirect(`/patients?error=${encodeURIComponent(error.message)}`)
  }
}

export const updatePatient = async (req, res) => {
  try {
    const patient = await db.patients.findByPk(req.params.id)
    if (!patient) {
      return res.status(404).redirect('/patients?error=Bemor%20topilmadi')
    }

    const { name, age, medical_history } = req.body
    if (!name || name.trim() === '' || age === undefined || age === '') {
      return res.status(400).render('patients/form', {
        title: 'Bemor maʼlumotlarini tahrirlash',
        patient: { ...patient.toJSON(), ...req.body, contact_info: buildContactInfo(req.body) },
        conditions: MEDICAL_CONDITIONS,
        action: `/patients/${patient.id}/update`,
        error: 'Ism va yosh majburiy.',
      })
    }

    await patient.update({
      name: name.trim(),
      age: Number(age),
      medical_history: (medical_history || 'none').trim(),
      contact_info: buildContactInfo(req.body),
    })

    res.redirect('/patients?message=Bemor%20ma%27lumotlari%20yangilandi')
  } catch (error) {
    res.status(500).redirect(`/patients?error=${encodeURIComponent(error.message)}`)
  }
}

export const deletePatient = async (req, res) => {
  try {
    const patient = await db.patients.findByPk(req.params.id)
    if (!patient) {
      return res.status(404).redirect('/patients?error=Bemor%20topilmadi')
    }
    await patient.destroy()
    res.redirect('/patients?message=Bemor%20o%27chirildi')
  } catch (error) {
    res.status(500).redirect(`/patients?error=${encodeURIComponent(error.message)}`)
  }
}
