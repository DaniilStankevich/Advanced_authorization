const {Schema, model} = require('mongoose')


// Схема хранение refresh токена, id пользователя, 
const TokenShema = new Schema({

    user: {type: Schema.Types.ObjectId, ref: 'User' },  //ссылка на пользователя
    refreshToken: {type: String, required: true}        //refreshToken для этого пользователя          

})

module.exports = model('user', TokenShema) 