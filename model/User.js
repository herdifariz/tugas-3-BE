//ketika server direstart maka data hanya akan seperti dibawah
// const User = [
//   {
//     id: 0,
//     nama: "Dimas Pramantya",
//     divisi: "Web"
//   },
//   {
//     id: 1,
//     nama: "Yuda Saputra",
//     divisi: "Mobile"
//   },
//   {
//     id: 2,
//     nama: "Haikal Mumtaz",
//     divisi: "Web"
//   }
// ]

const Sequelize = require("sequelize");
const my_db = require("../util/connect_db");

const User = my_db.define("users", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  fullName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  nim: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  angkatan: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  profilePicture: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = User;
