// const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2022-05-30T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2022-05-30T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2022-05-30T19:20:14.298Z",
    important: true
  }
]

const generateId = () => {
    const maxId = notes.length > 0 
    ? Math.max(...notes.map(note => note.id)) : 0 

    return maxId + 1
}

// ------------------
app.use(cors())

app.use(express.json())

app.get('/', (request, response) => {
  response.send('<h1>HELLO</h1>')
})
app.get('/api/notes', (request, response) => {
  response.send(notes)
})
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)

  note ? response.json(note) : response.status(404).end()
})
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})
app.post('/api/notes', (request, response) => {
  const body = request.body

  if(!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }


  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId()
  }

  notes = notes.concat(note)

  response.json(note)

})

app.put('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  console.log(request.body)

  notes = notes.map(note => note.id !== id ? note : request.body)

  response.json(request.body)
})

const PORT = process.env.PORT || 4000
app.listen(PORT)
console.log(`Server running on port: ${PORT}`)