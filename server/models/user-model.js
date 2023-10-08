const {Schema, model} = require('mongoose')


// Описание какие поля будет содержать сущность "user"
const UserShema = new Schema({

    email: { type: String, unique: true, required: true },
    password: {type: String, required: true },

    isActivated: {type: Boolean, default: false }, // подтверждение почты
    activationLink: {type: String}                 // ссылка для активации

})

module.exports = model('User', UserShema)