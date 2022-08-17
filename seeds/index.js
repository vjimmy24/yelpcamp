const mongoose = require('mongoose');
const { Campground } = require('../models/campground');
mongoose.connect('mongodb://localhost:27017/yelp-camp');
const cities = require('./cities.js');
const { descriptors, places } = require('./seedHelpers.js');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'There was an error connecting to the database.'))
db.once('open', () => {
    console.log('Successfully Connected to Database!')
})

const Sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async function () {
    await Campground.deleteMany({})
    // await Campground.create({ cities })
    for (let i = 0; i < 51; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 50) + 5;
        const newCamp = new Campground({
            title: `${Sample(descriptors)} ${Sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state} `,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.Magni, nihil molestias.Aliquid, iste! Similique ut molestiae vero minus assumenda at cupiditate itaque mollitia debitis corrupti, numquam non officiis id totam.',
            price: price,
            author: '62f66f1a513cdc77644339e5',
            images: [
                {
                    url: 'https://res.cloudinary.com/digfn29ss/image/upload/v1660589364/YelpCamp/m8wb0o4ah83odqm2ws4d.webp',
                    fileName: 'YelpCamp/m8wb0o4ah83odqm2ws4d',
                },
                {
                    url: 'https://res.cloudinary.com/digfn29ss/image/upload/v1660589364/YelpCamp/myfmpjo5dxu2pl6xdj3n.jpg',
                    fileName: 'YelpCamp/myfmpjo5dxu2pl6xdj3n',
                },
                {
                    url: 'https://res.cloudinary.com/digfn29ss/image/upload/v1660589365/YelpCamp/qeeqe1lfthdwfaynrt9g.jpg',
                    fileName: 'YelpCamp/qeeqe1lfthdwfaynrt9g',
                }
            ],

        })
        await newCamp.save()
        console.log('Successfully re-seeded the database.')
        // const c = new Campground({ title: 'yeehaw land' }) 
        // await c.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close()
})