// if user logged in, cannot go to the login/register/index/why-noti/reset-password site
const checkNoAuth = (req, res, next) => {
    if (req.session.username && req.session.username != '') {
        return res.redirect('/dashboard');
    }
    next();
};

export { checkNoAuth };
