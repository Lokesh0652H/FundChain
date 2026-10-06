import express from 'express';
import cors from 'cors';
import { config } from './config/env';

import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import departmentRoutes from './routes/departments';
import contractorRoutes from './routes/contractors';
import milestoneRoutes from './routes/milestones';
import fundRoutes from './routes/funds';
import blockchainRoutes from './routes/blockchain';
import anomalyRoutes from './routes/anomalies';
import statsRoutes from './routes/stats';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    system: 'FundChain Core Backend',
    version: '1.0.0',
    blockchain: 'Ethereum-Compatible PoA Testnet',
    database: 'PostgreSQL/SQLite via Prisma',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/contractors', contractorRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/funds', fundRoutes);
app.use('/api/blockchain', blockchainRoutes);
app.use('/api/anomalies', anomalyRoutes);
app.use('/api/stats', statsRoutes);

// Error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

app.listen(config.port, () => {
  console.log(`=======================================================`);
  console.log(`🚀 FundChain Server running at http://localhost:${config.port}`);
  console.log(`📜 Smart Contract: ${config.contractAddress}`);
  console.log(`🤖 AI Engine: Connected to ${config.aiServiceUrl}`);
  console.log(`🛡️ Academic Demonstration Dataset Active`);
  console.log(`=======================================================`);
});
