const express = require("express");
const router = express.Router();
const { verifyRegister } = require("../middleware");
const controller = require("../controllers/authController");

module.exports = function(app) {
    app.post(
        "/api/auth/register",
        [
        verifyRegister.checkDuplicate,
        verifyRegister.checkRoles
        ],
        controller.register
    );
}