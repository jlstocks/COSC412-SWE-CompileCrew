require('dotenv').config();
const express = require('express');
const path = require('path');
// Change this line:
// const fetch = require('node-fetch');
// To this (for CommonJS):
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// AI endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    // Make a request to OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant with financial expertise." },
          { role: "user", content: message }
        ]
      })
    });
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }
    
    res.json({
      reply: data.choices[0].message.content
    });
  } catch (error) {
    console.error('Error in AI chat endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
