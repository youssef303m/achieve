/* 
  Make login/register return a JWT instead of the user
  TODO: Protect(JWT) all routes by roles (except login and register)
  TODO: Make default avatar images for user to choose from
*/

const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");

const app = express();

const PORT = process.env.PORT;
const DB_URI = process.env.DB_URI;

// JSON Parser
app.use(express.json());
// Users Router
app.use("/api/users", userRoutes);

const main = async () => {
  try {
    await mongoose.connect(DB_URI).then(() => {
      console.log("Database connected successfully");
      app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
      });
    });
  } catch (err) {
    console.error("Could not connect to database", err);
  }
};
main();
