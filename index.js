const express = require('express');
const ytdlCore = require('ytdl-core');
const cors = require('cors');

const app = express();
app.use(cors(
    {
        origin: ['http://localhost:5173', 'https://youtubenks.netlify.app']
    }
));

app.use(express.json()); // Parse JSON bodies

app.post('/download', async (req, res) => {
    try {
        const { data } = req.body;
        console.log('Received URL:', data);

        const videoId = ytdlCore.getURLVideoID(data);
        const metaInfo = await ytdlCore.getInfo(data);
        const audioFormats = ytdlCore.filterFormats(metaInfo.formats, 'audioonly');

        const responseData = {
            url: `https://www.youtube.com/embed/${videoId}`,
            info: metaInfo.formats,
            audioFormats
        };

        res.status(200).json(responseData);
    } catch(error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to process request' });
    }
});


const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});
