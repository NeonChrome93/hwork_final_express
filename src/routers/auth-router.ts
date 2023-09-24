import {Request, Response, Router} from "express";
import {userService} from "../domain/users-servise";
import {validationLoginAuth} from "../middlewares/validations/auth-logiin-validation";
import {jwtService} from "../application/jwt-service";
import {authMiddleware} from "../middlewares/auth";
import {validationCreateUser} from "../middlewares/validations/user-create-validation";
import {authService} from "../domain/auth-service";
import nodemailer from "nodemailer";
import {confirmationCodeValidator} from "../middlewares/validations/confirmation-code-validator";
import {usersRepository} from "../repositories/users/users-repository-database";
import {confirmationEmailValidation} from "../middlewares/validations/confirmation-email-validation";
import {userRegistrationEmailValidation} from "../middlewares/validations/user-registration-email-validation";
import {randomUUID} from "crypto";

export const authRouter = Router({})

authRouter.post('/login',
    ...validationLoginAuth,
    async (req: Request, res: Response) => {

        //req.body.loginOrEmail
        //req.body.password
        const {loginOrEmail, password} = req.body
        const user = await userService.checkCredentials(loginOrEmail, password)
        if (user) {
            let deviceId = randomUUID()// придумать deviceId

            // взять дату выписки этого токена === lastActiveDate у девайся
            // сохранить девайс (ip, id, userid, title, lastActiveDate) => swagger
            // отдать токены

            const accessToken = jwtService.createJWT(user);
            const refreshToken = jwtService.generateRefreshToken(user, deviceId); // создать токен с userId & deviceId

            res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true});

            res.status(200).send({accessToken: accessToken})

        } else {
            res.sendStatus(401)
        }
    })

authRouter.post('/refresh-token', async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken + ''
    console.log(req.headers,req.cookies)


    if (refreshToken) {
        // Генерация новых токенов на основе переданных данных, например, идентификатора пользователя
        //Проверить нет ли рефреш токена в черном списке
        const blockedToken = await authService.findRefreshTokenToBlacklist(refreshToken)
        if(blockedToken ) return res.sendStatus(401)
        const userId = jwtService.getUserIdByToken(refreshToken)
        if (!userId) return res.sendStatus(401)
        console.log({userId})
        const user = await usersRepository.readUserById(userId.toString())
        if (!user) return res.sendStatus(401)
        await usersRepository.addRefreshTokenToBlacklist(refreshToken)
        const accessToken = jwtService.createJWT(user);
        const  newRefreshToken = jwtService.generateRefreshToken(user);

        // Создать метод в репозитории и туда кинуть старый рефрещ токен
        //res.cookie('accessToken', accessToken, {httpOnly: true, secure: true});
        res.cookie('refreshToken', newRefreshToken, {httpOnly: true, secure: true});

        res.status(200).send({accessToken: accessToken})
    } else {
        return res.sendStatus(401)
    }

})
authRouter.post('/logout', async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken

    //123
    //wertwergwvb r
    //123
    //wertwergwvb r

    if (refreshToken) {

        const blockedToken = await authService.findRefreshTokenToBlacklist(refreshToken)
        if(blockedToken ) return res.sendStatus(401)
        const userId = jwtService.getUserIdByToken(refreshToken)
        if (!userId) return res.sendStatus(401)
        await usersRepository.addRefreshTokenToBlacklist(refreshToken)
        //помещаем токен в чс

        res.sendStatus(204)
    } else {
        return res.sendStatus(401)
    }


})


authRouter.post('/registration', ...userRegistrationEmailValidation, async (req: Request, res: Response) => {


    await authService.registrationUser({
        login: req.body.login,
        email: req.body.email,
        password: req.body.password,
        //message: req.body.message
    })
    return res.sendStatus(204);

})

authRouter.post('/registration-confirmation', ...confirmationCodeValidator, async (req: Request, res: Response) => {
    const isConfirmed = await authService.confirmEmail(req.body.code)
    if (isConfirmed) {
        res.sendStatus(204)
    } else res.sendStatus(400)
})


authRouter.post('/registration-email-resending', ...confirmationEmailValidation, async (req: Request, res: Response) => {
    const receivedСode = await authService.resendingCode(req.body.email)
    if (receivedСode) {
        res.sendStatus(204)
    } else res.sendStatus(400)
//юзеру может не прийти код, сгенерировать новый,записать в базу,  переслать код еще раз по емайл новый код
})

//1)Регистрация в системе отправить письмо с кодом, код обернуть в ссылку swagger
//2)auth: подтверждение регистрации при помощи кода, отправленного внутри ссылки на почту
// (в письмо нужно вставить обязательно ссылку (можно и в тег а, можно без html), аккунт существует регистрация завершена
// и в ссылке должен быть query-параметр code, например:
//3)auth: переотправка письма с кодом регистрации. сгенерировать новый код сохранить в БД и отправить на почту
// при создании пользователя супер админом (POST "/users")
// - подтверждения почты не требуется (пользователь сразу же после создания может входить в систему)

authRouter.get('/me',
    authMiddleware,
    (req: Request, res: Response) => {

        const user = req.user
        res.status(200).send({
            email: user!.email,
            login: user!.login,
            userId: user!._id.toString()
        })
    })

//secret + payload(userId) -> "dfjgghdi.jgidrhger.lghltehghd"