const revModel = require('../models/review-model');
const utilities = require('../utilities/');

const revCont = {};

revCont.addReview = async (req, res) => {
    req.flash("notice", "This is a flash message.")
    const { review_text, inv_id, account_id } = req.body;
    if (!review_text || !inv_id || !account_id) {
        req.flash('error', 'All fields are required.');
        return res.redirect(`/inv/detail/${inv_id}`);
    }

    try {
        await revModel.addReview(review_text, inv_id, account_id);
        req.flash('success', 'Review submitted successfully.');
        res.redirect(`/inv/detail/${inv_id}`);
    } catch (err) {
        console.error('Error adding review:', err);
        req.flash('error', 'There was a problem adding your review.');
        res.redirect(`/inv/detail/${inv_id}`);
    }
};

revCont.editReviewView = async (req, res) => {
    let nav = await utilities.getNav();
    req.flash("notice", "This is a flash message.")
    const review_id = req.params.id;
    const reviewData = await revModel.getReviewById(review_id);
    res.render('review/edit-review', {
        review: reviewData.rows[0],
        title: 'Edit Review',
        nav
    });
};

revCont.updateReview = async (req, res) => {
    const { review_text, review_id } = req.body;
    try {
        await revModel.updateReview(review_id, review_text);
        req.flash('success', 'Review updated successfully.');
        res.redirect('/account');
    } catch (err) {
        req.flash('error', 'Error updating review.');
        res.redirect('/account');
    }
};

revCont.deleteReviewView = async (req, res) => {
    let nav = await utilities.getNav();
    req.flash("notice", "This is a flash message.")
    const review_id = req.params.id;
    const reviewData = await revModel.getReviewById(review_id);
    res.render('review/edit-review', {
        review: reviewData.rows[0],
        title: 'Edit Review',
        nav
    });
};

revCont.deleteReview = async (req, res) => {
    const review_id = req.params.id;
    try {
        await revModel.deleteReview(review_id);
        req.flash('success', 'Review deleted successfully.');
        res.redirect('/account');
    } catch (err) {
        req.flash('error', 'Error deleting review.');
        res.redirect('/account');
    }
};

module.exports = revCont;