const db = require("../../config/database");
const Sequelize = require("sequelize");

const AboutUs = db.define("about_us", {
  id: {
    type: Sequelize.INTEGER,
    allowNUll: false,
    primaryKey: true,
    autoIncrement: true,
  },
  aboutUsIntroduction: {
    type: Sequelize.TEXT("long"),
    allowNull: false,
  },
  aboutUsContent: {
    type: Sequelize.TEXT("long"),
    allowNull: false,
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
  },

  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false,
  },
});

module.exports = AboutUs;
