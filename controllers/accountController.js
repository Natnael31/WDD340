const accountModel = require("../models/account-model")
const revModel = require("../models/review-model")
const invModel = require("../models/inventory-model")
const utilities = require("../utilities");
const jwt = require("jsonwebtoken")
const bcrypt = require('bcryptjs');
require("dotenv").config()



/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    req.flash("notice", "This is a flash message.")
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    req.flash("notice", "This is a flash message.")
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null
    })
}


/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    // Hash the password before storing
    let hashedPassword
    try {
        // regular password converted to a bcrypted hashed code
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword // store the hashed password in the database rather than the plain text
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,

        })
    }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    // console.log(accountData)
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again!")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        })
        return
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password;

            // Store account info in the session
            req.session.loggedin = true;
            req.session.user = accountData;

            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: 3600 * 1000,
            });

            const cookieOptions = {
                httpOnly: true,
                maxAge: 3600 * 1000,
                ...(process.env.NODE_ENV !== 'development' && { secure: true }),
            };
            res.cookie("jwt", accessToken, cookieOptions); //jwt is the name of the cookie

            return res.redirect("/account/");
        }
        else {
            req.flash("message notice", "Please check your credentials and try again.")
            res.status(400).render("account/login", {
                title: "Login",
                nav,
                errors: null,
                account_email,
            })
        }
    } catch (error) {
        throw new Error('Access Forbidden')
    }
}

async function buildAccountManagement(req, res, next) {
    let nav = await utilities.getNav()
    req.flash("notice", "This is a flash message.")
    const accountData = res.locals.accountData
    // console.log(accountData)
    const userReviews = await revModel.getReviewsByAccountId(accountData.account_id)
    const adminReviews = await revModel.getAllReviews();
    console.log(adminReviews.rows);
    var inventory_idArray = []
    // console.log(userReviews.rows)
    if (accountData.account_type === "Admin") {
        inventory_idArray = adminReviews.rows.map((review) => review.inv_id);
    } else {
        inventory_idArray = userReviews.rows.map((review) => review.inv_id);
    }
    const account_idArray = adminReviews.rows.map((review) => review.account_id);
    // console.log(account_idArray)

    // console.log(inventory_idArray)
    let inventories = [];
    for (let i = 0; i < inventory_idArray.length; i++) {
        let inv = await invModel.getInventoryDetail(inventory_idArray[i])
        inventories.push(inv);
    }
    console.log(inventories)
    let accounts = [];
    for (let i = 0; i < account_idArray.length; i++) {
        let acc = await accountModel.getAccountById(account_idArray[i])
        accounts.push(acc);
    }
    console.log(accounts)

    if (userReviews) {
        res.render("account/accountManagement", {
            title: "Account Management",
            accountData,
            nav,
            userReviews: userReviews.rows,
            adminReviews: adminReviews.rows,
            inventories,
            accounts,
            errors: null
        })
    } else {
        res.render("account/accountManagement", {
            title: "Account Management",
            accountData,
            nav,
            errors: null
        })
    }
}

async function UpdateAccountView(req, res) {
    const nav = await utilities.getNav()
    req.flash("notice", "This is a flash message.")
    const account_id = req.params.account_id
    const accountData = await accountModel.getAccountById(account_id)

    res.render("account/updateAccount", {
        title: "Edit Account",
        nav,
        user: accountData,
        errors: null
    })
}

async function updateAccount(req, res) {
    const nav = await utilities.getNav()
    const { account_id, account_firstname, account_lastname, account_email } = req.body
    const errors = []

    if (errors.length > 0) {
        return res.render("account/updateAccount", {
            title: "Update Account",
            nav,
            errors,
            user: req.body,
        })
    }

    const updateResult = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email)
    if (updateResult) {
        req.flash("notice", "Account updated successfully.")
        res.redirect("/account/")
    } else {
        req.flash("notice", "Update failed. Try again.")
        res.redirect(`/account/update/${account_id}`)
    }
}

async function changePassword(req, res) {
    const nav = await utilities.getNav()
    const { account_id, account_password } = req.body
    const errors = []

    if (errors.length > 0) {
        return res.render("account/updateAccount", {
            title: "Update Account",
            nav,
            errors,
            user: req.body,
        })
    }
    let hashedPassword
    hashedPassword = await bcrypt.hashSync(account_password, 10)
    const updateResult = await accountModel.updatePassword(account_id, hashedPassword)
    if (updateResult) {
        req.flash("notice", "Password changed successfully.")
        res.redirect("/account/")
    } else {
        req.flash("notice", "Update failed. Try again.")
        res.redirect(`/account/update/${account_id}`)
    }
}


function logout(req, res) {
    req.session.destroy((err) => {
        if (err) {
            console.log("Logout error:", err)
            return res.redirect("/account/")
        }
        res.clearCookie("jwt")
        res.redirect("/")
    })
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement, UpdateAccountView, updateAccount, changePassword, logout }