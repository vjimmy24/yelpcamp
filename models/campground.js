const mongoose = require('mongoose');
const { Review } = require('./review')
const Schema = mongoose.Schema;

//https://res.cloudinary.com/digfn29ss/image/upload/v1660699227/YelpCamp/cdbaqydi7cxecdlovgal.jpg
const imageSchema = new Schema({
    url: String,
    fileName: String
})

imageSchema.virtual('thumbnail').get(function () {
    //this refers to the particular image.
    return this.url.replace('/upload', '/upload/w_200');
})

const campgroundSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String
    },
    images: [imageSchema]
    ,
    reviews: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Review' }]
    },
    author: {
        type: [{ type: Schema.Types.ObjectId, ref: 'User' }]
    }
})

campgroundSchema.post('findOneAndDelete', async function (res) {
    if (res) {
        await Review.deleteMany({
            _id: {
                $in: res.reviews
            }
        })
    }
})

module.exports.Campground = mongoose.model('Campground', campgroundSchema);
