// DOM elements
const uploadArea = document.getElementById('uploadArea');
const videoInput = document.getElementById('videoInput');
const videoPreview = document.getElementById('videoPreview');
const previewVideo = document.getElementById('previewVideo');
const videoInfo = document.getElementById('videoInfo');
const convertBtn = document.getElementById('convertBtn');
const resultSection = document.getElementById('resultSection');
const resultVideo = document.getElementById('resultVideo');
const downloadBtn = document.getElementById('downloadBtn');
const optionCards = document.querySelectorAll('.option-card');

// State variables
let selectedFile = null;
let selectedStyle = 'cartoon';
let convertedVideoBlob = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    initializeAnimationOptions();
});

// Initialize all event listeners
function initializeEventListeners() {
    // File input change
    videoInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop events
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    uploadArea.addEventListener('click', () => videoInput.click());
    
    // Convert button
    convertBtn.addEventListener('click', handleConvert);
    
    // Download button
    downloadBtn.addEventListener('click', handleDownload);
}

// Initialize animation style options
function initializeAnimationOptions() {
    optionCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove selected class from all cards
            optionCards.forEach(c => c.classList.remove('selected'));
            // Add selected class to clicked card
            card.classList.add('selected');
            selectedStyle = card.dataset.style;
        });
    });
    
    // Set default selection
    optionCards[0].classList.add('selected');
}

// Handle file selection
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
        processVideoFile(file);
    } else {
        showError('Please select a valid video file.');
    }
}

// Handle drag over
function handleDragOver(event) {
    event.preventDefault();
    uploadArea.classList.add('dragover');
}

// Handle drag leave
function handleDragLeave(event) {
    event.preventDefault();
    uploadArea.classList.remove('dragover');
}

// Handle drop
function handleDrop(event) {
    event.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('video/')) {
            processVideoFile(file);
        } else {
            showError('Please drop a valid video file.');
        }
    }
}

// Process video file
function processVideoFile(file) {
    selectedFile = file;
    
    // Create video URL
    const videoURL = URL.createObjectURL(file);
    
    // Set video source
    previewVideo.src = videoURL;
    
    // Show video preview
    videoPreview.style.display = 'block';
    
    // Display video info
    displayVideoInfo(file);
    
    // Enable convert button
    convertBtn.disabled = false;
    
    // Scroll to video preview
    videoPreview.scrollIntoView({ behavior: 'smooth' });
}

// Display video information
function displayVideoInfo(file) {
    const fileSize = formatFileSize(file.size);
    const duration = getVideoDuration(previewVideo);
    
    videoInfo.innerHTML = `
        <strong>File Name:</strong> ${file.name}<br>
        <strong>File Size:</strong> ${fileSize}<br>
        <strong>File Type:</strong> ${file.type}<br>
        <strong>Selected Style:</strong> ${selectedStyle.charAt(0).toUpperCase() + selectedStyle.slice(1)}
    `;
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Get video duration
function getVideoDuration(video) {
    return new Promise((resolve) => {
        video.addEventListener('loadedmetadata', () => {
            const duration = video.duration;
            const minutes = Math.floor(duration / 60);
            const seconds = Math.floor(duration % 60);
            resolve(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        });
    });
}

// Handle convert button click
async function handleConvert() {
    if (!selectedFile) {
        showError('Please select a video file first.');
        return;
    }
    
    // Show loading state
    showLoadingState();
    
    // Simulate a delay for the conversion process
    setTimeout(() => {
        try {
            // In this simulation, we'll just reuse the original video
            // to show the result section.
            const originalVideoURL = URL.createObjectURL(selectedFile);
            showConversionResult(originalVideoURL);
        } catch (error) {
            showError('An error occurred during the simulation.');
            hideLoadingState();
        }
    }, 2500); // Simulate a 2.5 second conversion
}

// Show loading state
function showLoadingState() {
    const btnText = convertBtn.querySelector('.btn-text');
    const btnLoader = convertBtn.querySelector('.btn-loader');
    
    btnText.style.display = 'none';
    btnLoader.style.display = 'flex';
    convertBtn.disabled = true;
}

// Hide loading state
function hideLoadingState() {
    const btnText = convertBtn.querySelector('.btn-text');
    const btnLoader = convertBtn.querySelector('.btn-loader');
    
    btnText.style.display = 'block';
    btnLoader.style.display = 'none';
    convertBtn.disabled = false;
}

// Show conversion result
function showConversionResult(videoUrl) {
    hideLoadingState();
    
    // Set video source to the result URL
    resultVideo.src = videoUrl;
    
    // Show result section
    resultSection.style.display = 'block';
    
    // Scroll to result
    resultSection.scrollIntoView({ behavior: 'smooth' });
    
    // Add success animation
    resultSection.style.animation = 'fadeInUp 0.5s ease';
}

// Handle download
function handleDownload() {
    if (resultVideo.src) {
        const a = document.createElement('a');
        a.href = resultVideo.src;
        // Let's pretend it's converted by changing the name
        a.download = `animated_${selectedFile.name.replace(/\.[^/.]+$/, '')}_${selectedStyle}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        showSuccess('Video downloaded successfully!');
    } else {
        showError('No result video to download.');
    }
}

// Show error message
function showError(message) {
    // Create error notification
    const notification = document.createElement('div');
    notification.className = 'notification error';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #ff6b6b, #ee5a52);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(255, 107, 107, 0.3);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Show success message
function showSuccess(message) {
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #4ecdc4, #44a08d);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(78, 205, 196, 0.3);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add notification animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style); 