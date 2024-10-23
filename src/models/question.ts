import { Kysely, PostgresDialect } from "kysely";
import { Database, DBPost, NewPost, PostType, } from "../util/types";
import { Pool } from "pg";

export class QuestionModel {

    db: Kysely<Database>;

    constructor(db: Kysely<Database>) {
        this.db = db;

    }

    async getAllQuestions(): Promise<DBPost[]> {
        return await this.db.selectFrom('post').where('postType', '=', PostType.Question).selectAll().execute();
    }

    async getQuestionById(id:number):Promise<DBPost>{
        return await this.db.selectFrom('post').where('postType','=',PostType.Question).where('id','=',id).selectAll().executeTakeFirstOrThrow();
    }
    async getQuestionByExternalId(externalId:number):Promise<DBPost>{
        return await this.db.selectFrom('post').where('postType','=',PostType.Question).where('externalId','=',externalId).selectAll().executeTakeFirstOrThrow();
    }

    async getAllQuestionsByAuthor(authorId:number): Promise<DBPost[]> {
        return await this.db.selectFrom('post').where('postType', '=', PostType.Question).where('author','=',authorId).selectAll().execute()
    }
    
    async createQuestion(question: NewPost) {
        return await this.db.insertInto('post').values([{
            externalId: question.externalId,
            title: question.title,
            body: question.body,
            create_time: question.create_time,
            score: question.score,
            author: question.author,
            postType: PostType.Question
        }]).returningAll()
            .executeTakeFirstOrThrow()
            .catch((e: any) => console.log(e))
    }
}