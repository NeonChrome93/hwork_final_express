import {ObjectId, WithId} from "mongodb";

export class Blog {
    constructor(
        public name: string,
        public description: string,
        public websiteUrl: string,
        public createdAt: string,
        public isMembership: boolean) {

    }
}


const blog = new Blog('Y', 'blablsa','dfgdfgdfgdf', 'adwawad', false)

// export type BlogsType =
//     {
//
//         "name": string,
//         "description": string,
//         "websiteUrl": string,
//         "createdAt": string,
//         "isMembership": boolean
//     }
// export type BlogsOutputType =
//     {
//         "id": string,
//         "name": string,
//         "description": string,
//         "websiteUrl": string,
//         "createdAt": string,
//         "isMembership": boolean
//     }

export class BlogsOutputType {
    constructor(
       public id: string,
       public name: string,
       public description: string,
       public websiteUrl: string,
       public createdAt: string,
       public isMembership : boolean
    ) {
    }
}

//export type mongoType = WithId<BlogsType>

export type CreateBlogType =
    {
        "name": string,
        "description": string,
        "websiteUrl": string
    }

export type UpdateBlogType =
    {
        "name": string,
        "description": string,
        "websiteUrl": string
    }
