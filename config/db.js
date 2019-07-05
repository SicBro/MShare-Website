const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

const connectDB = async () => {
  try {
    //wait for mongoose to connect
    await mongoose.connect(db, {
      useNewUrlParser: true,
      //prevents deprication error in mongoose
      useCreateIndex: true,
      //prevents dep error with findOneAndUpdate
      useFindAndModify: false
    });
    //says that it is connected
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    //exit the process with a failure
    process.exit(1);
  }
};

module.exports = connectDB;
