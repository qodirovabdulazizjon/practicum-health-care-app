export default (sequelize, Sequelize) => {
  const Appointments = sequelize.define('appointments', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    doctor_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    appointment_date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM('scheduled', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'scheduled',
    },
  }, {
    timestamps: true,
  })

  return Appointments
}