import fs from 'fs';
import { nanoid } from 'nanoid';
import { getDatum } from '../helpers/validation.js';

// // read JSON notes
// const jsonNotes = async () => {
//     try {
//         return JSON.parse(await fs.promises.readFile('database/notes.json'));
//     } catch (error) {
//         console.log(error);
//         return [];
//     }
// };
// read JSON users
const jsonUsers = async () => {
    try {
        return JSON.parse(await fs.promises.readFile('database/users.json'));
    } catch (error) {
        console.log(error);
        return [];
    }
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
    const users = await jsonUsers();
    const foundUser = users.find((user) => user.username === req.session.username);
    const databaseFolder = './database';
    const file = `${foundUser.id}.json`;

    fs.access(`${databaseFolder}/${file}`, fs.constants.F_OK, async (err) => {
        console.log(`${file} ${err ? 'does not exist' : 'exists'}`);
        if (err) {
            res.send({
                status: 'failed',
                message: 'keine Notiz gefunden',
            });
        } else {
            let notes = JSON.parse(await fs.promises.readFile(`${databaseFolder}/${file}`));
            res.send({ status: 'success', notes });
        }
    });

    // try {
    //     const users = await jsonUsers();
    //     const foundUser = users.find((user) => user.username === req.session.username);
    //     const databaseFolder = './database';
    //     let files = await fs.promises.readdir(databaseFolder);
    //     console.log(files);
    //     console.log('------------foundUser.id');
    //     console.log(foundUser.id);

    //     const checkFile = async () => {
    //         console.log(files);
    //         for (const file of files) {
    //             if (file === `${foundUser.id}.json`) {
    //                 return true;
    //             } else {
    //                 return false;
    //             }
    //         }
    //     };

    //     let fileExist = await checkFile();
    //     console.log(fileExist);

    //     if (fileExist) {
    //         let notes = JSON.parse(await fs.promises.readFile(`${databaseFolder}/${foundUser.id}.json`));
    //         res.send({ status: 'success', notes });
    //     } else {
    //         res.send({
    //             status: 'failed',
    //             message: 'keine Notiz gefunden',
    //         });
    //     }

    //  else {
    //     res.send({
    //         status: 'failed',
    //         message: 'Datenbank nicht gefunden',
    //     });
    // }

    // const users = await jsonUsers();
    // const foundUser = users.find((user) => user.username === req.session.username);
    // const notes = await jsonNotes();
    // const notesFiltered = notes.filter((item) => item.userId === foundUser.id);
    // console.log(notesFiltered);
    // if (notesFiltered.length > 0) {
    //     res.send({ status: 'success', notesFiltered });
    // } else {
    //     res.send({
    //         status: 'failed',
    //         message: 'keine Notiz gefunden',
    //     });
    // }
    // } catch (error) {
    //     console.log(error);
    //     throw new Error();
    // }
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
    console.log(titel, description, category);

    const users = await jsonUsers();
    const foundUser = users.find((user) => user.username === req.session.username);
    const databaseFolder = './database';
    const file = `${foundUser.id}.json`;

    if (titel !== '' && titel && description !== '' && description) {
        fs.access(`${databaseFolder}/${file}`, fs.constants.F_OK, async (err) => {
            console.log(`${file} ${err ? 'does not exist' : 'exists'}`);
            if (err) {
                console.error('File does not exist');
                // Create the file
                await fs.promises.writeFile(`${databaseFolder}/${file}`, '[]');
                // Test the if the file exists again
                fs.access(`${databaseFolder}/${file}`, fs.constants.F_OK, async (err) => {
                    if (!err) {
                        console.log('File does exist');
                        let notes = JSON.parse(await fs.promises.readFile(`${databaseFolder}/${file}`));
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
                });
            } else {
                let notes = JSON.parse(await fs.promises.readFile(`${databaseFolder}/${file}`));
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
            }
        });
    } else {
        res.send({
            status: 'failed',
            error: 'alle Felder sind erforderlich',
        });
    }

    // try {
    //     // read JSON users
    //     const users = await jsonUsers();
    //     const foundUser = users.find((user) => user.username === req.session.username);

    //     if (foundUser && titel !== '' && titel && description !== '' && description) {
    //         const databaseFolder = './database';
    //         let files = await fs.promises.readdir(databaseFolder);

    //         const checkFile = async () => {
    //             console.log(files);
    //             for (const file of files) {
    //                 console.log(files);
    //                 if (file === `${foundUser.id}.json`) {
    //                     return true;
    //                 } else {
    //                     return false;
    //                 }
    //             }
    //         };

    //         let fileExist = await checkFile();

    //         if (fileExist) {
    //             let notes = JSON.parse(await fs.promises.readFile(`${databaseFolder}/${foundUser.id}.json`));

    //             notes.push({
    //                 id: nanoid(),
    //                 titel,
    //                 description,
    //                 category,
    //             });
    //             await fs.promises.writeFile(`${databaseFolder}/${foundUser.id}.json`, JSON.stringify(notes, null, 2));

    //             res.send({
    //                 status: 'success',
    //                 message: 'Notiz erfolgreich erstellt',
    //             });
    //         } else {
    //             await fs.promises.writeFile(`${databaseFolder}/${foundUser.id}.json`, '[]');

    //             let notes = JSON.parse(await fs.promises.readFile(`${databaseFolder}/${foundUser.id}.json`));

    //             notes.push({
    //                 id: nanoid(),
    //                 titel,
    //                 description,
    //                 category,
    //             });
    //             await fs.promises.writeFile(`${databaseFolder}/${foundUser.id}.json`, JSON.stringify(notes, null, 2));
    //             res.send({
    //                 status: 'success',
    //                 message: 'Notiz erfolgreich erstellt',
    //             });
    //         }
    //     } else {
    //         res.send({
    //             status: 'failed',
    //             error: 'alle Felder sind erforderlich',
    //         });
    //     }
    // } catch (error) {
    //     console.log(error);
    //     throw new Error();
    // }
};
// // // PUT notes
// // export const editNote = async (req,res)=>{}

// GET verFormEdit
export const viewNoteForm = async (req, res) => {
    console.log('id--------- ', req.params.id);

    const users = await jsonUsers();
    const foundUser = users.find((user) => user.username === req.session.username);
    const databaseFolder = './database';
    const file = `${foundUser.id}.json`;
    //read JSON notes
    let notes = JSON.parse(await fs.promises.readFile(`${databaseFolder}/${file}`));

    const foundNote = notes.find((note) => note.id === req.params.id);

    if (foundNote) {
        res.render('editNote', { foundNote });
    } else {
        res.send({ status: 'failed' });
    }
};

// //EDIT notes
export const editNote = async (req, res) => {
    //old note
    console.log('id--------- ', req.params.id);
    //new note
    const { titel, description, category } = req.body;

    const users = await jsonUsers();
    const foundUser = users.find((user) => user.username === req.session.username);
    const databaseFolder = './database';
    const file = `${foundUser.id}.json`;

    //read JSON notes
    let notes = JSON.parse(await fs.promises.readFile(`${databaseFolder}/${file}`));

    // const foundNote = notes.find((note) => note.id === req.params.id);

    // let index = notes.findIndex((e) => e.id === req.params.id);
    // console.log('index ---- ', index);
    // let itemRemoved = notes.splice(index, 1);

    // mit notes.MAP()

    // notes.unshift({
    //     id: nanoid(),
    //     userId: foundUser.id,
    //     titel,
    //     description,
    // });
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
        message: 'nota cambiada correctamente',
    });
    // }
};

