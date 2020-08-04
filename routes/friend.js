const express = require("express");
const router = express.Router();
const controllers = require("../controllers/friend");
const passport = require("passport");

const auth = passport.authenticate("jwt", { session: false });

router.post("/requests/:id", auth, controllers.sendFriendRequest);
router.delete("/requests/:id", auth, controllers.denyFriendRequest);
router.patch("/requests/:id", auth, controllers.acceptFriendRequest);
router.delete("/:id", auth, controllers.deleteFriend);

module.exports = router;