module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('UserAccount', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      UserId: {
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id', onDelete: 'CASCADE' },
      },
      AccountId: {
        type: Sequelize.INTEGER,
        references: { model: 'Accounts', key: 'id', onDelete: 'CASCADE' },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    }),
  down: queryInterface => queryInterface.dropTable('UserAccount'),
}
