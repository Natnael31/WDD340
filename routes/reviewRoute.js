const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const utilities = require('../utilities');
const reviewValidate = require('../utilities/review-validation')

router.post('/add', utilities.checkLogin, reviewValidate.reviewRules(), reviewValidate.checkAddReview, utilities.handleErrors(reviewController.addReview));
router.get('/edit/:id', utilities.checkLogin, utilities.handleErrors(reviewController.editReviewView));
router.post('/update/', utilities.checkLogin, reviewValidate.reviewRules(), reviewValidate.checkEditReview, utilities.handleErrors(reviewController.updateReview));
router.get('/delete/:id', utilities.checkLogin, utilities.handleErrors(reviewController.deleteReviewView));
router.post('/delete/', utilities.checkLogin, utilities.handleErrors(reviewController.deleteReview));

module.exports = router;