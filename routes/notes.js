import { Router } from 'express';
import {
    dashboard,
    showNotes,
    createNoteForm,
    createNote,
    viewNoteForm,
    editNote,
    deleteNote,
    sortNotes,
    filterNotes,
    sucheNotes,
    resetFilter,
} from '../controllers/notesController.js';

const router = Router();

// dashboard route
router.get('/dashboard', dashboard);
// notes or empty message in dashboard route
router.get('/dashboard/notes', showNotes);
// create note route
router.get('/dashboard/noteform', createNoteForm);
router.post('/dashboard/noteform', createNote);
// edit note route
router.get('/dashboard/view-note/:id', viewNoteForm);
router.post('/dashboard/view-note/:id', editNote);
// delete note route
router.get('/dashboard/delete-note/:id', deleteNote);
// note sort route
router.get('/dashboard/sort-notes', sortNotes);
// note filter route
router.get('/dashboard/filter-notes', filterNotes);
// note search route
router.get('/dashboard/search-notes', sucheNotes);
// reset filtern route
router.get('/dashboard/reset-filter', resetFilter);

export { router };
