const { Campground } = require('../models/campground')
const { Review } = require('../models/review')

module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id)
    const review = new Review(req.body.review)
    review.author = req.user._id;
    camp.reviews.push(review);
    console.log(review)
    await review.save()
    await camp.save()
    req.flash('success', 'Successfully made a review!')
    res.redirect(`/campgrounds/${camp._id}`)
}

module.exports.deleteReview = async (req, res) => {
    const { reviewId, id } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted your review!')
    res.redirect(`/campgrounds/${id}`)
}