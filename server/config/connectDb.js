const mongoose = require('mongoose')

exports.connectDb = async () => {
    try {
        const dbUrl = `mongodb://127.0.0.1:27017/${process.env.DBNAME}`
        const connect = await mongoose.connect(dbUrl, {})
        console.log(
            'Database connection host: ', 
            connect.connection.host, 
            ' | ', 
            'Database connection name: ',
            connect.connection.name
        )
    } catch (error) {
        console.log(error)
        process.exit(1)
    }

}

