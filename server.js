/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require('express-ejs-layouts');
const env = require("dotenv").config();
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")
const static = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require("./routes/accountRoute");
const baseController = require('./controllers/baseController');
const utilities = require("./utilities");
const invController = require("./controllers/invController");
const session = require("express-session");
const pool = require('./database/');


/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))


app.use((req, res, next) => {
  res.locals.loggedin = req.session.loggedin || false;
  res.locals.user = req.session.user || null;
  next();
});

app.use(bodyParser.json()) //(to parse incoming JSON data in the request body using req.body)
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded(for Web forms data)
app.use(cookieParser())
app.use(utilities.checkJWTToken) // check jwt token in the whole application



// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res)
  next()
})


/* ***********************
 * View Engine and Templates
 *************************/

app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static)
app.use("/inv", inventoryRoute);
app.use("/account", accountRoute);
// app.use("/account", require("./routes/accountRoute"));

// Index route
app.get("/", utilities.handleErrors(baseController.buildHome))
app.get("/cause-error", utilities.handleErrors(invController.createDeliberateError));

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({ status: 404, message: 'Sorry, we appear to have lost that page.' })
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if (err.status == 404) { message = err.message } else { message = 'Oh no! There was a crash. Maybe try a different route?' }
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
