const express = require("express");
const router = new express.Router();
const utilities = require('../utilities');
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");

router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/register", utilities.handleErrors(accountController.buildRegister));
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement));
router.get("/logout", utilities.handleErrors(accountController.logout));
router.get("/update/:account_id", utilities.checkLogin, utilities.handleErrors(accountController.UpdateAccountView))

// route to send data to the database
router.post('/register', regValidate.registationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount))
router.post('/login', regValidate.loginRules(), regValidate.checkLoginData, utilities.handleErrors(accountController.accountLogin))
router.post("/update", regValidate.updateAccountRules(), regValidate.checkAccountUpdateData, utilities.checkLogin, utilities.handleErrors(accountController.updateAccount))
router.post("/changePassword", regValidate.changePasswordRules(), regValidate.checkChangePassword, utilities.handleErrors(accountController.changePassword))

module.exports = router;
