const { request, response } = require('express')
const express = require('express')
const cors=require('cors')
const morgan = require('morgan')
const bp = require('body-parser')
const Person = require('./models/phonebook')
require('dotenv').config
const app=express()

app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

app.use(cors())
app.use(express.static('build'))
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}))

morgan.token('data', (request) => {
  return JSON.stringify(request.body)
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons)
    })
})
app.get('/info',(request,response) => {
  Person.countDocuments({})
    .then(count => {
      respond=`<div>
                <p>Phonebook has info for ${count} people</p>
                <p>${Date()}</p>
              </div>`
        response.send(respond)
    })
})
app.get('/api/persons/:id',(request,response,next) => {
    console.log(request.params)
    Person.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
      .then(person => {
          response.json(person.toJSON())
      })
      .catch(error => next(error))
})

app.post('/api/persons',(request,response,next) => {

  if (request.body.name === undefined || request.body.number === undefined) {
    response.status(400).json({ error: 'Missing fields in request' })
  } else {
    const person = new Person({
        name: request.body.name,
        number: request.body.number
    })

    person.save()
        .then(savedPerson => {
            response.json(savedPerson.toJSON())
        })
        .catch(error => next(error))   
    }
})

app.put('/api/persons/:id',(request,response,next) => {
  
  if (request.body.id === undefined || request.body.number === undefined) {
    response.status(400).json({ error: 'Missing fields in request' })
  } else {
    const person = {
        number: request.body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson.toJSON())
        })
        .catch(error => next(error))
  }
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
      return response.status(400).send({ error: 'validation error' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
