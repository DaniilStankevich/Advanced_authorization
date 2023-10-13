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
        const activationLink = uuid.v4()                     // ссылка по которой пользователь будет подтверждать аккаунт

        // Сохранение пользователя в БД
        const user = await UserModel.create({ email, password: hashPassword, activationLink}) 

        // Отправка письма на почту
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`)
        const userDTO = new userDto(user) // id, email, isActivated

        // Генерация двух токенов
        const tokens = tokenService.generateTokens({...userDTO}) // нужно передавать какую-нибудь информацию о пользователе но не пароль

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
            throw ApIError.BadRequest('Неккоректная ссылка активации')
        }
        user.isActivated = true // ссылка в БД этого пользователя становится "true"
        await user.save()       // сохранение в БД
    }


    async login(email, password) {
        // Поиск пользователя в БД
        const user = await UserModel.findOne({email})
        if(!user) {
            throw ApIError.BadRequest('Пользователь с таким email не найден') 
        }

        // Cравнение захешированного пароля в БД с паролем пришедшего от клиента
        const isPassEquals = await bcrypt.compare(password, user.password)
        if(!isPassEquals) {
            throw ApIError.BadRequest('Неверный пароль') 
        }

        const userDTO = new userDto(user)
        const tokens = tokenService.generateTokens({...userDTO})   
        await tokenService.saveToken(userDTO.id, tokens.refreshToken)
        return {
            ...tokens,
            user: userDTO
        }
    }
    

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken)
        return token
    }


    async refresh(refreshtoken) {
        if(!refreshtoken) {
            throw ApIError.UnavthorizedError()
        }

        const userData = tokenService.validateRefreshToken(refreshtoken)
        const tokenFromDb = await tokenService.findToken(refreshtoken)

        if(!userData | !tokenFromDb) {
            throw ApIError.UnavthorizedError()
        }

        // Так как за 30 дней кака-то информация о user могла измениться 
        // то необходимо в токен заложить новую информацию
        const user = await UserModel.findById(userData.id) 
        const userDTO = new userDto(user)
        const tokens = tokenService.generateTokens({...userDTO})      
        await tokenService.saveToken(userDTO.id, tokens.refreshToken)
        return {
            ...tokens,
            user: userDTO
        }
    }


    async getAllusers() {
        const useres = UserModel.find()
        return useres
    }
}

module.exports = new UserSevice()