if (process.env.NODE_ENV !== 'production') { 
    require('dotenv').config()
}
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const override = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const helmet = require('helmet');
const ExpressError = require('./utils/ExpressError');
const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');
const usersRoutes = require('./routes/user');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const dbUrl = process.env.DB_URL ||  'mongodb://localhost:27017/yelp-camp'; 
mongoose.connect(dbUrl, {});

const app = express();

// Middleware setup
app.engine('ejs', ejsMate); 
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(override('_method')); 
app.use(express.static(path.join(__dirname, 'public')));

const secret = process.env.SECRET || 'thisshouldbeabettersecret';
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: secret
    }
});

// Session Middleware setup
const sessionConfig = {
    store,
    name: 'session',
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // Expires after 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        /* secure: true */                           
    }
};

app.use(session(sessionConfig));
app.use(flash());
app.use(helmet( { contentSecurityPolicy: false }));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser()); // How the user is stored in the session
passport.deserializeUser(User.deserializeUser()); // How to get the user out of the session

passport.use(new GoogleStrategy({
    callbackURL: 'https://yelpcamp-uf2n.onrender.com/auth/google/callback',
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    passReqToCallback: true,
    scope: ['profile', 'email']
}, async (req, accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
            user = await User.findOne({ email: profile.emails[0].value });
            if (!user) {
                user = new User({
                    username: profile.displayName,
                    email: profile.emails[0].value,
                    googleId: profile.id
                });
                await user.save();
            } else {
                user.googleId = profile.id;
                await user.save();
            }
        }
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

app.use((req, res, next) => {
    /* console.log(req.session) */
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
});

// Routes 
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);
app.use('/', usersRoutes);

app.get('/', (req, res) => {
    res.render('home');
});

// Error handling middleware
app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) {
        err.message = 'Something went wrong!!';
    }
    res.status(statusCode).render('error', { err });
});

// Server listening
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;