// // // DELETE notes
export const deleteNote = async (req, res) => {
    //old note
    console.log('id--------- ', req.params.id);

    //read JSON notes
    const notes = await jsonNotes();

    const foundNote = notes.find((note) => note.id === req.params.id);
    console.log('foundNote to delete-------------------------------------');
    console.log(foundNote);
    let index = notes.findIndex((e) => e.id === req.params.id);
    console.log('index ---- ', index);
    let itemRemoved = notes.splice(index, 1);

    // let itemRemoved = data.splice(
    //     data.findIndex((e) => e.id == targetBtnParent.id),
    //     1
    // );

    await fs.promises.writeFile('database/notes.json', JSON.stringify(notes, null, 2));
    res.send({
        status: 'success',
        message: 'nota borrada correctamente',
    });
};

export const sortNotes = async (req, res) => {
    // SI ANDA, tengo q llamnar al addeventlistener en la funcion q se crea el html,
    //sino no funciona
    const { selected } = req.body;

    const users = await jsonUsers();
    const foundUser = users.find((user) => user.username === req.session.username);
    const databaseFolder = './database';
    const file = `${foundUser.id}.json`;

    if (selected === 'auf' || selected === 'ab') {
        //read JSON notes
        let notes = JSON.parse(await fs.promises.readFile(`${databaseFolder}/${file}`));

        // sortiert nach Datum (aufsteigend / absteigend)
        selected === 'auf' ? notes.sort((a, b) => new Date(b.date) - new Date(a.date)) : notes.sort((a, b) => new Date(a.date) - new Date(b.date));

        await fs.promises.writeFile(`${databaseFolder}/${file}`, JSON.stringify(notes, null, 2));
        return res.send({
            status: selected === 'auf' ? 'auf' : 'ab',
            message: 'Notiz erfolgreich sortiert',
            notes,
        });
    }

    // if (selected === 'auf') {
    //     //read JSON notes
    //     let notes = JSON.parse(await fs.promises.readFile(`${databaseFolder}/${file}`));

    //     notes.sort((a, b) => new Date(b.date) - new Date(a.date));

    //     await fs.promises.writeFile(`${databaseFolder}/${file}`, JSON.stringify(notes, null, 2));
    //     res.send({
    //         status: 'auf',
    //         message: 'Notiz erfolgreich sortiert',
    //         notes,
    //     });
    // } else if (selected === 'ab') {
    //     //read JSON notes
    //     let notes = JSON.parse(await fs.promises.readFile(`${databaseFolder}/${file}`));
    //     notes.sort((a, b) => new Date(a.date) - new Date(b.date));

    //     await fs.promises.writeFile(`${databaseFolder}/${file}`, JSON.stringify(notes, null, 2));
    //     res.send({
    //         status: 'ab',
    //         message: 'Notiz erfolgreich sortiert',
    //         notes,
    //     });
    // }
};

