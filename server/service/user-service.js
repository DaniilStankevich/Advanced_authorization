const UserModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const mailService = require('./mail-service')
const tokenService = require('./token-service')
const userDto = require('../dtos/user-dto')



// Сервис для работы с пользователями 
class UserSevice {

    async registration (email, password) {

        const cadidate = await UserModel.findOne({email}) // поиск пользовтеля по email
        if(cadidate) {
            throw new Error('Пользователь с таким именем уже существует')
        }

        const hashPassword = await bcrypt.hash(password, 3)     // шифрование пароля перед отправкой в БД

        const activationLink = uuid.v4() // ссылка по которой пользователь будет подтверждать аккаунт v34f-asfst-124saf

        // Сохранение пользователя в БД
        const user = await UserModel.create({ email, password: hashPassword, activationLink}) 

        // Отправка письма на почту
        await mailService.sendActivationMail(email, activationLink)

        const userDTO = new userDto(user) // id, email, isActivated

        console.log(userDTO, '- объект из коструктора')

        // Генерация двух токенов
        const tokens = tokenService.generateTokens({...userDTO}) // нужно передавать какую-то информацию о пользователе но не пароль
        console.log(tokens, '- токены')

        // Сохранение этих токенов
        await tokenService.saveToken(userDTO.id, tokens.refreshToken)

        return {
            ...tokens,
            user: userDTO
        }

    }
}

module.exports = new UserSevice()