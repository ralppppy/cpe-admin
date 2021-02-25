const Sequelize = require("sequelize");
const db = require("../../config/database");

const Admin = db.define("admins", {
  id: {
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    type: Sequelize.INTEGER,
  },

  userName: {
    allowNull: false,
    type: Sequelize.STRING,
  },

  password: {
    allowNull: false,
    type: Sequelize.STRING,
  },

  email: {
    allowNull: false,
    type: Sequelize.STRING,
  },

  firstName: {
    allowNull: false,
    type: Sequelize.STRING,
  },

  lastName: {
    allowNull: false,
    type: Sequelize.STRING,
  },

  createdAt: {
    allowNull: false,
    type: Sequelize.DATE,
  },

  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE,
  },
});

module.exports = Admin;
