const User = require('../models/user');
const determineRedirectUrl = require('../middleware')

//Users functionalities

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register')
};

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

module.exports.createUser = async (req, res) => {
    const { username, email, password } = req.body;
    if (!passwordRegex.test(password)) {
        req.flash('error', '𝐏𝐚𝐬𝐬𝐰𝐨𝐫𝐝 must be at least 𝟖 𝐜𝐡𝐚𝐫𝐚𝐜𝐭𝐞𝐫𝐬 𝐥𝐨𝐧𝐠 and include at least 𝐨𝐧𝐞 𝐮𝐩𝐩𝐞𝐫𝐜𝐚𝐬𝐞 𝐥𝐞𝐭𝐭𝐞𝐫, 𝐨𝐧𝐞 𝐥𝐨𝐰𝐞𝐫𝐜𝐚𝐬𝐞 𝐥𝐞𝐭𝐭𝐞𝐫, 𝐨𝐧𝐞 𝐝𝐢𝐠𝐢𝐭, and 𝐨𝐧𝐞 𝐬𝐩𝐞𝐜𝐢𝐚𝐥 𝐜𝐡𝐚𝐫𝐚𝐜𝐭𝐞𝐫.');
        return res.redirect('/register');
    }

    try {
        // Check if the email already exists
        const existingUserByEmail = await User.findOne({ email });
        if (existingUserByEmail) {
            req.flash('error', 'Email already registered. Please use a different email');
            return res.redirect('/register');
        }

        // Create and register the user
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password); // Passport package handles password hashing and salting

        // Log in the user
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to YelpCamp!');
            res.redirect('/campgrounds');
        });
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/register');
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login')
};

module.exports.loginUser = (req, res) => { //passport.authenticate makes sure that the user was logged in successfully
    req.flash('success', 'Welcome back!')
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    delete req.session.returnTo
    res.redirect(redirectUrl)
    /* console.log('Redirecting to:', redirectUrl); */
};

module.exports.logoutUser = (req, res, next) => {
    req.logout(function (err) { //method added by passport package
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
};