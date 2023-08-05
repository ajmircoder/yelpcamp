const isLogIn = (req, res, next) => {
    // console.log("req.user...", req.user)
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you must be signed up or log in');
        return res.redirect('/login')

    }
    next();
}
const islogIn = (req, res, next) => {
    if (!req.isAuthenticated()) {  
        req.flash('error', 'you must be signed up or log in');
        return res.redirect(`/campgrounds/${req.params.id}`)
    }
    next();
}

const storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports = { isLogIn, islogIn, storeReturnTo };