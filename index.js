if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
};
console.log(process.env.SECRET)

//SETUP PACKAGES
const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); //makes sure 
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const expressError = require('./utilities/expressError.js');
const session = require('express-session');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users')
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js')


mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'There was an error connecting to the database.'))
db.once('open', () => {
    console.log('Successfully Connected to Database!');
})

const app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.engine('ejs', engine);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


const sessionConfig = {
    secret: 'weirdSecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 6.048e8,
        maxAge: 6.048e8
    },
}

app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// app.use(session(sessionConfig))
// app.use(flash());

// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(new LocalStrategy(
//     function (email, password, done) {
//         User.findOne({ email: email }, function (err, user) {
//             if (err) { return done(err); }
//             if (!user) { return done(null, false); }
//             if (!user.verifyPassword(password)) { return done(null, false); }
//             return done(null, user);
//         });
//     }
// ));
// // passport.use(new LocalStrategy(User.authenticate('local')));

// passport.serializeUser(function (user, done) {
//     done(null, user.id);
// });

// passport.deserializeUser(function (id, done) {
//     User.findById(id, function (err, user) {
//         done(err, user);
//     });
// });

app.use((req, res, next) => {
    res.locals.loggedInUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)
app.use('/', userRoutes)


app.get('/', (req, res) => {
    res.render('home.ejs')
})

app.all('*', (req, res, next) => {
    next(new expressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Oops, something went wrong!' } = err;
    if (!err.message) err.message = 'Oops, something went wrong!'
    res.status(statusCode).render('error.ejs', { err });
})

//IMAGE URL https://source.unsplash.com/collection/483251

app.listen(3000, () => {
    console.log('Listening on Port 3000...')
})
