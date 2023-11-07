import express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import { router as indexRoutes } from './routes/index.js';
import { router as notesRoutes } from './routes/notes.js';
import { router as userRoutes } from './routes/users.js';

const app = express();
const PORT = process.env.PORT || 3001;
// Middleware
//  session management
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {},
    })
);
//  disable cache
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});
// control the access to all /dashboard routes
app.use('/dashboard', (req, res, next) => {
    if (req.session.username && req.session.username != '') {
        next();
    } else {
        res.redirect('/');
    }
});
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(morgan('common'));
app.use((req, res, next) => {
    res.header({ 'Access-Control-Allow-Origin': '*' });
    next();
});
// set template engine preference
app.set('view engine', 'ejs');
// Router
app.use('/', indexRoutes);
app.use('/', notesRoutes);
app.use('/', userRoutes);
// listen
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
// alle unbekannten URL auf 404 umleiten
app.get('*', (req, res) => {
    const locals = {
        title: 'Seite nicht gefunden | Noti',
        description: 'Seite nicht gefunden | Noti',
    };
    res.status(404).render('404', { locals });
});
