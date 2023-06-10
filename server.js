import express from 'express';
import fs from 'fs';
import bcrypt from 'bcrypt';

const saltRounds = 10;

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
app.set('views', './public/views');

// -- las rutas se crean asi?
// app.get('/', (req, res) => {
//     res.render('index');
// }); // kann ich die index.html in public Ordner direkt  kreieren?
// von index.html nach register/login Seite
app.get('/register', (req, res) => {
    res.render('register');
});
app.get('/login', (req, res) => {
    res.render('login');
});

// cuando la cuenta se cree, aparece un msj q dice creada, cuando aprieta ok, lo lleva al LOGIN
app.post('/register', async (req, res) => {
    const { username, email, password: hashPwd } = req.body;
    const password = await bcrypt.hash(hashPwd, 10);
    try {
        fs.readFile('./data/users.json', (err, data) => {
            if (err) throw err;

            let users = JSON.parse(data);

            for (const user of users) {
                if (user.username === username) {
                    return res.send({
                        status: 'error',
                        error: 'Benutzername bereits verwendet',
                    });
                }
                if (user.email === email) {
                    return res.send({
                        status: 'error',
                        error: 'E-Mail bereits verwendet',
                    });
                }
            }
            users.push({
                id: +new Date(),
                username,
                email,
                password,
            });
            fs.writeFile(
                './data/users.json',
                JSON.stringify(users, null, 2),
                (err) => {
                    if (err) throw err;
                    res.send({ status: 'ok' });
                }
            );
        });
    } catch (error) {
        console.log(error);
        return res.send({ status: 'error' });
    }
});

// listen
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
