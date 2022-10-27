const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const noteroute=require("../Controller/note");

const isAuth=require('../Middlware/is-Auth');

router.get("/notes",isAuth,noteroute.getNotes);

router.get("/notes/:noteId",isAuth,noteroute.getNote);

router.get("/notes/:tag",isAuth,noteroute.getNotesByTag);

router.post("/note/:categoryId", [
    body('title')
      .trim()
      .isLength({ min: 5 }),
    body('description')
      .trim()
      .isLength({ min: 5 }),
    body('tags')
      .not()
      .isEmpty()
  ],isAuth,noteroute.CreateNotes);
  
router.put('/note/:noteId', [
    body('title')
      .trim()
      .isLength({ min: 5 }),
    body('description')
      .trim()
      .isLength({ min: 5 }),
    body('tags')
      .not()
      .isEmpty()
  ],isAuth,noteroute.updateNote);

router.delete('/note/:noteId',isAuth,noteroute.deleteNote);

module.exports = router;