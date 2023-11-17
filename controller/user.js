require("dotenv").config();
const Division = require("../model/Division");
const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const key = process.env.TOKEN_SECRET_KEY;

const getAllUser = async (req, res, next) => {
  try {
    // select *
    // const users = await User.findAll();
    // select sebagian
    const users = await User.findAll({
      attributes: [
        "id",
        "fullName",
        "nim",
        "angkatan",
        "profilePicture",
        "divisionId",
      ],
      // inner join dengan division
      include: {
        model: Division,
        attributes: ["name"],
      },
    });

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

// handler register
const postUser = async (req, res, next) => {
  try {
    const { fullName, nim, angkatan, email, password, division } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);

    // cari divisi id
    const userDivision = await Division.findOne({
      where: {
        name: division,
      },
    });

    // SELECT * FROM divisions WHERE name = division
    // if (!userDivision) {
    if (userDivision == undefined) {
      // req.status(400).json({
      //   status: "Error",
      //   message: `${division} not exist`,
      // });
      const error = new Error(`Division ${division} is not existed`);
      error.statusCode = 400;
      throw error;
    }

    const currentUser = await User.create({
      // field: data
      // jika nama field dan data sama, bisa diringkas
      fullName,
      nim,
      angkatan,
      email,
      password: hashPassword,
      divisionId: userDivision.id,
      role: "MEMBER",
    });

    const token = jwt.sign(
      {
        userId: currentUser.id,
        role: currentUser.role,
      },
      key,
      {
        algorithm: "HS256",
        expiresIn: "1m",
      }
    );

    res.status(201).json({
      status: "Success",
      message: "Successfully create user",
      user: {
        fullName: currentUser.fullName,
        division: currentUser.divisionId,
      },
      token,
    });
  } catch (error) {
    // console.log(error.message);
    // jika statusCode belum terdefined akan menghasilkan 500
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
};

const loginHandler = async (req, res, next) => {
  try {
    // ambil data dari request body
    const { email, password } = req.body;

    const currentUser = await User.findOne({
      where: {
        // nama kolom: data req.body
        email: email,
      },
    });

    // jika currentUser tidak ketemu atau password salah
    if (currentUser == undefined) {
      const error = new Error("Wrong email or password");
      error.statusCode = 400;
      throw error;
    }

    const checkPassword = await bcrypt.compare(password, currentUser.password);
    if (checkPassword === false) {
      const error = new Error("Wrong email or password");
      error.statusCode = 400;
      throw error;
    }

    const token = jwt.sign(
      {
        userId: currentUser.id,
        role: currentUser.role,
      },
      key,
      {
        algorithm: "HS256",
        expiresIn: "1m",
      }
    );

    res.status(200).json({
      status: "Success",
      message: "Login success!",
      token,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
};

const deleteUser = async (req, res, next) => {
  // hanya admin yang bisa delete
  try {
    // mengambil token
    // ambil header
    const header = req.headers;
    // ambil header auth
    const authorization = header.authorization;
    // console.log(authorization); // bearer token
    let token;

    if (authorization !== undefined && authorization.startsWith("Bearer ")) {
      // menghilangkan string "Bearer "
      token = authorization.substring(7);
    } else {
      const error = new Error("You need to login");
      error.statusCode(403);
      throw error;
    }

    const decoded = jwt.verify(token, key);
    if (decoded.role !== "ADMIN") {
      const error = new Error("You don't have access");
      error.statusCode(403);
      throw error;
    }

    if (targettedUser === undefined) {
      const error = new Error(`User with ${id} not found`);
      error.statusCode(403);
      throw error;
    }

    // menjalankan operasi delete
    const { userId } = req.params;

    const targettedUser = await User.destroy({
      where: {
        id: userId,
      },
    });

    res.status(200).json({
      status: "Success",
      message: "Successfully delete user",
    });
  } catch (error) {
    console.log(error.message);
  }
};

const getUserByToken = async (req, res, next) => {
  //hanya user yang telah login bisa mengambil data dirinya dengan mengirimkan token
  try {
    //step 1 ambil token
    const header = req.headers;
    const authorization = header.authorization;
    let token;

    if (authorization !== undefined && authorization.startsWith("Bearer ")) {
      token = authorization.substring(7);
      console.log(token);
    } else {
      const error = new Error("You need to login");
      error.statusCode(403);
      throw error;
    }

    //step 2 ekstrak payload menggunakan jwt.verify
    const decoded = jwt.verify(token, key);
    const userId = decoded.userId;
    console.log(userId);

    //step 3 cari user berdasarkan payload.userId
    const user = await User.findOne({
      attributes: ["id", "fullName", "angkatan"],
      // inner join dengan division
      include: {
        model: Division,
        attributes: ["name"],
      },
      where: {
        id: userId,
      },
    });
    console.log(user);

    if (user === undefined) {
      res.status(400).json({
        status: "Error",
        message: `User with id ${userId} is not existed!`,
      });
    }

    res.status(200).json({
      status: "Success",
      message: `Succesfully fetch user data with id ${userId}`,
      user,
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
  loginHandler,
  getUserByToken,
};
