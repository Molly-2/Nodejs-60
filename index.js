const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.get('/image', async (req, res) => {
    const { title } = req.query;

    if (!title) {
        return res.status(400).json({ error: 'Title query parameter is required' });
    }

    try {
        const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
        const response = await axios.get(summaryUrl);

        if (response.status !== 200) {
            return res.status(response.status).json({ error: 'Error fetching data from Wikipedia' });
        }

        const { extract, thumbnail } = response.data;
        const imageUrl = thumbnail ? thumbnail.source : null;

        res.json({ summary: extract, image: imageUrl });
    } catch (error) {
        console.error('Error fetching data from Wikipedia:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
