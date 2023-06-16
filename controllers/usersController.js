import fs from 'fs';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';

import { encrypt, compare } from '../helpers/handleBcrypt.js';

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
// POST register
export const getDataRegister = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log(
            '--username, email, password-------------------------------'
        );
        console.log(username, email, password);
        const passwordHashed = await encrypt(password);
        // console.log(passwordHashed);

        let users = await jsonUsers();
        let foundUser = users.find(
            (user) => user.username === username || user.email === email
        );
        console.log('foundUser-------------------------------');
        console.log(foundUser);
        if (foundUser) {
            if (foundUser.username === username) {
                return res.send({
                    status: 'failed',
                    error: 'Benutzername bereits verwendet',
                });
            }
            if (foundUser.email === email) {
                return res.send({
                    status: 'failed',
                    error: 'E-Mail bereits verwendet',
                });
            }
        } else if (username != '' && email != '' && password != '') {
            users.push({
                id: nanoid(),
                username,
                email,
                password: passwordHashed,
            });
            fs.writeFile(
                'database/users.json',
                JSON.stringify(users, null, 2),
                (err) => {
                    if (err) throw err;
                    console.log(users);
                    res.send({
                        status: 'success',
                        message: 'Konto erfolgreich erstellt',
                    });
                }
            );
            // await fs.promises.writeFile(
            //     'database/users.json',
            //     JSON.stringify(users, null, 2)
            // );
        } else {
            return res.send({
                status: 'failed',
                error: 'alle Felder sind erforderlich',
            });
        }
    } catch (error) {
        throw new Error(error);
    }
};
// POST login
export const getDataLogin = async (req, res) => {};
