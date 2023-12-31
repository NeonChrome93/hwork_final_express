import {blogRepository} from "../repositories/blogs/blogs-repository-database";
import {
    BlogsOutputType,
    Blog,
    CreateBlogType,
    UpdateBlogType
} from "../models/blogs-models/blogs-models";

import {PaginationModels} from "../models/pagination/pagination-models";
import {QueryPaginationType} from "../middlewares/pagination";


// query - get
// commands - post | put | delete


//todo also update blogName in posts
// updateBlog(updateBlogDto){
export class BlogService {



    async createBlog(newBlogFromRequest: CreateBlogType): Promise<BlogsOutputType> {
        const dateNow = new Date()
        const newBlog: Blog = {

            name: newBlogFromRequest.name,
            description: newBlogFromRequest.description,
            websiteUrl: newBlogFromRequest.websiteUrl,
            createdAt: dateNow.toISOString(),
            isMembership: false //false Swagger
        }
        return blogRepository.createBlog(newBlog)
    }


        async updateBlogs(id: string, newUpdateRequest: UpdateBlogType): Promise<boolean> {
        const blog = await blogRepository.readBlogsId(id)
        if (!blog) return false
        return blogRepository.updateBlogs(id, newUpdateRequest)
    }


    async deleteBlogs(id: string): Promise<boolean> {
        const blog = await blogRepository.readBlogsId(id)
        if (!blog) return false
        return blogRepository.deleteBlogs(id)
    }



}

export const blogService = new BlogService()