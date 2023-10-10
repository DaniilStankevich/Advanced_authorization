const UserModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const mailService = require('./mail-service')
const tokenService = require('./token-service')
const userDto = require('../dtos/user-dto')
const ApIError = require('../exceptions/api-error')


// Сервис для работы с пользователями 
class UserSevice {

    async registration (email, password) {

        const candidate = await UserModel.findOne({email}) // поиск пользовтеля по email
        if(candidate) {
            throw ApIError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`) 
        }


        
        const hashPassword = await bcrypt.hash(password, 3)  // шифрование пароля перед отправкой в БД
        const activationLink = uuid.v4()                     // ссылка по которой пользователь будет подтверждать аккаунт v34f-asfst-124saf

        // Сохранение пользователя в БД
        const user = await UserModel.create({ email, password: hashPassword, activationLink}) 

        // Отправка письма на почту
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`)
        const userDTO = new userDto(user) // id, email, isActivated

        // Генерация двух токенов
        const tokens = tokenService.generateTokens({...userDTO}) // нужно передавать какую-то информацию о пользователе но не пароль

        // Сохранение refreshToken токена в БД
        await tokenService.saveToken(userDTO.id, tokens.refreshToken)

        return {
            ...tokens,
            user: userDTO
        }
    }



    async activate(activationLink) {
        const user = await UserModel.findOne({activationLink})
        if(!user){
            return ApiError.BadRequest('Неккореетная ссылка активации')
        }


        user.isActivated = true // ссылка в БД этого пользователя становится "true"
        await user.save()       // сохранение в БД


    }



}

module.exports = new UserSevice()