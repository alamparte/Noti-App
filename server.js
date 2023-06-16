import express from 'express';
import session from 'express-session';

import { router as indexRoutes } from './routes/index.js';
import { router as userRoutes } from './routes/users.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use((req, res, next) => {
    res.header({ 'Access-Control-Allow-Origin': '*' });
    next();
});
// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('./public'));

app.set('view engine', 'ejs');
// Router
app.use('/', indexRoutes);
app.use('/', userRoutes);

// listen
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// //TODO: //für alle Anfrage ohne Pfad? ist das korrekt?
// app.get('*', (req, res) => {
//     res.status(404).render('404');
// });
