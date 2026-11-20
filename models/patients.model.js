export default (sequelize, Sequelize) => {
  const Patients = sequelize.define('patients', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    age: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    medical_history: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    contact_info: {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: {},
    },
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  })

  return Patients
}