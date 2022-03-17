// Mongodb connection with mongoose
const mongoose = require('mongoose')

const url = process.env.MONGO_URI
console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to mongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB', error.message)
  })


// Note model schema
// declare model
const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})
// modify json method to get the correct schema
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
// register the model
module.exports = mongoose.model('Note', noteSchema)

