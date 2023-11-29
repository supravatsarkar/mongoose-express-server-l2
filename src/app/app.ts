import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import StudentRoutes from './modules/user/user.routes';
const app: Application = express();

// 3rd party middlewares
app.use(cors());
app.use(express.json());

// custom middlewares

// routes
app.use('/api/users', StudentRoutes);

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Server Running..');
});

// 404 handler
app.all('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    error: {
      code: 404,
      description: 'Route not found!',
    },
  });
});

// global error handler
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: {
      code: 500,
      description: 'Something went wrong!',
    },
  });
});

export default app;
