import {

    CommentsViewType,
    REACTIONS_ENUM,
    UpdateCommentType
} from "../models/comments-models/comments-models";
import {ObjectId} from "mongodb";
import {commentRepository} from "../repositories/comments/comments-repository-database";
import {CommentsDBType, StatusType} from "./entities/comments-entity";

// func(() => {})
// func(() => {//other logic})
//
// const func = (callback: (arg: any)=> void) => {
//     //logic
//    someFunc()
// }

export const commentService = {

    // async readComment(pagination: QueryPaginationType): Promise<PaginationModels<PostOutputType[]>> {
    //     return commentRepository.readCommentId()
    // },

    async readCommentId(commentId: string) {
        return commentRepository.readCommentId(commentId)
    },




    async createComment(postId: string, userId: string, userLogin: string, content: string): Promise<CommentsViewType> {
        const newComment: CommentsDBType = {
            _id: new ObjectId(),
            postId,
            content,
            commentatorInfo: {
                userId,
                userLogin
            },
            createdAt: new Date(),
            reactions: []
        }
        await commentRepository.createComment(newComment)
        return {
            id: newComment._id.toString(),
            content,
            commentatorInfo: newComment.commentatorInfo,
            createdAt: newComment.createdAt.toISOString(),
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: REACTIONS_ENUM.None
            }
        }
    },

    async addReaction(commentId: string, userId: string, status: REACTIONS_ENUM) :Promise<boolean> {
        const comment = await commentRepository.readCommentIdDbType(commentId)
        if(!comment) return false
        const reaction = comment.reactions.find(r => r.userId === userId)
        if(!reaction) {
            comment.reactions.push({userId, status, createdAt: new Date()})
        } else {
            reaction.status = status
            reaction.createdAt = new Date()
        }
        await commentRepository.updateCommentReactions(comment)
        return true
    },


    async updateComment(commentId: string, newUpdateRequest: UpdateCommentType): Promise<boolean> {
        let comment = await commentRepository.readCommentId(commentId)
        if(!comment ) return false
        return  commentRepository.updateComment(commentId,newUpdateRequest)

    },
    async deletedComment(commentId: string){
        let comment = await commentRepository.readCommentId(commentId)
    },


    async deleteComment(commentId: string): Promise<boolean> {
        let comment = await commentRepository.readCommentId(commentId)
        if(!comment) return false
        return  commentRepository.deleteComment(commentId)
    },
}