export const filterNotes = async (req, res) => {
    const { filtered } = req.body;

    const users = await jsonUsers();
    const foundUser = users.find((user) => user.username === req.session.username);
    const databaseFolder = './database';
    const file = `${foundUser.id}.json`;

    if (filtered === 'hohe' || filtered === 'mittlere' || filtered === 'niedrige') {
        //read JSON notes
        let notes = JSON.parse(await fs.promises.readFile(`${databaseFolder}/${file}`));

        let notesFilteredArr = [...notes];

        console.log('--------notesFilteredArr');
        console.log(notesFilteredArr);

        // notesFilteredArr.filter((note) => note.category === filtered);

        // sortiert nach Datum (aufsteigend / absteigend)
        filtered === 'hohe'
            ? (notesFilteredArr = notesFilteredArr.filter((note) => note.category === filtered))
            : filtered === 'mittlere'
            ? (notesFilteredArr = notesFilteredArr.filter((note) => note.category === filtered))
            : (notesFilteredArr = notesFilteredArr.filter((note) => note.category === filtered));

        return res.send({
            status: filtered === 'hohe' ? 'hohe' : filtered === 'mittlere' ? 'mittlere' : 'niedrige',
            message: 'Notiz erfolgreich sortiert',
            notesFilteredArr,
        });
    }

    if (filtered === 'alle') {
        //read JSON notes
        let notes = JSON.parse(await fs.promises.readFile(`${databaseFolder}/${file}`));
        return res.send({
            status: 'alle',
            message: 'Notiz erfolgreich sortiert',
            notes,
        });
    }
};
