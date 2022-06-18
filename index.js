const { request, response } = require('express')
const express = require('express')
const { token } = require('morgan')
const app=express()
const morgan = require('morgan')
let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(express.json())
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


app.get('/api/persons', (request, response) => {
    response.json(persons)
})
app.get('/info',(request,response) => {
    let requestRecievedTime=new Date()
    const info = `<p>Phonebook has info for ${persons.length} people</p>
                <p>${requestRecievedTime}</p>`
    response.send(info)
})
app.get('/api/persons/:id',(request,response) => {
    const id=Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) response.json(person)
    else response.status(404).end()
})

app.delete('/api/persons/:id', (request,response) => {
  const id=Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) response.status(204).end()
    else response.status(404).end()
})

app.post('/api/persons',(request,response) => {
  const person =request.body
  morgan.token(JSON.stringify(person))
  person.id=Math.floor((Math.random() * 100) + 1)
  if (!person.name || !person.number){
    response.status(409).json({error:'content missing'})
  }
  else if(persons.find(p=>p.name===person.name)){
    response.status(400).json({error:'name must be unique'})
  }
  else {
    response.json(person)

  }
})

const PORT = 3001 
app.listen(PORT)