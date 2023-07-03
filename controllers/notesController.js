import fs from 'fs';
import { nanoid } from 'nanoid';
import { getDatum } from '../helpers/helpers.js';

const databaseFolder = './database';
// // read JSON notes
const jsonNotes = async (req) => {
    try {
        let file = await fileName(req);
        return JSON.parse(await fs.promises.readFile(`${databaseFolder}/${file}`));
    } catch (error) {
        console.log(error);
        return [];
    }
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
// file name per user ID
const fileName = async (req) => {
    const users = await jsonUsers();
    const foundUser = users.find((user) => user.username === req.session.username);
    return `${foundUser.id}.json`;
};

// // GET dashboard
export const dashboard = (req, res) => {
    const locals = {
        title: 'Start-Ansicht | Noti',
        description: 'Organisiere deine Notizen mit Noti',
    };
    res.render('dashboard', { locals });
};
// // GET note Form
export const createNoteForm = (req, res) => {
    const locals = {
        title: 'Notizen | Noti',
        description: 'Organisiere deine Notizen mit Noti',
    };
    res.render('newNote', { locals });
};
// // GET notes
export const showNotes = async (req, res) => {
    try {
        let file = await fileName(req);
        //read JSON notes
        let notes = await jsonNotes(req);

        if (notes.length < 1) {
            res.send({
                status: 'failed',
                message: 'keine Notiz gefunden',
            });
        } else {
            res.send({ status: 'success', notes });
        }
    } catch (err) {
        if (err) {
            res.send({
                status: 'failed',
                message: 'keine Notiz gefunden',
            });
        }
        console.error(err.message);
    }
};

// // // POST notes
// export const createNote = async (req, res) => {
//     const { titel, description, category } = req.body;
//     // console.log(titel, description, category);
//     try {
//         // read JSON notes
//         const notes = await jsonNotes();
//         // read JSON users
//         const users = await jsonUsers();
//         const foundUser = users.find((user) => user.username === req.session.username);
//         console.log(foundUser);
//         // me faltaba el && description, capaz ahi estaba el eeerror
//         if (foundUser && titel !== '' && titel && description !== '' && description) {
//             notes.push({
//                 id: nanoid(),
//                 userId: foundUser.id,
//                 titel,
//                 description
//             });
//             await fs.promises.writeFile('database/notes.json', JSON.stringify(notes, null, 2));
//             res.send({
//                 status: 'success',
//                 message: 'Notiz erfolgreich erstellt',
//             });
//         } else {
//             res.send({
//                 status: 'failed',
//                 error: 'alle Felder sind erforderlich',
//             });
//         }
//     } catch (error) {
//         throw new Error();
//     }
// };

// // POST notes
export const createNote = async (req, res) => {
    const { titel, description, category } = req.body;
    let file = await fileName(req);
    try {
        if (titel !== '' && titel && description !== '' && description) {
            //read JSON notes
            let notes = await jsonNotes(req);

            let date = getDatum();
            notes.unshift({
                id: nanoid(),
                titel,
                description,
                category,
                date,
            });
            await fs.promises.writeFile(`${databaseFolder}/${file}`, JSON.stringify(notes, null, 2));
            res.send({
                status: 'success',
                message: 'Notiz erfolgreich erstellt',
            });
        } else {
            res.send({
                status: 'failed',
                error: 'alle Felder sind erforderlich',
            });
        }
    } catch (err) {
        if (err) {
            let notes = [];

            let date = getDatum();
            notes.unshift({
                id: nanoid(),
                titel,
                description,
                category,
                date,
            });
            await fs.promises.writeFile(`${databaseFolder}/${file}`, JSON.stringify(notes, null, 2));
            res.send({
                status: 'success',
                message: 'Notiz und Datei erfolgreich erstellt',
            });
        }
    }
};

// GET verFormEdit
export const viewNoteForm = async (req, res) => {
    try {
        let file = await fileName(req);
        //read JSON notes
        let notes = await jsonNotes(req);

        const foundNote = notes.find((note) => note.id === req.params.id);

        if (foundNote) {
            res.render('editNote', { foundNote });
        } else {
            res.send({ status: 'failed' });
        }
    } catch (error) {
        throw new Error();
    }
};

// //EDIT notes
export const editNote = async (req, res) => {
    const { titel, description, category } = req.body;
    try {
        let file = await fileName(req);
        //read JSON notes
        let notes = await jsonNotes(req);

        let date = getDatum();

        notes = notes.map((note) => {
            if (note.id === req.params.id) {
                return { ...note, titel, description, category, date };
            }
            return note;
        });

        await fs.promises.writeFile(`${databaseFolder}/${file}`, JSON.stringify(notes, null, 2));

        res.send({
            status: 'success',
            message: 'Notiz erfolgreich ausgetauscht',
        });
    } catch (error) {
        throw new Error();
    }
};

// // // DELETE notes
export const deleteNote = async (req, res) => {
    try {
        let file = await fileName(req);
        //read JSON notes
        let notes = await jsonNotes(req);

        const foundNote = notes.find((note) => note.id === req.params.id);

        if (foundNote) {
            let itemRemoved = notes.splice(
                notes.findIndex((note) => note.id === req.params.id),
                1
            );
            await fs.promises.writeFile(`${databaseFolder}/${file}`, JSON.stringify(notes, null, 2));

            return res.send({
                status: 'success',
                message: 'Notiz erfolgreich gelöscht.',
            });
        }
    } catch (error) {
        throw new Error();
    }
};

export const sortNotes = async (req, res) => {
    const { selected } = req.body;

    try {
        let file = await fileName(req);

        if (selected === 'auf' || selected === 'ab') {
            //read JSON notes
            let notes = await jsonNotes(req);

            // sortiert nach Datum (aufsteigend / absteigend)
            selected === 'ab' ? notes.sort((a, b) => new Date(b.date) - new Date(a.date)) : notes.sort((a, b) => new Date(a.date) - new Date(b.date));

            await fs.promises.writeFile(`${databaseFolder}/${file}`, JSON.stringify(notes, null, 2));
            return res.send({
                status: selected === 'auf' ? 'auf' : 'ab',
                message: 'Notiz erfolgreich sortiert',
                notes,
            });
        }
    } catch (error) {
        throw new Error();
    }
};

export const filterNotes = async (req, res) => {
    const { filtered } = req.body;

    try {
        let file = await fileName(req);

        if (filtered === 'hohe' || filtered === 'mittlere' || filtered === 'niedrige') {
            //read JSON notes
            let notes = await jsonNotes(req);

            // array copied
            let notesFilteredArr = [...notes];

            // sortiert nach Datum (aufsteigend / absteigend)
            filtered === 'hohe'
                ? (notesFilteredArr = notesFilteredArr.filter((note) => note.category === filtered))
                : filtered === 'mittlere'
                ? (notesFilteredArr = notesFilteredArr.filter((note) => note.category === filtered))
                : (notesFilteredArr = notesFilteredArr.filter((note) => note.category === filtered));

            return res.send({
                status: filtered === 'hohe' ? 'hohe' : filtered === 'mittlere' ? 'mittlere' : 'niedrige',
                message: 'Notiz erfolgreich ausgefiltert',
                notesFilteredArr,
            });
        }

        if (filtered === 'alle') {
            //read JSON notes
            let notes = await jsonNotes(req);

            return res.send({
                status: 'alle',
                message: 'Notiz erfolgreich ausgefiltert',
                notes,
            });
        }
    } catch (error) {
        throw new Error();
    }
};
