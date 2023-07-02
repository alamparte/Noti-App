const checkNoAuth = (req, res, next) => {
    if (req.session.username && req.session.username != '') {
        return res.redirect('/dashboard');
    }
    next();
};

export { checkNoAuth };
