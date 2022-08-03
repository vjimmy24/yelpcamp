const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

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
    image: {
        type: String
    },
    reviews: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Review' }]
    }
})

campgroundSchema.post('findOneAndDelete', async function (res) {
    if (res) {
        await Review.remove({
            _id: {
                $in: res.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', campgroundSchema);