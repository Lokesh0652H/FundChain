import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  jwtSecret: process.env.JWT_SECRET || 'fundchain_btech_major_project_jwt_secret_key_2026_cryptographic',
  blockchainRpcUrl: process.env.BLOCKCHAIN_RPC_URL || 'http://127.0.0.1:8545',
  contractAddress: process.env.CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  governmentWallet: process.env.GOVERNMENT_WALLET || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  aiServiceUrl: process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000',
  ipfsGateway: process.env.IPFS_GATEWAY || 'https://ipfs.io/ipfs/'
};
