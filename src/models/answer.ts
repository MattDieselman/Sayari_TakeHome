import { Kysely, PostgresDialect } from "kysely";
import { Database, DBPost, NewPost, PostType, } from "../util/types";
import { Pool } from "pg";

export class AnswerModel {

    db: Kysely<Database>;

    constructor(db: Kysely<Database>) {
        this.db = db;

    }

    async getAllAnswers(): Promise<DBPost[]> {
        return await this.db.selectFrom('post').where('postType', '=', PostType.Answer).selectAll().execute();
    }


    async getAllAnswersToQuestion(questionId:number): Promise<DBPost[]> {
        return await this.db.selectFrom('post').where('postType', '=', PostType.Answer).where('parentId','=',questionId
        ).selectAll().execute();
    }
}