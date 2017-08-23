module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    googleId: DataTypes.STRING,
  })

  User.associate = (models) => {
    User.belongsToMany(models.Account, { through: 'UserAccount' })
  }

  return User
}
