
import {usersRepository} from "../repositories/users/users-repository-database";

import {UserCreateModel,  UserViewModel} from "../models/users-models/user.models";
import {ObjectId} from "mongodb";
import { QueryUserPaginationType} from "../middlewares/pagination";
import {PaginationModels} from "../models/pagination/pagination-models";
import bcrypt from "bcrypt";
import {UserDbModel} from "./entities/users-entity";




const hashService = {
   async generateHash(password: string): Promise<string> {
        return bcrypt.hash(password, 10)
    }
}



export const userService = {

    // async getUsers(pagination:  QueryUserPaginationType) :Promise<PaginationModels<UserViewModel[]>> {
    //     return usersRepository.getUsers(pagination)
    // },

    async createUser(userCreateModel: UserCreateModel): Promise<UserViewModel> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this.generateHash(userCreateModel.password, passwordSalt)

        const newUser: UserDbModel = {
            _id: new ObjectId(),
            login: userCreateModel.login,
            email: userCreateModel.email,
            passwordHash: passwordHash,
            passwordSalt: passwordSalt,
            createdAt: new Date(),
            confirmationCode: '123',
            isConfirmed: true,
            passwordRecoveryCode: null,
            expirationDateOfRecoveryCode: null

        }
        await usersRepository.createUser(newUser)
        return {
            id: newUser._id.toString(),
            login: newUser.login,
            email: newUser.email,
            createdAt: newUser.createdAt.toISOString()
        }
    },

    async findUserById(id: string): Promise<UserDbModel | null> {
         return usersRepository.readUserById(id)
     },

    async checkCredentials(loginOrEmail: string, password: string): Promise<UserDbModel | null> {
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) return null
        const passwordHash = await this.generateHash(password, user.passwordSalt)
        if (user.passwordHash !== passwordHash) {
            return null
        }
        return user

    },
    async generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        return hash
    },

    async deleteUser(id: string): Promise<boolean> {
        const user = await usersRepository.readUserById(id)
        if (!user) return false
        return usersRepository.deleteUser(id)
    },
}