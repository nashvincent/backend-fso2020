const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => console.log("Connected to MongoDB"))
    .catch(error => console.log('error connecting to MongoDB', error.message))

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        minlength: 3
    },
    number: {
        type: String,
        required: true,
        minlength: 8
    },
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true);

personSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Person', personSchema)