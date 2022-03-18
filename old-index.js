// const http = require('http')
require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')

const Note = require('./models/note')

const generateId = () => {
    const maxId = notes.length > 0 
    ? Math.max(...notes.map(note => note.id)) : 0 

    return maxId + 1
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  // check name of error detecting the malformatted id
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id'})
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}
// ------------------


app.use(cors())

app.use(express.json())

app.use(express.static('build'))

// API

//? GET: All notes
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

//? GET: single note
app.get('/api/notes/:id', (request, response, next) => {
  const id = request.params.id
  
  Note.findById(id).then(note => {
    // check the existence of the not
    if(note) { 
      response.json(note)
    } else {
      // if not exist return status 404 not found
      response.status(404).end()
    }
  }).catch(error => next(error))
  // const note = notes.find(note => note.id === id)
  // note ? response.json(note) : response.status(404).end()
})

//? DELETE: single note
app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id

  // using the findByIdAndRemove method 
  // works the same as getting the single note
  Note.findByIdAndRemove(id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))

  // notes = notes.filter(note => note.id !== id)
})

//?POST: create a new note
app.post('/api/notes', (request, response) => {
  const body = request.body

  if(!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  // const note = {
  //   content: body.content,
  //   important: body.important || false,
  //   date: new Date(),
  //   id: generateId()
  // }

  //* prepare the note
  const note = new Note({
    content:body.content,
    important: body.important || false,
    date: new Date(),
  })
  
  // notes = notes.concat(note)
  
  //* save note into database
  note.save().then(savedNote => {
    response.json(savedNote)
  })
})

//? PUT: update single field of one note
app.put('/api/notes/:id', (request, response) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
  // notes = notes.map(note => note.id !== id ? note : request.body)
})

//* detecting an uknown endpoint request
app.use(unknownEndpoint)

//* the error handler has to be the last middleware
app.use(errorHandler)


//* INITIALIZE SERVER
const PORT = process.env.PORT || 4000
app.listen(PORT)
console.log(`Server running on port: ${PORT}`)