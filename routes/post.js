const express = require("express");
const router = express.Router();
const controllers = require("../controllers/post");
const passport = require("passport");

const auth = passport.authenticate("jwt", { session: false });

router.post("/", auth, controllers.create);

module.exports = router;