import express from 'express';
import utilisateurRoutes from './routes/utilisateurRoutes';
import { logger } from './middlewares/logger';

const app = express();
app.use(express.json());
app.use(logger);
app.use('/', utilisateurRoutes);
export default app;
