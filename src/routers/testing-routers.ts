import {Request, Response,Router} from "express";
import {blogRepository} from "../repositories/blogs/blogs-repository-database";
import {postsRepository} from "../repositories/posts/posts-repository-database";
import {usersRepository} from "../repositories/users/users-repository-database";

export const testingRouters = Router({});



testingRouters.delete('/', async (req: Request, res: Response) => {
    await  Promise.all([
        blogRepository.deleteAllBlogs(),
        postsRepository.deleteAllPosts(),
        usersRepository.deleteAllUsers()]);
    res.sendStatus(204)
})