const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const VehicleManagementValidate = require("../utilities/vehicleManagement-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildInventoryDetail));
router.get("/", utilities.handleErrors(invController.buildVehicleManagement));
router.get("/addClassification", utilities.handleErrors(invController.buildAddClassification))
router.post("/addClassification", VehicleManagementValidate.addClassificationRules(), VehicleManagementValidate.checkAddClasification, utilities.handleErrors(invController.addClassification))
router.get("/addInventory", utilities.handleErrors(invController.buildAddInventory))
router.post("/addInventory", VehicleManagementValidate.addInventoryRules(), VehicleManagementValidate.checkAddInventory, utilities.handleErrors(invController.addInventory))
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
router.get("/edit/:inv_id", utilities.handleErrors(invController.updateInventoryView))
router.post("/update/", VehicleManagementValidate.addInventoryRules(), VehicleManagementValidate.checkUpdateInventory, utilities.handleErrors(invController.updateInventory))
router.get("/delete/:inv_id", utilities.handleErrors(invController.deleteInventoryView))
router.post("/delete/", utilities.handleErrors(invController.deleteInventory))

module.exports = router;