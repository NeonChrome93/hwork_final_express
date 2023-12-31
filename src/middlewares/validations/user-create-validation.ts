import {body} from "express-validator";
import {inputValidationMiddleware} from "./input-validation-middleware";
import {usersRepository} from "../../repositories/users/users-repository-database";

export const validationCreateUser = [
    body('login').notEmpty().withMessage('incorrect login'),//custom
    body('login').isString().trim().isLength({min: 3, max: 10}).withMessage('incorrect login'),
    body('password').notEmpty().withMessage('password is required'),
    body('password').isString().trim().isLength({min: 6, max: 10}).withMessage('incorrect password'),
    body('email').notEmpty().withMessage('incorrect email'),//custom
    body('email').isURL().withMessage('incorrect email'),
    body('email').isString().trim().isLength({max: 150}).withMessage('incorrect email'),

    inputValidationMiddleware
]