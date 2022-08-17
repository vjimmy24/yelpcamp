const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, catchAsync, isLoggedin, isReviewAuthor } = require('../utilities/middleware.js')
const { Campground } = require('../models/campground.js')
const { Review } = require('../models/review');
const { createReview, deleteReview } = require('../controllers/reviews.js');


//REVIEWS
router.post('/', validateReview, isLoggedin, catchAsync(createReview))

router.delete('/:reviewId', isLoggedin, isReviewAuthor, catchAsync(deleteReview))

module.exports = router;