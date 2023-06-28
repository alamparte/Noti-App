import { Router } from 'express';
import { dashboard, showNotes, createNoteForm, createNote, viewNoteForm, editNote, deleteNote, sortNotes, filterNotes } from '../controllers/notesController.js';

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
router.get('/dashboard/view-note/:id', viewNoteForm);
// // POST note Form edit
router.post('/dashboard/view-note/:id', editNote);
router.get('/dashboard/delete-note/:id', deleteNote);

//sortieren
router.post('/dashboard/sort-notes', sortNotes);
//filtern
router.post('/dashboard/filter-notes', filterNotes);



export { router };
