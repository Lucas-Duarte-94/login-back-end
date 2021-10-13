import express, { Request, Response } from "express";
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';
import { mongoConnect } from "./databse/mongo";

dotenv.config();

mongoConnect();

const server = express();

server.use(cors());

server.use(express.static(path.join(__dirname, '../public')));
server.use(express.urlencoded({ extended: true }));

server.use(apiRoutes);

server.use((req: Request, res: Response) => {
    res.status(404);
    res.json({ error: 'Endpoint não encontrado.' });
});

server.listen(process.env.PORT);