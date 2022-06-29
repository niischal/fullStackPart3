const mongoose = require('mongoose')

const password = process.argv[2]

const url=`mongodb+srv://FullStack:${password}@cluster0.d2j6ll3.mongodb.net/Phonebook?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})
const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 3){
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
} else if (process.argv.length === 3) {
    mongoose
        .connect(url)
        .then(()=>{
            Person.find({}).then(result => {
                result.forEach(person => {
                console.log(person)
        })
        mongoose.connection.close()
      })
    })
} else {
    mongoose
        .connect(url)
        .then((result) => {
            console.log('connected')

            const person = new Person({
                name: process.argv[3],
                number: process.argv[4]
            })
            return person.save()
        })
        .then(() => {
            console.log('Saved')
            return mongoose.connection.close()
        })
        .catch((err)=> console.log(err))
}
