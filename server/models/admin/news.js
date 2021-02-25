const Sequelize = require("sequelize");
const db = require("../../config/database");

const News = db.define("news", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  newsTitle: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  newsContent: {
    type: Sequelize.TEXT("long"),
    allowNull: false,
  },
  newsCategoryID: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  newsUrlSlug: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  coverImageNameLg: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  coverImageNameMd: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  coverImageNameSm: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  published: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  createdAt: {
    type: "TIMESTAMP",
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    allowNull: false,
  },
  updatedAt: {
    type: "TIMESTAMP",
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    allowNull: false,
  },
});

module.exports = News;
