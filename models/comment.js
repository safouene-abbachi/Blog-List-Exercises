const mongoose = require('mongoose');

const commentShema = new mongoose.Schema({
  title: {
    type: String,
    isRequired: true,
  },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
  },
});
commentShema.set('toJSON', {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Comment', commentShema);
