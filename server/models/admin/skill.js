const Sequelize = require("sequelize");
const db = require("../../config/database");

const Skill = db.define("landing_page_skills", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  skillTitle: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },

  skillDescription: {
    type: Sequelize.TEXT("long"),
    allowNull: false,
  },
  skillContent: {
    type: Sequelize.TEXT("long"),
    allowNull: false,
  },
  skillUrlSlug: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  coverImageIcon: {
    type: Sequelize.STRING,
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

module.exports = Skill;
