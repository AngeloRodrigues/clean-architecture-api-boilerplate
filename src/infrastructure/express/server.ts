/* istanbul ignore file */
import express from 'express';
import { setupAsyncErrors } from './setup/setup-async-errors';
import { setupGlobalMiddlewares } from './setup/setup-global-middlewares';
import { setupRoutes } from './setup/setup-routes';

export const app = express();

setupGlobalMiddlewares(app);
setupRoutes(app);
setupAsyncErrors(app); // It has to be placed after all routes and middlewares

const port = process.env.PORT || 4321;
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server listening -> http://127.0.0.1:${port}`);
  });
}
