const express = require('express');
const router = express.Router();
const { Campground } = require('../models/campground.js')
const { isLoggedin, isAuthor, validateCamp, catchAsync } = require('../utilities/middleware')
const { index, createCampground, getCampgroundDetails, getCampgroundEditForm, editCampground, deleteCampground } = require('../controllers/campgrounds')
const multer = require('multer');
const { storage } = require('../cloudinary')
const upload = multer({ storage });

//CAMPGROUNDS INDEX
router.get('/new', isLoggedin, (req, res) => {
    res.render('campgrounds/new.ejs')
})
router.route('/')
    .get(catchAsync(index))
    .post(isLoggedin, upload.array('image'), validateCamp, catchAsync(createCampground))


router.route('/:id')
    .get(catchAsync(getCampgroundDetails))
    .put(isLoggedin, isAuthor, upload.array('image'), validateCamp, catchAsync(editCampground))
    .delete(isLoggedin, catchAsync(deleteCampground))


router.get('/:id/edit', getCampgroundEditForm)



module.exports = router;