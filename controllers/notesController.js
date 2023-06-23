import fs from 'fs';
import { nanoid } from 'nanoid';

// read JSON notes
const jsonNotes = async () => {
    try {
        return JSON.parse(await fs.promises.readFile('database/notes.json'));
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
        // const users = await jsonUsers();
        // const foundUser = users.find(
        //     (user) => user.username === req.session.username
        // );
        // const databaseFolder = './database';
        // let files = fs.readdirSync(databaseFolder);
        // if (foundUser) {
        //     for (const file of files) {
        //         if (file === `${foundUser.id}.json`) {
        //             let notes = JSON.parse(
        //                 await fs.promises.readFile(
        //                     `/${databaseFolder}/${foundUser.id}.json`
        //                 )
        //             );
        //             // fs.readFile(
        //             //     `/${databaseFolder}/${foundUser.id}.json`,
        //             //     (err, data) => {
        //             //         // if (err) throw err;
        //             //         let notes = JSON.parse(data);
        //             //         res.send({ status: 'success', notes });
        //             //     }
        //             // );
        //             return res.send({ status: 'success', notes });
        //         } else {
        //             return res.send({
        //                 status: 'failed',
        //                 message: 'keine Notiz gefunden',
        //             });
        //         }
        //     }
        // }

        const users = await jsonUsers();
        const foundUser = users.find((user) => user.username === req.session.username);
        const notes = await jsonNotes();
        const notesFiltered = notes.filter((item) => item.userId === foundUser.id);
        console.log(notesFiltered);
        if (notesFiltered.length > 0) {
            res.send({ status: 'success', notesFiltered });
        } else {
            res.send({
                status: 'failed',
                message: 'keine Notiz gefunden',
            });
        }
    } catch (error) {
        console.log(error);
        throw new Error();
    }
};

// // POST notes
export const createNote = async (req, res) => {
    const { titel, description, category } = req.body;
    // console.log(titel, description, category);
    try {
        // read JSON notes
        const notes = await jsonNotes();
        // read JSON users
        const users = await jsonUsers();
        const foundUser = users.find((user) => user.username === req.session.username);
        console.log(foundUser);
        // me faltaba el && description, capaz ahi estaba el eeerror
        if (foundUser && titel !== '' && titel && description !== '' && description) {
            notes.push({
                id: nanoid(),
                userId: foundUser.id,
                titel,
                description,
            });
            await fs.promises.writeFile('database/notes.json', JSON.stringify(notes, null, 2));
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
    } catch (error) {
        throw new Error();
    }
};

// export const createNoteForm = async (req, res) => {
//     const { titel, description } = req.body;
//     // console.log(titel, description);
//     try {
//         // read JSON notes
//         const notes = await jsonNotes();
//         // read JSON users
//         const users = await jsonUsers();
//         const foundUser = users.find(
//             (user) => user.username === req.session.username
//         );
//         // console.log(foundUser);
//         // me faltaba el && description, capaz ahi estaba el eeerror
//         if (titel !== '' && titel && description !== '' && description) {
//             notes.push({
//                 id: nanoid(),
//                 userId: foundUser.id,
//                 titel,
//                 description,
//             });
//             await fs.promises.writeFile(
//                 'database/notes.json',
//                 JSON.stringify(notes, null, 2)
//             );
//             return res.send({
//                 status: 'success',
//                 message: 'nota creada correctamente',
//             });
//         }
//         // else{
//         //     //scar el required de html y validarlo popr aca
//         // }
//     } catch (error) {
//         throw new Error();
//     }
// };

// // POST notes
// export const createNote = async (req, res) => {
//     const { titel, description } = req.body;
//     // console.log(titel, description);
//     try {
//         // read JSON notes
//         const notes = await jsonNotes();
//         // read JSON users
//         const users = await jsonUsers();
//         const foundUser = users.find(
//             (user) => user.username === req.session.username
//         );
//         // console.log(foundUser);
//         if (titel !== '' && description !== '') {
//             notes.push({
//                 id: nanoid(),
//                 user: foundUser.id,
//                 titel,
//                 description,
//             });
//             await fs.promises.writeFile(
//                 'database/notes.json',
//                 JSON.stringify(notes, null, 2)
//             );
//             return res.send({
//                 status: 'success',
//                 message: 'nota creada correctamente',
//             });
//         }
//         // else{
//         //     //scar el required de html y validarlo popr aca
//         // }
//     } catch (error) {
//         throw new Error();
//     }
// };
// // // PUT notes
// // export const editNote = async (req,res)=>{}

// GET verFormEdit
export const viewNoteForm = async (req, res) => {
    console.log('id--------- ', req.params.id);
    // const idNote = req.params.id;

    // res.render('editNote', { idNote });

    const notes = await jsonNotes();

    const foundNote = notes.find((note) => note.id === req.params.id);
    // console.log('foundNote-------------------------------------');
    // console.log(foundNote);
    if (foundNote) {
        res.render('editNote', { foundNote });
    } else {
        res.send({ status: 'failed' });
    }
};

// //POST notes
export const editNote = async (req, res) => {
    //old note
    console.log('id--------- ', req.params.id);
    //new note
    const { titel, description } = req.body;
    console.log('new note----------------------');
    console.log(titel, description);
    // read JSON users
    const users = await jsonUsers();
    const foundUser = users.find((user) => user.username === req.session.username);
    //read JSON notes
    const notes = await jsonNotes();

    // const foundNote = notes.find((note) => note.id === req.params.id);
    // console.log('foundNote-------------------------------------');
    // console.log(foundNote);
    let index = notes.findIndex((e) => e.id === req.params.id);
    console.log('index ---- ', index);
    let itemRemoved = notes.splice(index, 1);
    console.log('itemRemoved');
    // console.log(itemRemoved);
    // let itemRemoved = data.splice(
    //     data.findIndex((e) => e.id == targetBtnParent.id),
    //     1
    // );

    // ALGO esta mal con este if ??????
    // if (titel !== '' && description !== '') {
    notes.push({
        id: nanoid(),
        userId: foundUser.id,
        titel,
        description,
    });
    await fs.promises.writeFile('database/notes.json', JSON.stringify(notes, null, 2));
    return res.send({
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
