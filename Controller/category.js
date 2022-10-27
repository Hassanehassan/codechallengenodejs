const { validationResult } = require('express-validator');
const category = require('../Module/Category');
const note = require('../Module/note');
const User = require('../Module/User');

exports.getAllCategory=(req, res, next) =>{
    category.find()
    .select('notes title -_id')
    .populate('notes','title description tags -_id')
    .then(categories=>{
        res.status(200).json({
            message:'Fetched category successfully',
            category:categories,
          })
        })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    })
}

exports.createCategory = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }
    const title = req.body.title;
    let creator;
    const Category = new category({
        title: title,
        creator:req.userId
      });
      Category
      .save()
      .then(result => {
        return User.findById(req.userId)
      })
      .then(user=>{
        creator=user;
        user.categories.push(Category);
        return user.save()
      })
      .then(result=>{
        res.status(201).json({
          message: 'category created successfully!',
          category: Category,
          creator:{_id:creator._id,name:creator.name}
        });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
};

exports.updateCateg = (req, res, next) => {
  const categId = req.params.categoryId;
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      const error = new Error('Validation failed');
      error.statusCode = 422;
      throw error;
  }
  const title = req.body.title;
  category.findById(categId)
    .then(categ => {
      if(!categ){
          const error = new Error('Could not find category.');
          error.statusCode = 404;
          throw error;
      } 
      if(categ.creator.toString() !== req.userId){
        const error=new Error('not authorized');
        error.statusCode=403;
        throw error;
      }
      categ.title = title;
      return categ.save();
    })
    .then(result => {
      res.status(200).json({message: 'Category updated.', category: result});
    })
    .catch(err => {
      if(!err.statusCode){
          err.statusCode = 500
      }
      next(err);
    })
}

exports.deleteCateg = (req, res, next) => {
  const categId = req.params.categoryId;
  category.findById(categId)
    .then(categ => {
      if(!categ){
          const error = new Error('Could not find category.');
          error.statusCode = 404;
          throw error;
      }
      if(categ.creator.toString() !== req.userId){
        const error=new Error('not authorized');
        error.statusCode=403;
        throw error;
      }
      return note.deleteMany({category:categId});
    })
    .then(result=>{
      return category.findByIdAndRemove(categId);
    })
    .then(result => {
      return User.findById(req.userId)
    })
    .then(user=>{
      user.categories.pull(categId);
      return user.save()
    })
    .then(result=>{
      res.status(200).json({message: 'Deleted calegory.'})
    })
    .catch(err => {
      if(!err.statusCode){
          err.statusCode = 500
      }
      next(err);
    })
}

exports.getCategory = (req, res, next) => {
  const categId = req.params.categoryId;
  category.findById(categId, {notes: 1, title:1 ,_id: 0})
    .populate('notes','title description tags -_id')
    .then(categ => {
          if(!categ){
          const error = new Error('Could not find category.');
          error.statusCode = 404;
          throw error;
        };
      res.status(200).json({ message:'Category fetched.', category: categ })
      }) 
    .catch(err => {
      if(!err.statusCode){
          err.statusCode = 500;
      }
      next(err);
    })
};