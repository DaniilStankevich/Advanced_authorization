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

        console.log(email, password, '-сервис рег')


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

        console.log('Завеешение')

        return {
            ...tokens,
            user: userDTO
        }
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({activationLink})
        if(!user){
            throw ApIError.BadRequest('Неккореетная ссылка активации')
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

        // Cравнение захешированного паролья в БД, с паролем от пользователя
        const isPassEquals = await bcrypt.compare(password, user.password)
        if(!isPassEquals) {
            throw ApIError.BadRequest('Неверный пароль') 
        }

        const userDTO = new userDto(user)
        const tokens = tokenService.generateTokens({...userDTO}) // нужно передавать какую-то информацию о пользователе но не пароль
        await tokenService.saveToken(userDTO.id, tokens.refreshToken)


        return {
            ...tokens,
            user: userDTO
        }
    }
    
    async logout(refreshToken ) {
        const token = await tokenService.removeToken(refreshToken)
        return token
    }

    // Перезапись токена
    async refresh(refreshtoken) {

        console.log(refreshtoken,'-реф')

        if(!refreshtoken) {
            throw ApIError.UnavthorizedError()
        }

        const userData = tokenService.validateRefreshToken(refreshtoken)
        const tokenFromDb = await tokenService.findToken(refreshtoken)

        if(!userData | !tokenFromDb) {
            throw ApIError.UnavthorizedError()
        }

        // Так как за 60 дней кака-то фионмарция о user моггла измениться 
        // то необходимо в токен заложить новую информацию
        const user = await UserModel.findById(userData.id) 
        const userDTO = new userDto(user)
        const tokens = tokenService.generateTokens({...userDTO}) // нужно передать какую-то информацию о пользователе, но не пароль
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