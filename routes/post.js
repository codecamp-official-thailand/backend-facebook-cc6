const express = require("express");
const router = express.Router();
const controllers = require("../controllers/post");
const passport = require("passport");

const auth = passport.authenticate("jwt", { session: false });

router.post("/", auth, controllers.create);
router.get("/", auth, controllers.getMyPosts);
router.get("/feed", auth, controllers.getAllPosts);
router.delete("/:id", auth, controllers.deletePostById);
router.patch("/:id", auth, controllers.editPostById);

module.exports = router;