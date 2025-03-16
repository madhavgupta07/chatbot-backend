const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Chat = require('./models/chat.models.js')
require('dotenv').config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
  
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
      const result = await model.generateContent(message);
      const responseText = result.response.text();
  
      const chat = new Chat({
        userMessage: message,
        botResponse: responseText
      });
      await chat.save();
  
      res.json({ message: responseText });
    } catch (error) {
      console.error('Error generating content:', error);
      res.status(500).json({ error: 'Failed to generate response' });
    }
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});