const User = require('../models/user.js')
const passport = require('passport')


module.exports.renderRegister = (req, res) => {
    res.render('users/register')
}
module.exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({
            email, username
        })
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, function (err) {
            if (err) { return next(err); }
            req.flash('success', 'Welcome to Yelp Camp! Enjoy your stay.')
            res.redirect('/campgrounds')
        })
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}
module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}
module.exports.login = async (req, res) => {
    req.flash('success', 'Welcome back, camper!')
    const redirectUrl = req.session.returnTo || '/campgrounds';
    res.redirect(redirectUrl)
    delete req.session.returnTo;
}

module.exports.logout = (req, res) => {
    req.logout(function (err) {
        if (err) {
            next(err);
        } else {
            req.flash('success', "Logged out, see you later!");
            res.redirect('/');
        }
    })
}