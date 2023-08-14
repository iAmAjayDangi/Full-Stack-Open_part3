require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const Person = require('./models/person')

const app = express()

app.use(cors())

app.use(express.json())

app.use(express.static('build'))

morgan.token('body', (request, response) =>{
    return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (request, response)=>{
    Person.find({}).then(result =>{
        response.json(result)
    })
})

app.get('/api/persons/:id', (request, response)=>{
    
    Person.findById(request.params.id).then(person =>{
        if(person){
            response.json(person)
        }
        else{
            response.status(404).end()
        }
    }).catch(error =>{
        console.log(error)
        response.status(400).send({error: 'malformatted id'})
    })

})

app.get('/info', (request, response)=>{
    const time = new Date()

    Person.count({}).then(count =>{
        response.send(`<p>Phonebook has info for ${count} people</p><p>${time}</p>`)
    })
})

app.delete('/api/persons/:id', (request, response)=>{
    Person.findByIdAndRemove(request.params.id).then(result =>{
        response.status(204).end()
    }).catch(error =>{
        console.log(error)
        response.status(400).send({error: 'malformatted id'})
    })

})


const personExists = (name) =>{
    const person = persons.find(person => person.name === name)
    if(person){
        return true
    }
    return false
}

app.post('/api/persons', (request, response) =>{
    const body = request.body

    if(!body.name || !body.number){
        return response.status(400).json({
            error: 'Either name or number is missing or both'
        })
    }

    // if(personExists(body.name)){
    //     return response.status(400).json({
    //         error: 'name must be unique'
    //     })
    // }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson =>{
        response.json(savedPerson)
    })

})

const PORT = process.env.PORT

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})