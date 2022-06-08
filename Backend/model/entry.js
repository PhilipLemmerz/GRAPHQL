const mongoose = require('mongoose');
const Schema  =  mongoose.Schema;

const entrySchema =  new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  }
})


module.exports = mongoose.model('entry', entrySchema);
