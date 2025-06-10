import express from 'express';
import fileUpload from 'express-fileupload';
import { env } from './config/env';
import { errorHandler } from './middleware/error-handler';
import { notFoundHandler } from './middleware/not-found-handler';
import { postRouter } from './routes/post-routes';
import { userRouter } from './routes/user-routes';

const app = express();

app.use(express.json());
app.use('/static', express.static('static'));
app.use(fileUpload());
app.use('/api', userRouter);
app.use('/api', postRouter);
app.use(notFoundHandler);
app.use(errorHandler());

const startApp = async () => {
  try {
    console.log('Starting server...');

    app.listen(env.APP_PORT, () => {
      console.log(`Server started on port ${env.APP_PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
};

startApp();
