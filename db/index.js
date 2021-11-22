const mongoose = require('mongoose')

MONGO_URL = 'mongodb+srv://admin:admin@cluster0.26cwk.mongodb.net/help-result?retryWrites=true&w=majority'

const mongoConnect = () => {
    mongoose.connect(
        MONGO_URL,
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    mongoose.Promise = global.Promise
    mongoose.connection.on('error', console.error.bind(console, 'MongoDBconnection error:'))
}
mongoConnect()