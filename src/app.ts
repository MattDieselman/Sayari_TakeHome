import express, { NextFunction, Request, Response } from "express";
import { routes } from './routes/routes';
import dotenv from "dotenv";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { Database, PostType } from "./util/types";

import { QuestionModel } from "./models/question";
import { AnswerModel } from "./models/answer";
import { CommentModel } from "./models/comment";

dotenv.config(); //Reads .env file and makes it accessible via process.env

const app = express();
app.use('/', routes);

const dialect = new PostgresDialect({
    pool: new Pool({
        host: process.env.POSTGRES_HOST,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        port: parseInt(process.env.DB_PORT as string),
        idleTimeoutMillis: 30000,
    })
})
const db = new Kysely<Database>({
    dialect,
})
export const questionModel:QuestionModel = new QuestionModel(db)

export const answerModel:AnswerModel = new AnswerModel(db)
export const commentModel:CommentModel = new CommentModel(db)

app.listen(process.env.PORT, () => {
    console.log(`Server is running at ${process.env.PORT}`);
});
