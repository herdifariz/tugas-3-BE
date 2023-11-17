require("dotenv").config();
const Division = require("../model/Division");
const User = require("../model/User");
const my_db = require("./connect_db");
const bcrypt = require("bcrypt");

const divisi_itc = [
  { name: "WEB DEV" },
  { name: "MOBILE DEV" },
  { name: "PM" },
  { name: "UI/UX" },
  { name: "INKADIV" },
];

const adminPassword = process.env.ADMIN_PWD;
// async
const hashedPwd = bcrypt.hashSync(adminPassword, 10);

const admin = {
  fullName: process.env.ADMIN_FULLNAME,
  nim: process.env.ADMIN_NIM,
  angkatan: process.env.ADMIN_ANGKATAN,
  email: process.env.ADMIN_EMAIL,
  password: hashedPwd,
  // inkadiv merupakan elemen ke5 dari objek divisi
  divisionId: 5,
  role: "ADMIN",
};

// one to many, Division to User
Division.hasMany(User);
User.belongsTo(Division);

const association = async () => {
  try {
    // force true untuk membuat table, setelah dibuat diubah false
    await my_db.sync({ force: false });
    // input divisi ketika membuat db, tiap restart server
    // await Division.bulkCreate(divisi_itc);
    // await User.create(admin);
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = association;
