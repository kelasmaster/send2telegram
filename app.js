const express = require('express');
const axios = require('axios');
const multer = require('multer');
const app = express();
const upload = multer({ dest: 'uploads/' });

const TELEGRAM_BOT_TOKEN = '5873360141:AAGHq0sB7x_aYIngH_KmwTyjLavt4CppUIg';
const CHAT_ID = '';

// Route to send text
app.post('/send-text', express.json(), async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    try {
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            chat_id: CHAT_ID,
            text: text,
        });
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// Route to send image
app.post('/send-image', upload.single('image'), async (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'Image is required' });

    try {
        const formData = new FormData();
        formData.append('chat_id', CHAT_ID);
        formData.append('photo', fs.createReadStream(file.path));

        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, formData, {
            headers: formData.getHeaders(),
        });
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to send image' });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));

document.getElementById('text-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = document.getElementById('text').value;

    const response = await fetch('/send-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
    });

    if (response.ok) alert('Text sent successfully!');
    else alert('Failed to send text.');
});

document.getElementById('image-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const response = await fetch('/send-image', {
        method: 'POST',
        body: formData,
    });

    if (response.ok) alert('Image sent successfully!');
    else alert('Failed to send image.');
});
