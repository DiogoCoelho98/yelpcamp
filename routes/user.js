const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const users = require('../controllers/users');
const { storeReturnTo } = require('../middleware');
const passport = require('passport');

//User Routes

router.route('/register')
    .get(users.renderRegisterForm)
    .post(catchAsync(users.createUser));

router.route('/login')
    .get(users.renderLoginForm)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login',
    }), users.loginUser);

    
// Google OAuth routes
router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'consent'
}));

router.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/login'
}), (req, res) => {
    res.redirect('/campgrounds');
});

router.get('/logout', users.logoutUser);

module.exports = router;