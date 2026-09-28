import express from 'express';


const Chatrouter = express.Router();

Chatrouter.get('/send');

export default Chatrouter;