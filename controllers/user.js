const User = require('../models/userSchema');


module.exports.registerForm = (req, res) => {
    res.render("users/register")
}

module.exports.createNewUser = async (req, res) => {
    try {
        const user = req.body.User;
        console.log(user)
        const newUser = await User.register(user, user.password);
        req.login(newUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }

}

module.exports.loginForm = (req, res) => {
    res.render("users/login");
}

module.exports.loginUser = (req, res) => {

    req.flash('success', `welcome back ${req.body.username}`);
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}