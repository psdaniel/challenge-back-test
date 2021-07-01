require('dotenv').config();
import express from 'express';
import { addressRoutes } from './routes/address';

const app = express();

app.use(express.json());
app.use(addressRoutes);

app.listen(3333);
