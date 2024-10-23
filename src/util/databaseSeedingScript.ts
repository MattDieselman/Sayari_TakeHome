import dotenv from "dotenv";
import jsonData from "../../stackoverfaux copy.json"
import { Question, Answer, User, Comment, PostType, Database, NewPost, Post, NewUser, DBPost, NewComment } from "./types";
import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";

/*

This file is legacy used to initialize the database.
I left this here as a talking point to discuss parsing and populating.
This *could* serve as a starting point for some type of automatic system
to ingest the information, be it through user upload or through running as a script.
This file would need to be heavily edited if this were to be progressed, but
I wanted to leave it in as a possible point of discussion.

*/



// Seeding function to parse json and populate the database
async function GlobalSeed(){

    dotenv.config(); //Reads .env file and makes it accessible via process.env

    // Create db pool
    const pool = new Pool({
        host: process.env.POSTGRES_HOST,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        port: 5432,
        idleTimeoutMillis: 30000,
        max:1,
    });

    const dialect = new PostgresDialect({
        pool: pool
    })
    const db = new Kysely<Database>({
        dialect,
    })


    // Definitions
    let questions: Question[] = []
    let answers: Answer[] = []
    let comments: Comment[] = []
    let bulkUsers: User[] = []

    // Function Definitions
    async function createQuestion(question: NewPost) {
        return await db.insertInto('post').values([{
            externalId: question.externalId,
            title: question.title,
            body: question.body,
            create_time: question.create_time,
            score: question.score,
            author: question.author,
            postType: PostType.Question
        }]).returningAll()
            .executeTakeFirstOrThrow()
            .catch((e) => console.log(e))
    }
    async function createAnswer(answer: NewPost) {
        return await db.insertInto('post').values([{
            externalId: answer.externalId,
            body: answer.body,
            create_time: answer.create_time,
            score: answer.score,
            author: answer.author,
            parentId: answer.parentId,
            postType: PostType.Answer,
            acceptedAnswer:answer.acceptedAnswer,
        }]).returningAll()
            .executeTakeFirstOrThrow()
            .catch((e) => console.log(e))
    }
    async function createUser(user: NewUser) {
        return await db.insertInto('user').values([{
            externalId: user.externalId,
            name: user.name,
        }]).returningAll()
            .executeTakeFirstOrThrow()
            .catch((e) => console.log(e))
    }
    async function createComment(comment: NewComment) {
        return await db.insertInto('comments').values([{
            externalId: comment.externalId,
            body: comment.body,
            author: comment.author,
            parentId: comment.parentId,
        }]).returningAll()
            .executeTakeFirstOrThrow()
            .catch((e) => console.log(e))
    }
    async function getAllUsers() {
        return await db.selectFrom('user').selectAll().execute();
    }
    async function getAllQuestions() {
        return await db.selectFrom('post').where('postType', '=', PostType.Question).selectAll().execute();
    }
    async function getAllAnswers() {
        return await db.selectFrom('post').where('postType', '=', PostType.Answer).selectAll().execute();
    }
    function commentParse(comment: any, questionId: number): void {
        comments.push({
            externalId: comment.id,
            body: comment.body,
            user: { externalId: comment.user.id, name: comment.user.name },
            parentId: questionId,
        })
        bulkUsers.push({
            externalId: comment.user.id,
            name: comment.user.name
        })
    }

    // Begin Parsing JSON data
    jsonData.map(async (question) => {
        // Store each high level question in a custom object
        questions.push({
            externalId: question.id,
            title: question.title,
            body: question.body,
            creation: question.creation,
            score: question.score,
            user: { externalId: question.user.id, name: question.user.name },
            postType: PostType.Question
        })

        // Store users in the custom object
        bulkUsers.push({
            externalId: question.user.id,
            name: question.user.name
        })

        // Store comments in the custom object
        question.comments.map((comment) => { commentParse(comment, question.id) })

        // Map over all the answers
        question.answers.map((answer) => {

            // Store answers in the custom object
            answers.push({
                externalId: answer.id,
                body: answer.body,
                creation: answer.creation,
                score: answer.score,
                user: { externalId: answer.user.id, name: answer.user.name },
                accepted: answer.accepted,
                parentId: question.id,
                postType: PostType.Answer
            })
            // Store answer's users in the user
            bulkUsers.push({
                externalId: answer.user.id,
                name: answer.user.name
            })
            if (answer.comments.length !== 0) {
                // Add the answer's comments to the comments object
                answer.comments.map((comment) => { commentParse(comment, answer.id) })
            }
        })
    })

    // Finished with parsing out the json object.
    // Now we can work with it in memory

    // Uniquify the users array
    let users: User[];
    users = bulkUsers.filter((value, index, self) =>
        index === self.findIndex((user) => (
            user.externalId === value.externalId && user.name === value.name
        ))
    )

    // Load Users into DB
    users.map(async (user) => {
        await createUser(user);
    })

    // Get all the users from the db (we need to map ids to external ids)
    let dbUsers: User[] = await getAllUsers()

    // Hashify the db users for easy question/answer/comment attributing
    let userHash = await dbUsers.reduce((acc, item) => {
        acc[item.externalId] = item.id || 0;
        return acc;
    }, {} as Record<number, number>);

    // Create the question entries in the post table
    questions.map(async (element) => {
        await createQuestion({
            externalId: element.externalId,
            title: element.title,
            body: element.body,
            create_time: new Date(element.creation*1000),
            score: element.score,
            author: userHash[element.user.externalId],
            postType: PostType.Question
        })
    })

    // Get all the users from the db (we need to map ids to external ids)
    let dbQuestions: DBPost[] = await getAllQuestions()

    // Hashify the db questions for easy answer/comment attributing
    let questionHash = await dbQuestions.reduce((acc, item) => {
        acc[item.externalId] = item.id || 0;
        return acc;
    }, {} as Record<number, number>);
    answers.map(async (element) => {
        await createAnswer({
            externalId: element.externalId,
            body: element.body,
            create_time: new Date(element.creation*1000),
            score: element.score,
            author: userHash[element.user.externalId],
            parentId: questionHash[element.parentId],
            acceptedAnswer:element.accepted,
            postType: PostType.Question
        })
    })

    // Get all the users from the db (we need to map ids to external ids)
    let dbAnswers: DBPost[] = await getAllAnswers()

    // Hashify the db questions for easy answer/comment attributing
    let answerHash = await dbAnswers.reduce((acc, item) => {
        acc[item.externalId] = item.id || 0;
        return acc;
    }, {} as Record<number, number>);

    // Merge questions and answers into one hash for comments to reference
    let postHash = {...questionHash,...answerHash};

    comments.map(async (element) => {
        await createComment({
            externalId: element.externalId,
            body: element.body,
            author: userHash[element.user.externalId],
            parentId: postHash[element.parentId],
        })
    })

}

GlobalSeed();

