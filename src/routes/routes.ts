import express from 'express';

import { questionRouter } from './questions';
import { answerRouter } from './answers';
import { commentRouter } from './comments';

export const routes = express.Router();

routes.use('/questions',questionRouter)
routes.use('/answers',answerRouter)
routes.use('/comments',commentRouter)