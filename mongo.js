// node mongo.js windows8
const mongoose = require('mongoose')
let insertFlag = false

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

if (process.argv.length === 3) {
  insertFlag = false
}

if (process.argv.length === 5) {
  insertFlag = true
}

const password = process.argv[2]
const url = `mongodb+srv://fullstack:${password}@phonebook-ubsqm.mongodb.net/phonebook?retryWrites=true&w=majority`
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})
const Person = mongoose.model('Person', personSchema)

if (insertFlag === true) {
  let newName = process.argv[3]
  let newNumber = process.argv[4]
  const person = new Person({
    name: newName,
    number: newNumber
  })

  person.save().then(response => {
    console.log(response)
    mongoose.connection.close()
  })
}

else {
  console.log('phonebook:')
  Person.find({}).then(result => {
    //console.log("TESTING: ", result)
    result.forEach(person => {console.log(person.name, person.number)})
    mongoose.connection.close()
  })
}

/*
const p1 = new Person(persons[0])

p1.save().then(response => {
    console.log('person saved!')
    mongoose.connection.close()
  })
*/