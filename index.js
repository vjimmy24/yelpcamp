//SETUP PACKAGES
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path'); //makes sure 
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const { resolveSoa } = require('dns');

mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'There was an error connecting to the database.'))
db.once('open', () => {
    console.log('Successfully Connected to Database!')
})


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.listen(3000, () => {
    console.log('Listening on Port 3000...')
})


app.get('/', (req, res) => {
    res.render('home.ejs')
})

//CREATE NEW CAMPGROUND
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new.ejs')
})
app.post('/campgrounds', async (req, res) => {
    const newCamp = new Campground(req.body);
    await newCamp.save()
    res.redirect(`/campgrounds/${newCamp._id}`)
})

//CAMPGROUNDS INDEX
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find();
    res.render('campgrounds/index.ejs', { campgrounds })
})

//DETAILS PAGE FOR SPECIFIC CAMPGROUNDS
app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render('campgrounds/details.ejs', { id, camp });
})

//EDIT CAMPGROUNDS
app.get('/campgrounds/:id/edit', async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render('campgrounds/edit.ejs', { id, camp })
})
app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const newCamp = await Campground.findByIdAndUpdate(id, req.body);
    res.redirect(`/campgrounds/${newCamp._id}`)
})
//DELETE CAMPGROUNDS
app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
})


