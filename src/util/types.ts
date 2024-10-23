// Basic Type definitions for our objects

import { Generated, Insertable, Selectable } from "kysely"

export interface Database {
    post: PostTable,
    comments: CommentTable,
    user: UserTable,
}

// Definitions of the TABLES (used for Kysely)
export interface PostTable {
    id: Generated<number>,
    create_time: Generated<Date>,
    score: number,
    author: number,
    body: string,
    title?: string | null,
    postType: PostType.Question | PostType.Answer
    parentId?: number | null,
    acceptedAnswer?:boolean,
    externalId: number,
}
export type NewPost = Insertable<PostTable>
export type DBPost = Selectable<PostTable>

export interface CommentTable {
    id: Generated<number>,
    create_time: Generated<Date>,
    author: number,
    body: string,
    parentId: number,
    externalId: number,
}
export type NewComment = Insertable<CommentTable>
export type DBComment = Selectable<CommentTable>

export interface UserTable {
    id: Generated<number>,
    create_time: Generated<Date>,
    externalId: number,
    name: string
}

export type NewUser = Insertable<UserTable>

// Database ids start at one so we adjust the enum here to match
export enum PostType {
    Question = 1,
    Answer = 2,
}

export interface User {
    id?: number,
    externalId: number,
    name: string,
}


export interface Post {
    id?: number,
    externalId: number,
    body: string,
    creation: number,
    score: number,
    user: User,
    comments?: Comment[],
}
export interface Question extends Post {
    title: string,
    postType: PostType.Question
}
export interface Answer extends Post {
    accepted: boolean,
    parentId: number,
    postType: PostType.Answer

}
export interface Comment {
    externalId: number,
    body: string,
    user: User,
    parentId: number,
}