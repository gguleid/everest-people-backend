//////////////////////////////
// DEPENDENCIES
//////////////////////////////
// get .env variables
require("dotenv").config();
// pull PORT from .env, give default value of 5000
const { PORT = 5000, MONGODB_URL } = process.env;
// import express
const express = require("express");
// create application object
const app = express();
// import mongoose
const mongoose = require("mongoose")
// import cors and morgan
const cors = require('cors');
const morgan = require('morgan');
//////////////////////////////
// DATABASE CONNECTION
//////////////////////////////
// Establish Connection
mongoose.connect(MONGODB_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
// Connection Events
mongoose.connection
  .on("open", () => console.log("You're connected to mongoose"))
  .on("close", () => console.log("You're disconnected from mongoose"))
  .on("error", (error) => console.log(error));
//////////////////////////////
// MODELS
//////////////////////////////
const PeopleSchema = new mongoose.Schema({
  name: String,
  image: String,
  title: String,
});
const People = mongoose.model("People", PeopleSchema);
//////////////////////////////
// MiddleWare
//////////////////////////////
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
//////////////////////////////
// ROUTES
//////////////////////////////
// CREATE A TEST ROUTE
app.get("/", (req, res) => {
  res.send("hello SEI")
});
// PEOPLE INDEX ROUTE
app.get("/people", async (req, res) => {
  try {
    res.json(await People.find({}));
  } catch (error) {
    res.status(400).json(error);
  }
});

// PEOPLE DELETE ROUTE
app.delete('/people/:id', async(req, res) => {
    try {
        res.json(await People.findByIdAndRemove(req.params.id));
    } catch (error) {
        res.status(400).json(error);
    }
})
// PEOPLE UPDATE ROUTE
app.put('/people/:id', async (req, res) => {
    try {
        res.json(await People.findByIdAndUpdate(req.params.id, req.body, { new: true }));
    } catch (error) {
        res.status(400).json(error);
    }
});
// PEOPLE CREATE ROUTE
app.post("/people", async (req, res) => {
    try {
      res.json(await People.create(req.body))
    } catch (error) {
      res.status(400).json(error);
    }
  })
  
///////////////////////////////
// LISTENER
////////////////////////////////
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));