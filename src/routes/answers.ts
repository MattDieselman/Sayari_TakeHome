import { Router } from 'express';
import { answerModel } from '../app';

export const answerRouter = Router();

answerRouter.get('/', async (req, res) => {
    let allAs = await answerModel.getAllAnswers();
    res.send(allAs);
});

// /question/[value]
answerRouter.get('/question/:questionId', async (req, res) => {
    let questionId = parseInt(req.params.questionId as string)
    let allAs = await answerModel.getAllAnswersToQuestion(questionId);
    res.send(allAs);
});
