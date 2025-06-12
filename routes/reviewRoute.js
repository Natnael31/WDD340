const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const utilities = require('../utilities');

router.post('/add', utilities.checkLogin, reviewController.addReview);
router.get('/edit/:id', utilities.checkLogin, reviewController.editReviewView);
router.post('/update', utilities.checkLogin, reviewController.updateReview);
router.post('/delete/:id', utilities.checkLogin, reviewController.deleteReview);

module.exports = router;