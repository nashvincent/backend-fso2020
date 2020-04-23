require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')   //($env:MONGODB_URL = "mongodb+srv://fullstack:windows8@phonebook-ubsqm.mongodb.net/phonebook?retryWrites=true&w=majority") -and (npm start)

const app = express()

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.static('build'))
app.use(express.json())
app.use(cors())

morgan.token('type', function (request) { return JSON.stringify(request.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type' ))

app.get('/', (response) => {
  response.send('<h1>Hello World</h1>')
})

app.get('/info', (request, response, next) => {
  Person.find({})
    .then(personList => {
      response.send(`
      <p>Phone book has info for ${personList.length} people </p> 
      <p>${Date()}</p>
      `)
    })
    .catch(error => next(error))

})

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(person => {
      response.json(person)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Person.findById(id)
    .then(person => response.json(person.toJSON()))
    .catch(error => next(error))
  
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Person.findByIdAndDelete(id)
    .then(result => response.status(204).end())
    .catch(error => next(error))

  // if (persons.some(person => person.id === id)) {
  //   persons = persons.filter(person => person.id !== id)  
  //   response.status(204).end()
  // }
  
  // else {
  //   response.status(404).end()
  // }

})

app.post('/api/persons/', (request, response) => {
  const body = request.body
  
  const person = new Person ({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedPerson => response.json(savedPerson.toJSON()))
    .catch(error => {
      
      response.status(400).json({ error: error.message })
    })
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const id = request.params.id

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(id, person, { new: true })
    .then(updatedPerson => response.json(updatedPerson.toJSON()))
    .catch(error => next(error))
})

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log('\nERROR HANDLER')
  console.log(error.message, error.name)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
