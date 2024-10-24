# - [Sayari Take Home](#)
- [- Sayari Take Home](#--sayari-take-home)
- [Running the program:](#running-the-program)
- [API Routes](#api-routes)
  - [Route Links](#route-links)
    - [Questions](#questions)
      - [/questions](#questions-1)
      - [/questions/id/:id](#questionsidid)
      - [/questions/externalId/:externalId](#questionsexternalidexternalid)
      - [/questions/author/:authorId](#questionsauthorauthorid)
    - [Answers](#answers)
      - [/answers](#answers-1)
      - [/answers/question/:questionId](#answersquestionquestionid)
    - [Comments](#comments)
      - [/comments](#comments-1)
      - [/comments/question/:questionId](#commentsquestionquestionid)
      - [/comments/answer/:answerId](#commentsansweranswerid)
- [Database](#database)
  - [Tables](#tables)
  - [Seeding the Data](#seeding-the-data)
- [The Code](#the-code)


# Running the program:

To run the program all you should need to do is run
    <code>docker compose up</code><break />
This should create the seeded database, as well as start the api.
The api can be accessed through <code>localhost:5000 </code> by default.

# API Routes

## Route Links

### Questions

#### /questions

This route is used to gather ALL questions. It is a rather simple endpoint that searches for all entries in the post table that are marked as a question and returns them

#### /questions/id/:id

This route takes an integer id and returns back the question tied to that DATABASE ID, not the id given in the JSON

#### /questions/externalId/:externalId

This route takes an integer id and returns back the question tied to that JSON ID, not the id given in the DATABASE.

#### /questions/author/:authorId

This route takes an integer id and returns back the question tied to that AUTHOR. The id of user must be know to retrieve their questions.

### Answers

#### /answers

Essentially identical to the questions endpoint, this returns all answers from the post table.

#### /answers/question/:questionId

This route returns all answers tied to a given question

### Comments

#### /comments

Essentially identical to the question and answer endpoints, this returns back ALL comments, regardless of their parent type.

#### /comments/question/:questionId

This route returns back all comments that are tied to a given Question ID

#### /comments/answer/:answerId

This route returns back all comments that are tied to a given Answer ID

# Database 

## Tables

The database consists of 4 tables. These are:
<ul>
<li>User</li>
<li>Post</li>
<li>PostTypes</li>
<li>Comments</li>
</ul>

User, Post, and Comments are all tables containing the data from the json file. PostTypes is used as a reference table containing the types of posts that we currently handle (Questions and Answers). Comments are stored seperately given the vast amount of different data, while Questions and Answers share almost all fields. Comments and Answers, however, have parents they need to refer to. Comments have a foreign key tied to the post table. Answers also have this same foreign key that refers back to the same Post Table. All Posts and Comments tie to a User ID.

## Seeding the Data

I took the opportinity in seedint the data from the json to create a simple and unoptimized parser. This parser loads a (in this case static) file and approriately breaks out questions, answers, comments, and users (as a set to avoid duplicates). These values are then populated in the database by way of a few reusable functions that could be moved to the models files.

# The Code

The code is broken into 2 "functional" areas. The app file handles the initial database connection as well as the api listening. The main "logic" for each endpoint is handled through the appropriate model file. While these example api routes are rather simple, the logic for each of them can easily be expanded without clittering the routes files. I prefer this format using classes to allow for inheritance if it is needed (for example adding in a post model to handle both question and answer endpoints).

All of the given example api endpoints are gets for the sole purpose of ease of use as a user for this test. Assuming this is an api that will interact with a front end, in order to create a new question for example, you would have to provide the entire object structured appropriately. This is easy to do as a front end application but more involved in this test enviorment. For examples in creations, parsing, and possible "loading" functionality look into the <code>databaseSeedingScript.ts</code> file.