import express from 'express';

import { envs } from './config.js'
import { connect } from './mongoose-starter.js';
import authenticationRouter from './routes/authentication/authentication.routes.js'
import bodyParserMiddleware from './middlewares/body-parser.middleware.js';
import headersMiddleware from './middlewares/headers.middleware.js';
import errorMiddleware from './middlewares/error.middleware.js';
import crashHandlingRoutine from './utils/crashHandlingRoutine.js';
import userDataRouter from './routes/user-data/user-data.routes.js';
import recipesRouter from './routes/recipes/recipes.routes.js';
import feedRouter from './routes/feed/feed.routes.js';

const main = async () => {
  try {
    if (envs) {
      const app = express();

      //connect to mongoose
      await connect();

      //SECTION - MIDDLEWARES
      app.use(express.json({ limit: '1mb' }));
      app.use(bodyParserMiddleware);
      app.use(headersMiddleware);
      //!SECTION - MIDDLEWARES

      //SECTION - ROUTES
      app.use('/auth', authenticationRouter);
      app.use('/userData', userDataRouter);
      app.use('/recipes', recipesRouter)
      app.use('/feed', feedRouter)
      //!SECTION - ROUTES

      //NOTE - error middleware need to be here to catch errors from the route
      app.use(errorMiddleware);

      app.listen(envs.PORT);
      console.log(`Listening on port:${envs.PORT}`);
    }
    else
      throw new Error("CONFIG NOT DEFINED")

  } catch (error: any) {
    //code for when the env param fetch crashes
    crashHandlingRoutine(error);
  }
}

await main();