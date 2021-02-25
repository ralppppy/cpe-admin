const Sequelize = require("sequelize")
const db = require("../../config/database")

const NewsCategories = db.define("news_categories", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },

  categoryName: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },

  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
  },

  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false,
  },
})

module.exports = NewsCategories
