const utilities = require("./index")
const invModel = require('../models/inventory-model')
const revModel = require("../models/review-model")
const { body, validationResult } = require("express-validator")
const validate = {}

validate.reviewRules = () => {
    return [
        body("review_text")
            .notEmpty()
            .withMessage("Please provide a review text!")
            .isLength({ min: 10 })
            .withMessage("Review text must be at least 10 characters"),
    ]
}

validate.checkAddReview = async (req, res, next) => {
    const { inv_id, review_text } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const data = await invModel.getInventoryDetail(inv_id);
        const reviews = await revModel.getReviewsByInvId(inv_id);
        const details = await utilities.buildDetail(data)
        const account = res.locals.accountData;
        const screenName = account.account_firstname[0] + account.account_lastname;
        res.render("inventory/inventoryDetail", {
            title: `${data.inv_make} ${data.inv_model}`,
            nav,
            data,
            account_id: account.account_id,
            review_text,
            details,
            screenName,
            reviews: reviews.rows,
            errors,
        })
        return
    }
    next()
}

validate.checkEditReview = async (req, res, next) => {
    const { inv_id, review_text, review_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const reviewData = await revModel.getReviewById(review_id);
        const inventory_id = reviewData.rows[0].inv_id
        const inventory = await invModel.getInventoryDetail(inventory_id)
        res.render('./review/editReview', {
            review: reviewData.rows[0],
            title: 'Edit Review',
            nav,
            inventory,
            review_text,
            errors
        })
        return
    }
    next()
}

module.exports = validate