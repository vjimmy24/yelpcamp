if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
};


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
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const {scriptSrcUrls, styleSrcUrls, connectSrcUrls, fontSrcUrls} = require('./utilities/helmetDepens')
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp'

const mongoStore = require('connect-mongo');
const secret = process.env.SECRET || 'weirdsecret'

// 'mongodb://localhost:27017/yelp-camp'
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'There was an error connecting to the database.'))
db.once('open', () => {
    console.log('Successfully Connected to Database!');
})

const app = express();

app.use(helmet());

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/digfn29ss/",
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.engine('ejs', engine);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

const store = mongoStore.create({
    mongoUrl: dbUrl, 
    crypto: {
        secret
    },
    touchAfter: 24 * 60 * 60
});

store.on('error', (e)=> {
    console.log('SESSION STORE ERROR', e)
})

const sessionConfig = {
    store,
    name: 'cenmxy',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //SECURE WHEN DEPLOYED
        // secure: true, 
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

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Listening on Port ${port}...`)
})
