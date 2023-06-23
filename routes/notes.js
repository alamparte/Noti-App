import { Router } from 'express';
import { dashboard, showNotes, createNoteForm, createNote, viewNoteForm, editNote, deleteNote } from '../controllers/notesController.js';

import { checkNoAuth, checkAuth } from '../middleware/auth.js';

const router = Router();
//checkAuth hace lo mismo q el middleware q hice en server

// GET dashboard
router.get('/dashboard', dashboard);
// GET notes or empty notes dashboard
router.get('/dashboard/notes', showNotes);
// // GET note Form
router.get('/dashboard/noteform', createNoteForm);
// // POST create a new note
router.post('/dashboard/noteform', createNote);





///----------------------------------------------------------
// // GET note Form edit
router.get('/view-note/:id', viewNoteForm);
// // POST note Form edit
router.post('/view-note/:id', editNote);
router.get('/delete-note/:id', deleteNote);
// // ai pongo /client, no me carga el js/css porque???
// // router.post('/client/edit-note/:id', editNote);

export { router };

// PARA AGREGARLE FECHA
// const months = [
//     'Jan',
//     'Feb',
//     'Mar',
//     'Apr',
//     'May',
//     'June',
//     'July',
//     'Aug',
//     'Sept',
//     'Oct',
//     'Nov',
//     'Dec',
// ];
// let dateObj = new Date(),
//     month = months[dateObj.getMonth()],
//     day = dateObj.getDate(),
//     year = dateObj.getFullYear();

// date: `${month} ${day}, ${year} `
