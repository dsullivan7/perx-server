
module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define('Account', {
    balance: DataTypes.FLOAT,
    currency: DataTypes.STRING,
  })

  Account.associate = (models) => {
    Account.belongsToMany(models.User, { through: 'UserAccount' })
  }

  return Account
}
