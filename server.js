const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static(__dirname)); // Serve static files from the root directory
app.use('/converted', express.static(path.join(__dirname, 'converted')));

// Create necessary directories
const uploadsDir = path.join(__dirname, 'uploads');
const convertedDir = path.join(__dirname, 'converted');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
if (!fs.existsSync(convertedDir)) fs.mkdirSync(convertedDir);

// Set up Multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Conversion endpoint
app.post('/convert', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No video file uploaded.');
    }

    const style = req.body.style || 'cartoon';
    const inputPath = req.file.path;
    const outputFilename = `converted-${Date.now()}-${path.parse(req.file.originalname).name}.mp4`;
    const outputPath = path.join(convertedDir, outputFilename);

    console.log(`Starting conversion for ${inputPath} with style: ${style}`);

    let command = ffmpeg(inputPath);

    // Apply filters based on selected style
    // NOTE: These are simplified approximations. Advanced styles require complex filter chains or AI.
    switch (style) {
        case 'pixel':
            command.videoFilter('scale=iw/8:-1,scale=iw*8:ih*8:flags=neighbor');
            break;
        case 'cartoon':
            // This is a complex effect. A simple approximation:
            command.videoFilter('edgedetect=low=0.1:high=0.4,eq=saturation=2');
            break;
        // More styles can be added here
        default:
            // Default to a simple black and white for demonstration if style is unknown
            command.videoFilter('format=gray');
            break;
    }

    command
        .on('start', (commandLine) => {
            console.log('Spawned Ffmpeg with command: ' + commandLine);
        })
        .on('error', (err) => {
            console.error('An error occurred: ' + err.message);
            // Cleanup input file
            fs.unlinkSync(inputPath);
            res.status(500).send('Error during video conversion.');
        })
        .on('end', () => {
            console.log('Processing finished successfully.');
            // Cleanup input file
            fs.unlinkSync(inputPath);
            // Send back the URL to the converted video
            res.json({
                success: true,
                downloadUrl: `http://localhost:${port}/converted/${outputFilename}`
            });
        })
        .save(outputPath);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Video conversion server listening at http://localhost:${port}`);
}); 