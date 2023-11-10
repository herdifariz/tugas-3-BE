require("dotenv").config();

//ambil module express
const express = require("express");
const app = express();

//ambil router yang mengandle endpoint user
const userRouter = require("./routes/user");
const association = require("./util/assoc_db");

//untuk ngambil request body
app.use(express.json());

//jalanin router
app.use(userRouter);

// error handling
app.use((req, res, next) => {
  res.status(404).json({
    status: "Error",
    message: `URL not found!`,
  });
});

//ambil data dari dotenv
const PORT = process.env.PORT;

association()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is listening on PORT ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
  });
