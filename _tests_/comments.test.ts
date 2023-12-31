//зачистить БД , создать блог и пост, создать 4х новых юзеров( с полем isComfirmed), залогонится с 4х юзеров, один юзер
// создает комментарий и 4 юзера лайкают и проверить гетом
//после каждого лайка


import {runDatabase} from "../src/db/database";
import request from "supertest";
import {app} from "../src/app";

const createBlog = {
    name: "Yaroslaw",
    description: "blabla",
    websiteUrl: "https://odintsovo.hh.ru/vacancy/81832912?from=vacancy_search_list"
}

const createPost = {

    title: "Cook",
    shortDescription: "Kitchen",
    content: "Reciepe",
    blogId: ""

}

let postId = ''
let commentId = ""

const createUser1 = {
    login: "Meine",
    email: "y.snegirov@yandex.ru",
    password: "12345678"
}

const createUser2 = {
    login: "Ivan",
    email: "ivan@yandex.ru",
    password: "12345678"
}

const createUser3 = {
    login: "Gleb",
    email: "gleb@yandex.ru",
    password: "12345678"
}

const createUser4 = {
    login: "Daniel",
    email: "dane@yandex.ru",
    password: "12345678"
}

let createComment = {
    content: "Hello Samurai how are you"
}


const headers = {
    "Authorization": "Basic YWRtaW46cXdlcnR5",
    "user-agent": "Mozilla"

}
let token1 = "";

let token2 = "";

let token3 = "";

let token4 = "";

describe('Likes',() => {


    beforeAll(async ()=> {
        await runDatabase()
    })

   it('deleteAll', async ()=> {
        await request(app).delete('/testing/all-data').expect(204)
    })

    it('Create Blog',async ()=>{
        const res = await request(app).post('/blogs').set(headers).send(createBlog).expect(201)
        //console.log(res.body)
        createPost.blogId = res.body.id
    })

    it('Create Post', async () => {
        const res = await request(app).post('/posts').set(headers).send(createPost).expect(201)
        postId = res.body.id


    })

    it('CreateUser', async () => {
        const user1 = await request(app).post('/users').set(headers).send(createUser1).expect(201)
        const user2 = await request(app).post('/users').set(headers).send(createUser2).expect(201)
        const user3 = await request(app).post('/users').set(headers).send(createUser3).expect(201)
        const user4 = await request(app).post('/users').set(headers).send(createUser4).expect(201)
       // console.log(user1.body)
    })

    it('Login', async () => {
        const res1 = await request(app).post('/auth/login').send({loginOrEmail: createUser1.login,password: createUser1.password}).expect(200)
        token1 = res1.body.accessToken
        const res2 = await request(app).post('/auth/login').send({loginOrEmail: createUser2.login,password: createUser2.password}).expect(200)
        token2 = res2.body.accessToken
        const res3 = await request(app).post('/auth/login').send({loginOrEmail: createUser3.login,password: createUser3.password}).expect(200)
        token3 = res3.body.accessToken
        const res4 = await request(app).post('/auth/login').send({loginOrEmail: createUser4.login,password: createUser4.password}).expect(200)
        token4 = res4.body.accessToken
        console.log(token1)
    })

    it('Create comment ', async () =>{
        const res = await request(app).post(`/posts/${postId}/comments`).set({authorization:"Bearer " + token1}).send(createComment).expect(201)
        commentId = res.body.id
        console.log(commentId)
    });

    it('Like comment ', async () => {
        let likedAndComment = await request(app).put(`/comments/${commentId}/like-status`).set({authorization:"Bearer " + token1}).send({
            likeStatus: "Like"
        }).expect(204)

        const res = await request(app).get('/comments/' + commentId).set({authorization:"Bearer " + token1}).expect(200)
        console.log(res.body)
        expect(res.body).toEqual( {
            id: expect.any(String),
            content: createComment.content,
            commentatorInfo: { userId: expect.any(String), userLogin: expect.any(String) },
            createdAt: expect.any(String),
            likesInfo: { likesCount: 1, dislikesCount: 0, myStatus: "Like" }
        })
    });

})

