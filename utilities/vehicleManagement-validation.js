const utilities = require("./index")
const invModel = require("../models/inventory-model")
const { body, validationResult } = require("express-validator")
const validate = {}

validate.addClassificationRules = () => {
    return [
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .matches(/^[A-Za-z]+$/)
            .withMessage("Please provide a classification_name according to the required format."), // on error this message is sent.
    ]
}

validate.addInventoryRules = () => {
    return [
        body("classification_id")
            .notEmpty()
            .isInt().withMessage("Classification must be a number.")
            .withMessage("Please choose a valid classification."),
        body("inv_make")
            .trim()
            .escape()
            .notEmpty().withMessage("Make is required.")
            .isLength({ min: 3 }).withMessage("Make must be at least 3 characters."),
        body("inv_model")
            .trim()
            .escape()
            .notEmpty().withMessage("Model is required")
            .isLength({ min: 3 }).withMessage("Model must be at least 3 characters."),
        body("inv_description")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Description is required."),
        body("inv_image")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Image path is required."),
        body("inv_thumbnail")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Thumbnail path is required."),
        body("inv_price")
            .isFloat({ gt: 0 })
            .escape()
            .notEmpty()
            .withMessage("Valid price is required."),
        body("inv_year")
            .isInt({ min: 1886 })
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 4, max: 4 })
            .withMessage("Valid year is required."),
        body("inv_miles")
            .isInt({ min: 0 })
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Valid mileage is required."),
        body("inv_color")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Color is required."),
    ]

}


validate.checkAddClasification = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            classification_name,
            ...req.body
        })
        return
    }
    next()
}

validate.checkAddInventory = async (req, res, next) => {
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        utilities.buildClassificationList(req.body.classification_id).then(classificationList => {
            res.render("inventory/add-inventory", {
                title: "Add Vehicle",
                nav,
                classificationList,
                errors,
                ...req.body,
            });
        });
    } else {
        next();
    }
}

validate.checkUpdateInventory = async (req, res, next) => {
    const item = req.body;
    const inv_id = parseInt(item.inv_id);
    console.log(inv_id)
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        req.flash("notice", "This is a flash message.")
        const itemData = await invModel.getInventoryDetail(inv_id)
        const itemName = `${itemData.inv_make} ${itemData.inv_model}`
        utilities.buildClassificationList(req.body.classification_id).then(classificationList => {
            res.render("./inventory/updateInventory", {
                title: "Edit " + itemName,
                nav,
                classificationList,
                errors,
                ...req.body,
            });
        });
    } else {
        next();
    }
}




module.exports = validate
