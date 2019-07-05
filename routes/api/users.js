const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator/check");

const User = require("../../models/User");
//@route   GET api/users for testing, POST for real world use
//@desc   Register user
//@access  Public

router.post(
  "/",
  [
    //checks for the name field
    check("name", "Name is required")
      .not()
      .isEmpty(),
    //checks for email field
    check("email", "Please include a valid email").isEmail(),
    //checks for password field
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    //checks to see if the .post has returned errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //'destructures' the req.body data
    const { name, email, password } = req.body;

    try {
      //See if the user exist, send error if so
      let user = await User.findOne({ email });
      if (user) {
        //return is needed for every res status that isnt the last one
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }
      //Get the user gravatar
      const avatar = gravatar.url(email, {
        //size
        s: "200",
        //grav img rating
        r: "pg",
        //default
        d: "mm"
      });
      //new user instance
      user = new User({
        name,
        email,
        avatar,
        password
      });
      //Encrypt password with bcrypt
      //create salt for hashing, higher num is better but slower
      const salt = await bcrypt.genSalt(10);
      //hash the pass, saves to db
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      //payload
      const payload = {
        user: {
          id: user.id
        }
      };
      //signs the jwt and give it the payload, along with an expiration option in seconds
      //includes a callback with err check and token
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
