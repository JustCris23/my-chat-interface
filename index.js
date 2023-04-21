const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use((req, res, next) => { console.log(`${req.method} ${req.url}`); next(); });

let currentChatId = null;

app.post('/send-message', async (req, res) => {
  const message = req.body.message;
  const botToken = '6094204864:AAEUxSO-L1WcnOxKTil51xHDytDU1OOKQIg';

  if (!currentChatId) {
    res.status(400).json({ error: 'No chat ID available' });
    return;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${currentChatId}&text=${encodeURIComponent(message)}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error sending message to Telegram bot:', error);
    res.status(500).json({ error: 'An error occurred while sending the message' });
  }
});

app.post('/webhook', (req, res) => {
  const data = req.body;

  if (data.message && data.message.chat && data.message.chat.id) {
    currentChatId = data.message.chat.id;
  }

  res.sendStatus(200);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'chat_interface.html'));
});

app.listen(port, () => {
  console.log(`Telegram proxy server listening at http://localhost:${port}`);
});
