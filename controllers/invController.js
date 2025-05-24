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

module.exports = invCont