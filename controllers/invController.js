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
    const classificationSelect = await utilities.buildClassificationList()
    res.render("./inventory/vehicleManagement", {
        title: "Vehicle Management",
        nav,
        errors: null,
        classificationSelect
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
        return res.json(invData)
    } else {
        next(new Error("No data returned"))
    }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.updateInventoryView = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id)
    console.log(inv_id)
    let nav = await utilities.getNav()
    req.flash("notice", "This is a flash message.")
    const itemData = await invModel.getInventoryDetail(inv_id)
    const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("./inventory/updateInventory", {
        title: "Edit " + itemName,
        nav,
        classificationList: classificationSelect,
        errors: null,
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_description: itemData.inv_description,
        inv_image: itemData.inv_image,
        inv_thumbnail: itemData.inv_thumbnail,
        inv_price: itemData.inv_price,
        inv_miles: itemData.inv_miles,
        inv_color: itemData.inv_color,
        classification_id: itemData.classification_id
    })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const {
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id,
    } = req.body
    const updateResult = await invModel.updateInventory(
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id
    )

    if (updateResult) {
        const itemName = updateResult.inv_make + " " + updateResult.inv_model
        req.flash("notice", `The ${itemName} was successfully updated.`)
        res.redirect("/inv/")
    } else {
        const classificationSelect = await utilities.buildClassificationList(classification_id)
        const itemName = `${inv_make} ${inv_model}`
        req.flash("notice", "Sorry, the insert failed.")
        res.status(501).render("inventory/updateInventory", {
            title: "Edit " + itemName,
            nav,
            classificationSelect: classificationSelect,
            errors: null,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        })
    }
}

module.exports = invCont