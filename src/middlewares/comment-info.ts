import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import {commentsCollection} from "../db/database";
import {ObjectId} from "mongodb";
import {jwtService} from "../application/jwt-service";
import {userService} from "../domain/users-servise";
import {commentServise} from "../domain/comments-servise";

export const  isCommentOwnerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.headers.authorization){
        res.sendStatus(401)
        return
    }

    const token = req.headers.authorization.split(' ')[1];
    const userId = await jwtService.getUserIdByToken(token)
    const commentBeforeDelete = await commentServise.readCommentId(req.params.id)

    if(!commentBeforeDelete) {return res.sendStatus(404) }

      const commentarorId  = commentBeforeDelete.commentatorInfo.userId
        if(commentarorId !== userId.toString()) {
        return res.sendStatus(403)

    }
    else {
        next();
    }

}