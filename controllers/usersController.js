import fs from 'fs';
import { nanoid } from 'nanoid';
import nodemailer from 'nodemailer';
import { encrypt, compare } from '../helpers/handleBcrypt.js';
import { validateEmail, validatePassword } from '../helpers/validation.js';
import { generateNumericCode, jsonUsers } from '../helpers/helpers.js';

// GET checkusername
export const checkuser = (req, res) => {
    res.send(req.session.username);
};
// GET register form
export const register = (req, res) => {
    const locals = {
        title: 'Konto erstellen | Noti',
        description: 'Organisiere deine Notizen mit Noti',
    };
    res.render('register', { locals });
};
// GET login form
export const login = (req, res) => {
    const locals = {
        title: 'Willkommen zurück | Noti',
        description: 'Organisiere deine Notizen mit Noti',
    };
    res.render('login', { locals });
};
// POST register
export const getDataRegister = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const passwordHashed = await encrypt(password);
        //////-----------------------------------------------
        // users von JSON lesen
        let users = await jsonUsers();
        // user already exists?
        let foundUser = users.find((user) => user.username === username || user.email === email);

        if (foundUser) {
            if (foundUser.username === username)
                return res.send({
                    status: 'duplicate-user',
                    error: 'Dieser Benutzername wird bereits verwendet.',
                });

            if (foundUser.email === email)
                return res.send({
                    status: 'email error',
                    error: 'Diese E-Mail-Adresse wird bereits verwendet.',
                });
        } else if (username != '' && username && email != '' && email && password != '' && password) {
            // format password/email validation
            const emailValidation = await validateEmail(email);
            if (!emailValidation)
                return res.send({
                    status: 'email error',
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

        // users von JSON lesen
        let users = await jsonUsers();
        // user exists?
        const userFound = await users.find((item) => item.email === email);

        if (userFound) {
            const validPassword = await compare(password, userFound.password);
            if (validPassword) {
                req.session.username = userFound.username;
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
// logout
export const logout = (req, res) => {
    req.session.username = '';
    res.redirect('/');
};
// GET forgotPassword Form
export const forgotPasswordForm = (req, res) => {
    const locals = {
        title: 'Passwort zurücksetzen | Noti',
        description: 'Organisiere deine Notizen mit Noti',
    };
    res.render('forgotPassword', { locals });
};
let userFound;
let emailFound;
let numericCode;
// POST checkEmail, um das Passwort zu ändern
export const checkEmail = async (req, res) => {
    const { email } = req.body;
    emailFound = email;
    // users von JSON lesen
    let users = await jsonUsers();
    // validate user, it exists?
    userFound = await users.find((item) => item.email === email);

    if (userFound) {
        res.send({
            status: 'successEmail',
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
// POST Password forgot
export const forgotPassword = async (req, res) => {
    const { newPassword, confirmPassword } = req.body;

    const passwordValidation = await validatePassword(newPassword);

    if ((newPassword == '' && confirmPassword == '') || newPassword == '' || confirmPassword == '') {
        res.send({
            status: 'failed',
            error: 'alle Felder sind erforderlich.',
        });
    } else if (newPassword !== confirmPassword) {
        res.send({
            status: 'failed-stimmen',
            error: 'Das neue Passwort und das Bestätigungspasswort stimmen nicht überein.',
        });
    } else if (!passwordValidation) {
        res.send({
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

// GET changePasswordForm
export const changePasswordForm = (req, res) => {
    const locals = {
        title: 'Passwort ändern | Noti',
        description: 'Organisiere deine Notizen mit Noti',
    };
    res.render('changePassword', { locals });
};

// // POST change Password
export const changePassword = async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    // format validate
    const passwordValidation = await validatePassword(newPassword);

    const users = await jsonUsers();
    const foundUser = users.find((user) => user.username === req.session.username);

    const validPassword = await compare(currentPassword, foundUser.password);

    if (!validPassword) {
        return res.send({
            status: 'failed-gleich',
            error: 'Das aktuelle Passwort ist nicht korrekt.',
        });
    }
    if (validPassword) {
        if (newPassword !== confirmPassword) {
            res.send({
                status: 'failed-stimmen',
                error: 'Das neue Passwort und das Bestätigungspasswort stimmen nicht überein.',
            });
        } else if ((newPassword == '' && confirmPassword == '') || newPassword == '' || confirmPassword == '') {
            res.send({
                status: 'failed',
                error: 'alle Felder sind erforderlich.',
            });
        } else if (!passwordValidation) {
            res.send({
                status: 'password format error',
                error: 'Wähle ein Passwort zwischen 6 and 20 Zeichen lang, bestehend aus Buchstaben(Klein- und Großbuchstaben), Zahlen und Satzzeichen.',
            });
        } else {
            const passwordHashed = await encrypt(newPassword);
            // users von JSON lesen
            let users = await jsonUsers();

            users = users.map((user) => {
                if (user.id === foundUser.id) {
                    return { ...user, password: passwordHashed };
                }
                return user;
            });

            await fs.promises.writeFile('database/users.json', JSON.stringify(users, null, 2));
            //borro para q se loguee de nuevo
            req.session.username = '';

            res.send({
                status: 'success',
                message: 'das Passwort wurde erfolgreich geändert. Bitte melden Sie sich erneut an.',
            });
        }
    }
};

export const checkEmailCode = async (req, res) => {
    numericCode = generateNumericCode();
    try {
        // ein Testkonto in Ethereal.email erstellen
        const testAccount = await nodemailer.createTestAccount();
        // mit dem Testkonto ein Transportobjekt erstellen
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: 'patrick40@ethereal.email',
                pass: 'uZ6XHNNDdyA8SS6cM5',
            },
        });
        // E-Mail Optionen
        const mailOptions = {
            from: '"Noti" <noreply@noti.com>',
            to: emailFound,
            subject: 'Passwortzurücksetzungscode',
            text: `Hallo ${userFound.username},
                   Wir haben eine Anfrage zun Zürucksetzen deines Noti-Passworts erhalten.
                   Gib den folgenden Code zum Zürucksetzen des Passworts ein:
                   ${numericCode}`,
            html: ` <p>Hallo ${userFound.username},</p>
            <p>Wir haben eine Anfrage zun Zürucksetzen deines Noti-Passworts erhalten.</p>
            <p>Gib den folgenden Code zum Zürucksetzen des Passworts ein:</p>
            <strong>${numericCode}</strong></p>`,
        };
        // E-Mail senden
        const info = await transporter.sendMail(mailOptions);
        let emailPreviewURL = nodemailer.getTestMessageUrl(info);

        res.send({ emailPreviewURL, numericCode });
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// POST check code
export const checkCode = (req, res) => {
    const { code } = req.body;

    if (Number(numericCode) === Number(code)) {
        res.send({
            status: 'successCode',
            message: 'Code erfolgreich verifiziert.',
        });
    } else {
        res.send({
            status: 'failed',
            error: 'Der Code ist nicht korrekt.',
        });
    }
};
