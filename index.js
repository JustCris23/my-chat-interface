const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/send-message', async (req, res) => {
  const message = req.body.message;
  const chatId = req.body.chatId;
  const botToken = '6094204864:AAEUxSO-L1WcnOxKTil51xHDytDU1OOKQIg';

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error sending message to Telegram bot:', error);
    res.status(500).json({ error: 'An error occurred while sending the message' });
  }
});

// Add this new route to serve the chat_interface.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'chat_interface.html'));
});

app.listen(port, () => {
  console.log(`Telegram proxy server listening at http://localhost:${port}`);
});
