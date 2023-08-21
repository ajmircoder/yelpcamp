const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const { islogIn, isReviewAuthor, validateReview } = require('../middleware');
const reviews = require('../controllers/review');


router.post('/', islogIn, validateReview, catchAsync(reviews.makeRiview));

router.get('/:reviewId/edit', isReviewAuthor, catchAsync(reviews.reviewEditForm));

router.delete('/:reviewId/delete', isReviewAuthor, catchAsync(reviews.destroyReview));

router.put('/:reviewId', isReviewAuthor, catchAsync(reviews.editReview));




module.exports = router;


