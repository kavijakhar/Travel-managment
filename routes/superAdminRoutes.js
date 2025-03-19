const express = require("express");
const { superAdminLogin } = require("../controllers/superAdminController");

const router = express.Router();

// Change route from "/login" to "/superadminlogin"
router.post("/login", superAdminLogin);

module.exports = router;
