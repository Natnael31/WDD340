const revModel = require('../models/review-model');
const invModel = require('../models/inventory-model')
const utilities = require('../utilities/');

const revCont = {};

revCont.addReview = async (req, res) => {
    req.flash("notice", "This is a flash message.")
    const { review_text, inv_id, account_id } = req.body;
    try {
        await revModel.addReview(review_text, inv_id, account_id);
        req.flash('notice', 'Review submitted successfully.');
        res.redirect(`/inv/detail/${inv_id}`);
    } catch (err) {
        console.error('Error adding review:', err);
        req.flash('notice', 'There was a problem adding your review.');
        res.redirect(`/inv/detail/${inv_id}`);
    }
};

revCont.editReviewView = async (req, res) => {
    let nav = await utilities.getNav();
    req.flash("notice", "This is a flash message.")
    const review_id = req.params.id;
    const reviewData = await revModel.getReviewById(review_id);
    // console.log(reviewData.rows)
    const inventory_id = reviewData.rows[0].inv_id
    // console.log(inv_id)
    const inventory = await invModel.getInventoryDetail(inventory_id)
    // console.log(inventory)

    res.render('./review/editReview', {
        review: reviewData.rows[0],
        title: 'Edit Review',
        nav,
        inventory,
        errors: null,
    });
};

revCont.updateReview = async (req, res) => {
    const { review_text, review_id } = req.body;
    try {
        await revModel.updateReview(review_id, review_text);
        req.flash('notice', 'Review updated successfully.');
        res.redirect('/account');
    } catch (err) {
        req.flash('notice', 'Error updating review.');
        res.redirect('/account');
    }
};

revCont.deleteReviewView = async (req, res) => {
    let nav = await utilities.getNav();
    req.flash("notice", "This is a flash message.")
    const review_id = req.params.id;
    const reviewData = await revModel.getReviewById(review_id);
    const inventory_id = reviewData.rows[0].inv_id
    const inventory = await invModel.getInventoryDetail(inventory_id)
    console.log(inventory)

    res.render('./review/deleteReview', {
        review: reviewData.rows[0],
        title: 'Delete Review',
        nav,
        inventory,
        errors: null,
    });
};

revCont.deleteReview = async (req, res) => {
    const { review_id } = req.body;
    console.log(review_id)
    try {
        await revModel.deleteReview(review_id);
        req.flash('notice', 'Review deleted successfully.');
        res.redirect('/account');
    } catch (err) {
        req.flash('notice', 'Error deleting review.');
        res.redirect('/account');
    }
};

module.exports = revCont;