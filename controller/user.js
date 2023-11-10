// import model users dari folder model
const Division = require("../model/Division");
const User = require("../model/User");

const getAllUser = async (req, res, next) => {
  try {
    const users = await User.findAll();

    res.status(200).json({
      status: "Success",
      message: "Succesfully fetch all user data",
      users,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const getUserById = async (req, res, next) => {
  try {
    //const userId = req.params.userId;

    //ambil :userId dari req.params
    const { userId } = req.params; //tipe string

    //select user sesuai user id yang diharapkan
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });

    if (user === undefined) {
      res.status(400).json({
        status: "Error",
        message: `User with id ${userId} is not existed!`,
      });
    }
    res.status(200).json({
      status: "Success",
      message: "Succesfully fetch user data",
      user: user,
    });
  } catch (error) {}
};

const postUser = async (req, res, next) => {
  try {
    const { fullName, nim, angkatan, email, password, division } = req.body;

    // cari divisi id
    const userDivision = await Division.findOne({
      where: {
        name: division,
      },
    });

    // SELECT * FROM divisions WHERE name = division
    if (userDivision == undefined) {
      req.status(400).json({
        status: "Error",
        message: `${division} not exist`,
      });
    }

    const currentUser = await User.create({
      // field: data
      // jika nama field dan data sama, bisa diringkas
      fullName,
      nim,
      angkatan,
      email,
      password,
      divisionId: userDivision.id,
    });

    res.status(201).json({
      status: "Success",
      message: "Successfully create user",
      user: {
        fullName: currentUser.fullName,
        division: currentUser.division,
      },
    });
  } catch (error) {
    console.log(error.message);
  }
};

const deleteUser = (req, res, next) => {
  try {
    const { userId } = req.params;

    //mencari index user dari array model user
    const targetedIndex = User.findIndex((element) => {
      return element.id == userId;
    });

    //user tidak ketemu
    if (targetedIndex === -1) {
      res.status(400).json({
        status: "Error",
        message: `User with id ${userId} is not existed`,
      });
    }

    //hapus array pada [targetedIndex] sebanyak 1 buah element
    User.splice(targetedIndex, 1);

    res.status(200).json({
      status: "Success",
      message: "Successfully delete user",
    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  getAllUser,
  getUserById,
  postUser,
  deleteUser,
};
