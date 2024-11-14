const express = require("express");
const User = require("../controllers/auth");
const UserModel = require("../models/user");
const isAuth = require("../middleware/is-auth");

const { body } = require("express-validator");

const router = express.Router();

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        return UserModel.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("E-Mail address already exists!");
          }
        });
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body("name").trim().not().isEmpty(),
  ],
  User.signup
);

router.post("/login", User.login);

router.get("/status", isAuth, User.getStatus);

router.put("/status", isAuth, User.updateStatus);

module.exports = router;
