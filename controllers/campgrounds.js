const { Campground } = require('../models/campground')
const { cloudinary } = require('../cloudinary/index')

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs', { campgrounds })
}

module.exports.createCampground = async (req, res, next) => {
    // if (!req.body) throw new expressError('Invalid Campground Data', 400);
    const camp = new Campground(req.body.camp);
    camp.images = req.files.map(f => ({ url: f.path, fileName: f.filename }));
    camp.author = req.user._id;
    await camp.save()
    console.log(camp)
    req.flash('success', 'Nice - made a new campground!')
    res.redirect(`/campgrounds/${camp._id}`)
}

module.exports.getCampgroundDetails = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate('reviews').populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(camp)
    if (!camp) {
        req.flash('error', `Sorry, we couldn't find that campground.`)
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/details.ejs', { id, camp });
}

module.exports.getCampgroundEditForm = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp) {
        req.flash('error', `Sorry, we couldn't find that campground.`)
    }
    res.render(`campgrounds/edit`, { camp, id })
}

module.exports.editCampground = async (req, res) => {
    const { id } = req.params;
    console.log(req.body)
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.camp });
    const img = req.files.map(f => ({ url: f.path, fileName: f.filename }));
    camp.images.push(...img);
    if (req.body.deleteImages) {
        for (let fileName of req.body.deleteImages) {
            await cloudinary.uploader.destroy(fileName);
        }
        await camp.updateOne({ $pull: { images: { fileName: { $in: req.body.deleteImages } } } })
        console.log(camp)
    }

    await camp.save();
    req.flash('success', 'Successfully edited campground!')
    res.redirect(`/campgrounds/${camp._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!')
    res.redirect('/campgrounds')
}