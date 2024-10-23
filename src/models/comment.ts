import { Kysely, PostgresDialect } from "kysely";
import { Database, DBComment, DBPost, NewPost, PostType, } from "../util/types";
import { Pool } from "pg";

export class CommentModel {

    db: Kysely<Database>;

    constructor(db: Kysely<Database>) {
        this.db = db;

    }
    async getAllComments(): Promise<DBComment[]> {
        return await this.db.selectFrom('comments').selectAll().execute();
    }

    async getAllCommentsForQuestion(questionId:number): Promise<DBComment[]> {
        return await this.db.selectFrom('comments').where('parentId','=',questionId
        ).selectAll().execute();
    }
    async getAllCommentsForAnswer(answerId:number): Promise<DBComment[]> {
        return await this.db.selectFrom('comments').where('parentId','=',answerId
        ).selectAll().execute();
    }
}