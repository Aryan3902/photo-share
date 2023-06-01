const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const places = require("./routes/places-routes");
const users = require("./routes/users-routes");

const app = express();

app.use(bodyParser.json());

app.use((req,res,next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
  next();
})

app.use("/api/places", places);
app.use("/api/users", users);

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "Something went wrong :(" });
});

mongoose
    .connect("mongodb+srv://Aryan:36jVUW8XUbx4WBBy@cluster0.9xb6qob.mongodb.net/places?retryWrites=true&w=majority")
    .then(() => {
      console.log("Connected to Database")
        app.listen(5000);
    })
    .catch(err => { 
      console.log("Error in connecting to database")
        console.log(err)
    });