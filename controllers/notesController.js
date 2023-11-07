import fs from 'fs';
import { nanoid } from 'nanoid';
import { getDatum, jsonNotes, fileName } from '../helpers/helpers.js';
// database folder name
const databaseFolder = './database';

// GET render dashboard
export const dashboard = (req, res) => {
    const locals = {
        title: 'Start-Ansicht | Noti',
        description: 'Organisiere deine Notizen mit Noti',
    };
    res.render('dashboard', { locals });
};

// GET render note Form
export const createNoteForm = (req, res) => {
    const locals = {
        title: 'Notizen | Noti',
        description: 'Organisiere deine Notizen mit Noti',
    };
    res.render('newNote', { locals });
};

// GET notes
export const showNotes = async (req, res) => {
    try {
        // get json notes name
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

// POST notes
export const createNote = async (req, res) => {
    const { titel, description, category } = req.body;
    // get json notes name
    let file = await fileName(req);
    try {
        if (titel !== '' && titel && description !== '' && description) {
            //read JSON notes
            let notes = await jsonNotes(req);
            // create date
            let date = getDatum();
            // unshift in the json
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
        // if doesn't exists a ''fileName'', create a json
        if (err) {
            let notes = [];
            // create date
            let date = getDatum();
            // unshift in the json
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

// GET Form Edit with data
export const viewNoteForm = async (req, res) => {
    try {
        // get json notes name
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

// //EDIT note
export const editNote = async (req, res) => {
    const { titel, description, category } = req.body;
    try {
        // get json notes name
        let file = await fileName(req);
        //read JSON notes
        let notes = await jsonNotes(req);
        // create date
        let date = getDatum();
        // edit note with map()
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

// DELETE note
export const deleteNote = async (req, res) => {
    try {
        // get json notes name
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

// SORT notes
export const sortNotes = async (req, res) => {
    const { sort } = req.query;

    try {
        // get json notes name
        let file = await fileName(req);

        if (sort === 'auf' || sort === 'ab') {
            //read JSON notes
            let notes = await jsonNotes(req);

            // sortiert nach Datum (aufsteigend / absteigend)
            sort === 'ab' ? notes.sort((a, b) => new Date(b.date) - new Date(a.date)) : notes.sort((a, b) => new Date(a.date) - new Date(b.date));

            await fs.promises.writeFile(`${databaseFolder}/${file}`, JSON.stringify(notes, null, 2));
            return res.send({
                status: 'success',
                message: 'Notiz erfolgreich sortiert',
                notes,
            });
        }
    } catch (error) {
        console.log(error);
        throw new Error();
    }
};

// FILTER notes
export const filterNotes = async (req, res) => {
    const { filter } = req.query;

    //read JSON notes
    let notes = await jsonNotes(req);

    try {
        // get json notes name
        let file = await fileName(req);

        if (filter === 'hohe' || filter === 'mittlere' || filter === 'niedrige') {
            // copy array
            let notesFilteredArr = [...notes];

            // filter per category
            filter === 'hohe'
                ? (notesFilteredArr = notesFilteredArr.filter((note) => note.category === filter))
                : filter === 'mittlere'
                ? (notesFilteredArr = notesFilteredArr.filter((note) => note.category === filter))
                : (notesFilteredArr = notesFilteredArr.filter((note) => note.category === filter));

            if (!notesFilteredArr.length < 1) {
                return res.send({
                    status: 'success',
                    message: 'Notiz erfolgreich ausgefiltert',
                    notesFilteredArr,
                });
            } else {
                res.send({ status: 'failed', error: 'In dieser Kategorie wurden keine Notizen gefunden.' });
            }
        }

        if (filter === 'alle') {
            return res.send({
                status: 'allNotes',
                message: 'Notiz erfolgreich ausgefiltert',
                notes,
            });
        }
    } catch (error) {
        throw new Error();
    }
};

// SEARCH notes
export const sucheNotes = async (req, res) => {
    const { search } = req.query;

    // get json notes name
    let file = await fileName(req);

    //read JSON notes
    let notes = await jsonNotes(req);

    const results = notes.filter((note) => note.titel.toLowerCase().includes(search.toLowerCase()));

    if (!results.length < 1) {
        res.send({ status: 'success', results });
    } else {
        res.send({ status: 'failed', error: 'keine Übereinstimmung gefunden.' });
    }
};

// RESET Filter
export const resetFilter = async (req, res) => {
    //read JSON notes
    let notes = await jsonNotes(req);

    res.send({ status: 'success', notes });
};
