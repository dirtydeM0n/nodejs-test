const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

// Registration Controller
router.post(
  "/register",
  [
    check("name", "Please enter your name")
      .not()
      .isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Password must be a minimum of 6 characters").isLength({
      min: 6
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;

    try {
      // Check if a user exists
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(409)
          .json({ errors: [{ msg: "User already exists" }] }); // to prevent mongo duplication errors
      }

      // Encrypting the password using bcrypt
      user = new User({
        name,
        email,
        password
      });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt); // Encrypting password before saving it in DB
      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      return res.status(200).json({
        status: "pass",
        token: jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "1d"
        }),
        id: user._id
      });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ status: "fail", mesasge: "Server Error" });
    }
  }
);

// Login controller
router.post(
  "/login",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Password is required").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
      // Check if a user exists or not
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password); // Matching encrypted passwords
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      const payload = {
        user: {
          id: user.id
        }
      };
      return res.status(200).json({
        status: "pass",
        token: jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "1d"
        }),
        id: user._id
      });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ status: "fail", message: "Server Error" });
    }
    // console.log(req.body);
  }
);

module.exports = router;
