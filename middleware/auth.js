const checkNoAuth = (req, res, next) => {
    if (req.session.username && req.session.username != '') {
        return res.redirect('/dashboard');
    }
    next();
};

const checkAuth = (req, res, next) => {
    if (req.session.username && req.session.username != '') {
        next();
    } else {
        res.redirect('/');
    }
};

export { checkNoAuth, checkAuth };
