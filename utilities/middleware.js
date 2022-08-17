const { Campground } = require("../models/campground")
const expressError = require('./expressError.js')
const { campgroundSchema, reviewSchema } = require('../schemas.js')
const { resolveInclude } = require("ejs")
const { Review } = require('../models/review')

module.exports.isLoggedin = function (req, res, next) {
    console.log(req.user)
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'Sorry, you have to be signed in to do this!')
        return res.redirect('/login')
    } else {
        next();
    }

}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp.author[0].equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that.')
        res.redirect(`/campgrounds/${id}`)
    } else {
        next();
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const camp = await Campground.findById(id);
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that.')
        res.redirect(`/campgrounds/${id}`)
    } else {
        next()
    }

}

module.exports.catchAsync = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);

    }
}

module.exports.validateCamp = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new expressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new expressError(msg, 400)
    } else {
        next();
    }
}