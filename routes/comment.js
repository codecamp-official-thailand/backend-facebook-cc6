const express = require("express");
const router = express.Router();
const controllers = require("../controllers/comment");
const passport = require("passport");
const auth = passport.authenticate("jwt", { session: false });

router.post('/:post_id', auth, controllers.create);
router.delete('/:comment_id', auth, controllers.create);

module.exports = router;