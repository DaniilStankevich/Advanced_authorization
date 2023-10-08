require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors')  // для беспроблемных отправок запроса из браузера
const cookieParser = require('cookie-parser') 
const router = require('./router/index')

// Создание экзепляра приложения цуацуа
const app = express()
const PORT = process.env.PORT | 5000

app.use(express.json())
app.use(cookieParser())  // для обратоки cookie в каждом запросе
app.use(cors())          // позволяет принимать запросы  от любого источника
app.use('/api', router)

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};


const start = async () => { 

    try {
        await mongoose.connect(process.env.DB_URL ,options );
        app.listen(PORT, () => console.log(`Server started on ${PORT} port`))

    } catch(e) {
        console.log(e, 'бэд)')
    }
}

start()

//const { MongoClient, ServerApiVersion } = require('mongodb');
