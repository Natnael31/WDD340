const express = require("express");
const router = new express.Router();
const utilities = require('../utilities');
const accountController = require("../controllers/accountController");

router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// route to send data to the database
router.post('/register', utilities.handleErrors(accountController.registerAccount))

module.exports = router;
