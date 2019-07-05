const express = require("express");
const connectDB = require("./config/db");
//app variable
const app = express();

//connect db
connectDB();

//Initilize the middleware, allows me to get data in a req.body call
//useful for a postman posting cause you can send raw json and get the data in the req call
app.use(express.json({ extended: false }));

//endpoint, sends data to the browser which is the ' ' message
app.get("/", (req, res) => res.send("API Running"));

//defines routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

//port variable, looks for env var called port
const PORT = process.env.PORT || 5000;

//pass in port, does callback, and when it callbacks, it logs the ` ` message
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
