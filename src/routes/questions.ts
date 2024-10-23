import { Router } from 'express';
import { questionModel } from '../app';

export const questionRouter = Router();

questionRouter.get('', async (req, res) => {
    let allQs = await questionModel.getAllQuestions();
    res.send(allQs);
});

// /id/[value]
questionRouter.get('/id/:id', async (req, res) => {
    let id = parseInt(req.params.id as string)
    let allQs = await questionModel.getQuestionById(id);
    res.send(allQs);
});

// /externalId/[value]
questionRouter.get('/externalId/:externalId', async (req, res) => {
    let externalId = parseInt(req.params.externalId as string)
    let allQs = await questionModel.getQuestionByExternalId(externalId);
    res.send(allQs);
});

// /author/[value]
questionRouter.get('/author/:author', async (req, res) => {
    let author = parseInt(req.params.author as string)
    let allQs = await questionModel.getAllQuestionsByAuthor(author);
    res.send(allQs);
});