const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  categories:[{
    type: Schema.Types.ObjectId,
    ref: 'Category',
    default:[] 
  }]
});

module.exports = mongoose.model('User', userSchema);