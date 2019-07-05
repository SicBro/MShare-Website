const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator/check");

//@route   GET api/auth
//@desc   Test route
//@access  Public

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route   POST api/auth
//@desc    Authenticate user & get token
//@access  Public

router.post(
  "/",
  [
    //checks for email field
    check("email", "Please include a valid email").isEmail(),
    //checks for password field
    check("password", "Password is required").exists()
  ],
  async (req, res) => {
    //checks to see if the .post has returned errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //'destructures' the req.body data
    const { email, password } = req.body;

    try {
      //See if the user doesn't exist, send error if so
      let user = await User.findOne({ email });
      if (!user) {
        //return is needed for every res status that isnt the last one
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      //create bool var based on bcrypt compare
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      //payload
      const payload = {
        user: {
          id: user.id
        }
      };
      //signs the jwt and give it the payload, along with an expiration option in seconds
      //includes a callback with err check and token
      //long expiration for the purpose of testing
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 400000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
