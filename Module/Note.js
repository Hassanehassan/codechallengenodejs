const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const noteSchema = new Schema({
  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  category:{
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  
  tags:[{
      type: String,
      required: true
  }]
  
},{timestamps:true});

noteSchema.index({tags : 1});

module.exports = mongoose.model('Note', noteSchema);