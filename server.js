const express = require("express");
const connectDB = require("./config/db");
const path = require("path");
//app variable
const app = express();

//connect db
connectDB();

//Initilize the middleware, allows me to get data in a req.body call
//useful for a postman posting cause you can send raw json and get the data in the req call
app.use(express.json({ extended: false }));

//defines routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

//Serve static assets in production
if (process.env.NODE_ENV === "production") {
  //Set the static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(_dirname, "client", "build", "index.html"));
  });
}
//port variable, looks for env var called port
const PORT = process.env.PORT || 5000;

//pass in port, does callback, and when it callbacks, it logs the ` ` message
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
