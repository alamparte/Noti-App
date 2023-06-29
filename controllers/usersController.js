import fs from 'fs';
import { nanoid } from 'nanoid';

import { encrypt, compare } from '../helpers/handleBcrypt.js';
import { validateEmail, validatePassword } from '../helpers/validation.js';

// GET register
export const register = (req, res) => {
    const locals = {
        title: 'Konto erstellen | Noti',
        description: 'Organisiere deine Notizen mit Noti',
    };
    res.render('register', { locals });
};
// GET login
export const login = (req, res) => {
    const locals = {
        title: 'Willkommen zurück | Noti',
        description: 'Organisiere deine Notizen mit Noti',
    };
    res.render('login', { locals });
};
// read JSON users
const jsonUsers = async () => {
    try {
        return JSON.parse(await fs.promises.readFile('database/users.json'));
    } catch (error) {
        console.log(error);
        return [];
    }
};
// cuando la cuenta se cree, aparece un msj q dice creada, cuando aprieta ok, lo lleva al LOGIN
// q lo lleve a ptra panatalla q diga verificando cuenta, y luego de unos segundos diga verificada, y lo lleve
//al login
// podria ver si los inputs estan completaods, y vuelve atras, preguntar antes de abandonar la pagina
// POST register
// ana pass>>> Admin123.
export const getDataRegister = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // console.log(
        //     '--REGISTER = username, email, password-------------------------------'
        // );
        // console.log(username, email, password);
        const passwordHashed = await encrypt(password);
        //////-----------------------------------------------
        // users von JSON lesen
        let users = await jsonUsers();
        let foundUser = users.find((user) => user.username === username || user.email === email);
        // console.log('foundUser-------------------------------');
        // console.log(foundUser);
        if (foundUser) {
            if (foundUser.username === username)
                return res.send({
                    status: 'duplicate-user',
                    error: 'Dieser Benutzername wird bereits verwendet.',
                });

            if (foundUser.email === email)
                return res.send({
                    status: 'duplicate-email',
                    error: 'Diese E-Mail-Adresse wird bereits verwendet.',
                });
        } else if (username != '' && username && email != '' && email && password != '' && password) {
            // format password/email validation
            const emailValidation = await validateEmail(email);
            if (!emailValidation)
                return res.send({
                    status: 'email format error',
                    error: 'Die E-Mail-Adresse scheint ungültig zu sein.',
                });
            const passwordValidation = await validatePassword(password);
            if (!passwordValidation)
                return res.send({
                    status: 'password format error',
                    error: 'Wähle ein Passwort zwischen 6 and 20 Zeichen lang, bestehend aus Buchstaben(Klein- und Großbuchstaben), Zahlen und Satzzeichen.',
                });
            //wenn alles korrekt ist, wird der user erstellt
            users.push({
                id: nanoid(),
                username,
                email,
                password: passwordHashed,
            });
            await fs.promises.writeFile('database/users.json', JSON.stringify(users, null, 2));
            res.send({
                status: 'success',
                message: 'Konto erfolgreich erstellt',
            });
        } else {
            res.send({
                status: 'failed',
                error: 'alle Felder sind erforderlich',
            });
        }
    } catch (error) {
        throw new Error(error);
    }
};
// POST login
export const getDataLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        // console.log('---LOGIN == email, password-------------------------------');
        // console.log(email, password);

        // users von JSON lesen
        let users = await jsonUsers();

        const userFound = await users.find((item) => item.email === email);
        if (userFound) {
            const validPassword = await compare(password, userFound.password);
            if (validPassword) {
                req.session.username = userFound.username;
                // console.log(req.session.username);
                res.send({
                    status: 'success',
                    message: 'Erfolgreiche Anmeldung.',
                });
            } else {
                res.send({
                    status: 'password-error',
                    error: 'Ungültiges Passwort.',
                });
            }
        } else if (!email || !password) {
            res.send({
                status: 'failed',
                error: 'alle Felder sind erforderlich',
            });
        } else {
            res.send({
                status: 'email-error',
                error: 'Es ist kein Konto mit dieser E-Mail-Adresse vorhanden.',
            });
        }
    } catch (error) {
        throw new Error(error);
    }
};
// GET logout
export const logout = (req, res) => {
    req.session.username = '';
    res.redirect('/');
};
// GET changePasswordForm
export const changePasswordForm = (req, res) => {
    const locals = {
        title: 'Passwort zurücksetzen | Noti',
        description: 'Organisiere deine Notizen mit Noti',
    };
    res.render('changePassword', { locals });
};
// POST checkEmail, um das Passwort zu ändern
let userFound;
export const checkEmail = async (req, res) => {
    const { email } = req.body;
    // users von JSON lesen
    let users = await jsonUsers();

    userFound = await users.find((item) => item.email === email);

    if (userFound) {
        res.send({
            status: 'success',
            message: 'Benutzer erfolgreich verifiziert.',
        });
    } else if (email == '') {
        res.send({
            status: 'failed',
            error: 'das Felder ist erforderlich.',
        });
    } else {
        res.send({
            status: 'failed',
            error: 'Es ist kein Konto mit dieser E-Mail-Adresse vorhanden.',
        });
    }
};

// POST change Password
export const changePassword = async (req, res) => {
    console.log(userFound);
    const { currentPassword, newPassword, confirmPassword } = req.body;
    console.log(currentPassword, newPassword, confirmPassword);

    const passwordValidation = await validatePassword(newPassword);

    const validPassword = await compare(currentPassword, userFound.password);
    console.log(validPassword); // true //false
    if (!validPassword) {
        res.send({
            status: 'failed',
            error: 'Das aktuelle Passwort ist nicht korrekt.',
        });
    } else if (newPassword !== confirmPassword) {
        res.send({
            status: 'failed',
            error: 'Das neue Passwort und das Bestätigungspasswort stimmen nicht überein.',
        });
    } else if (newPassword == '' || confirmPassword == '' || currentPassword == '') {
        res.send({
            status: 'failed',
            error: 'alle Felder sind erforderlich.',
        });
    } else if (!passwordValidation) {
        return res.send({
            status: 'password format error',
            error: 'Wähle ein Passwort zwischen 6 and 20 Zeichen lang, bestehend aus Buchstaben(Klein- und Großbuchstaben), Zahlen und Satzzeichen.',
        });
    } else {
        const passwordHashed = await encrypt(newPassword);
        // users von JSON lesen
        let users = await jsonUsers();

        users = users.map((user) => {
            if (user.id === userFound.id) {
                return { ...user, password: passwordHashed };
            }
            return user;
        });

        await fs.promises.writeFile('database/users.json', JSON.stringify(users, null, 2));

        res.send({
            status: 'success',
            message: 'das Passwort wurde erfolgreich geändert.',
        });
    }
};

// GET checkusername
export const checkuser = (req, res) => {
    res.send(req.session.username);
};
