const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

invCont.buildInventoryDetail = async function (req, res, next) {
    const inventory_id = req.params.inventoryId;
    // console.log(inventory_id)
    const data = await invModel.getInventoryDetail(inventory_id);
    let nav = await utilities.getNav()
    // console.log(data)
    const details = await utilities.buildDetail(data)
    res.render("inventory/inventoryDetail", {
        title: `${data.inv_make} ${data.inv_model}`,
        nav,
        details
    });
}

invCont.createDeliberateError = async function (req, res, next) {

    return item;
}

invCont.buildVehicleManagement = async function (req, res, next) {
    let nav = await utilities.getNav()
    req.flash("notice", "This is a flash message.")
    res.render("./inventory/vehicleManagement", {
        title: "Vehicle Management",
        nav,
    })
}

invCont.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav()
    req.flash("notice", "This is a flash message.")
    res.render("./inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null
    })
}

invCont.addClassification = async function (req, res, next) {

    const { classification_name } = req.body

    const addClassification = await invModel.addClassification(
        classification_name
    )

    if (addClassification) {
        let nav = await utilities.getNav()
        req.flash(
            "notice",
            `Congratulations, you have successfully added a new vehicle classification.`
        )
        res.status(201).render("./inventory/vehicleManagement", {
            title: "Vehicle Management",
            nav,
        })
    } else {
        let nav = await utilities.getNav()
        req.flash("notice", "Sorry, operation failed.")
        res.status(501).render("./inventory/add-classification", {
            title: "Add Classification",
            nav,
        })
    }
}

invCont.buildAddInventory = async function (req, res, next) {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList();
    req.flash("notice", "This is a flash message.")
    res.render("./inventory/add-inventory", {
        title: "Add Vehicle",
        nav,
        classificationList,
        errors: null
    })
}

invCont.addInventory = async function (req, res, next) {

    const item = req.body;

    const classificationList = await utilities.buildClassificationList(item.classification_id)
    const addInventory = await invModel.addInventory(item)
    if (addInventory) {
        let nav = await utilities.getNav()
        req.flash(
            "notice",
            `Congratulations, you have successfully added a new vehicle.`
        )
        res.status(201).render("./inventory/vehicleManagement", {
            title: "Vehicle Management",
            nav,
        })
    } else {
        let nav = await utilities.getNav()
        req.flash("notice", "Sorry, operation failed.")
        res.status(501).render("./inventory/add-inventory", {
            title: "Add Vehicle",
            nav,
            classificationList,
            errors,
            ...item,
        })
    }
}

module.exports = invCont