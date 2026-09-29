import express from 'express';


const Chatrouter = express.Router();

Chatrouter.post('/chat');
Chatrouter.get('/chat');
Chatrouter.get('/chat/:id');
Chatrouter.post('/chat/feedback');


export default Chatrouter;