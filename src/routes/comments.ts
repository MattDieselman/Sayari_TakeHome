import { Router } from 'express';
import { commentModel } from '../app';

export const commentRouter = Router();


commentRouter.get('/', async (req, res) => {
    let allCs = await commentModel.getAllComments();
    res.send(allCs);
});

// /question/[value]
commentRouter.get('/question/:questionId', async (req, res) => {
    let questionId = parseInt(req.params.questionId as string)
    let allQs = await commentModel.getAllCommentsForQuestion(questionId);
    res.send(allQs);
});

// /answer/[value]
commentRouter.get('/answer/:answerId', async (req, res) => {
    let answerId = parseInt(req.params.answerId as string)
    let allQs = await commentModel.getAllCommentsForQuestion(answerId);
    res.send(allQs);
});
