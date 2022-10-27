const { validationResult } = require('express-validator');
const Note = require('../Module/note');
const Categ=require('../Module/Category');

exports.CreateNotes=(req, res, next) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }
    const title=req.body.title;
    const description=req.body.description;
    const tag=req.body.tags;
    const categId=req.params.categoryId;
    const note= new Note({
        title:title,
        description:description,
        creator:req.userId,
        category:categId,
        tags:tag
    });
    Categ.findById(categId)
    .then(categ=>{
        if(!categ){
            const error = new Error('Could not find category.');
            error.statusCode = 404;
            throw error;
        }
        categ.notes.push(note);
        categ.save();
        return note.save()
    })
    .then(result=>{
        console.log(result);
        res.status(201).json({
            message:'note created successfuly',
            note:result 
        })
    })
    .catch(err=>{
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err); 
    })
}

exports.getNotes = (req, res, next) => {
    Note.find().select('title description tags category -_id')
    .populate('creator','name -_id')
    .populate('category','title -_id')
    .sort({updatedAt : -1})
    .then(notes => {
    res.status(200).json({ message: 'Fetched notes successfully.', notes: notes });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getNote = (req, res, next) => {
    const noteId = req.params.noteId;
    Note.findById(noteId)
    .select('title content tags category -_id')
    .populate('creator','name -_id')
    .populate('category','title -_id')
    .then(note => {
        if(!note){
            const error = new Error('Could not find note.');
            error.statusCode = 404;
            throw error;
        };
        res.status(200).json({ message:'Note fetched.', note: note })
    }) 
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err);
    })
};

exports.updateNote=(req,res,next)=>{
    const noteid=req.params.noteId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }
    const title=req.body.title;
    const description=req.body.description;
    const tag=req.body.tags.items;

    Note.findById(noteid)
    .then(note=>{
        if(!note) {
            const error=new Error('could not find note.');
            error.statusCode=404;
            throw error;
        }
        if(note.creator.toString() !== req.userId){
          const error=new Error('not authorized');
          error.statusCode=403;
          throw error;
        }
        note.title=title;
        note.description=description;
        note.tags=tag;

        return note.save()
    })
    .then(result=>{
        res.status(200).json({message:'note updated',note:result})
    })
    .catch(err=>{
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);

    })
};

exports.deleteNote = (req, res, next) => {
    const noteId = req.params.noteId;
    Note.findById(noteId)
    .then(note =>{
        if(!note) {
          const error=new Error('could not find note.');
          error.statusCode=404;
          throw error;
        }
        if(note.creator.toString() !== req.userId){
          const error=new Error('not authorized');
          error.statusCode=403;
          throw error;
        }
        return Categ.findById(note.category);
    })
    .then(categ => {
        if(!categ) {
          const error = new Error('could not find category.');
          error.statusCode = 404;
          throw error;
        }
        categ.notes.pull(noteId) ;
        categ.save();
        return Note.findByIdAndRemove(noteId);
    })
    .then(result=>{
        res.status(200).json({message:'Delete note successfully.'})
      })
      .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    })
};

exports.getNotesByTag=(req,res,next)=>{
  const tag = req.params.tag;
  Note.find({tags : tag})
  .select('title description tags category -_id')
  .populate('creator','name -_id')
  .sort({updatedAt : -1})
  .then(notes => {
      res.status(200).json({
        message: 'Fetched notes by this tag successfully.',
        notes: notes
      })
  })
  .catch(err => {
      if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err);
  })
}






