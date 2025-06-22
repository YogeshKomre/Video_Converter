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

    const formData = new FormData();
    formData.append('video', selectedFile);
    formData.append('style', selectedStyle);

    try {
        const response = await fetch('/convert', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Conversion failed: ${errorText}`);
        }

        const result = await response.json();
        
        if (result.success) {
            showConversionResult(result.downloadUrl);
        } else {
            throw new Error('Conversion returned an error.');
        }

    } catch (error) {
        console.error(error);
        showError(error.message || 'Conversion failed. Please try again.');
        hideLoadingState();
    }
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

// Simulate conversion process
function simulateConversion() {
    return new Promise((resolve) => {
        // Simulate processing time based on file size
        const processingTime = Math.min(selectedFile.size / 1000000 * 1000, 5000); // Max 5 seconds
        
        setTimeout(() => {
            // Create a simulated converted video (in real app, this would be the actual converted video)
            createSimulatedConvertedVideo();
            resolve();
        }, processingTime);
    });
}

// Create simulated converted video
function createSimulatedConvertedVideo() {
    // In a real application, this would be the actual converted video
    // For demo purposes, we'll create a canvas-based animation
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    
    // Create a simple animated video
    let frame = 0;
    const animate = () => {
        // Clear canvas
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw animated elements based on selected style
        drawAnimatedFrame(ctx, frame, selectedStyle);
        
        frame++;
        if (frame < 300) { // 5 seconds at 60fps
            requestAnimationFrame(animate);
        }
    };
    
    animate();
    
    // Convert canvas to blob
    canvas.toBlob((blob) => {
        convertedVideoBlob = blob;
    }, 'video/webm');
}

// Draw animated frame based on style
function drawAnimatedFrame(ctx, frame, style) {
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;
    const time = frame * 0.1;
    
    switch (style) {
        case 'cartoon':
            drawCartoonStyle(ctx, centerX, centerY, time);
            break;
        case 'anime':
            drawAnimeStyle(ctx, centerX, centerY, time);
            break;
        case 'pixel':
            drawPixelStyle(ctx, centerX, centerY, time);
            break;
        case 'watercolor':
            drawWatercolorStyle(ctx, centerX, centerY, time);
            break;
    }
}

// Draw cartoon style animation
function drawCartoonStyle(ctx, centerX, centerY, time) {
    // Draw animated circles
    for (let i = 0; i < 5; i++) {
        const x = centerX + Math.cos(time + i) * 100;
        const y = centerY + Math.sin(time + i) * 100;
        const size = 20 + Math.sin(time * 2 + i) * 10;
        
        ctx.fillStyle = `hsl(${180 + i * 60}, 70%, 60%)`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add cartoon outline
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

// Draw anime style animation
function drawAnimeStyle(ctx, centerX, centerY, time) {
    // Draw sakura petals
    for (let i = 0; i < 8; i++) {
        const x = centerX + Math.cos(time + i) * 120;
        const y = centerY + Math.sin(time + i) * 120;
        const rotation = time + i;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        
        // Draw petal
        ctx.fillStyle = `hsl(${330 + i * 30}, 80%, 70%)`;
        ctx.beginPath();
        ctx.ellipse(0, 0, 15, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

// Draw pixel style animation
function drawPixelStyle(ctx, centerX, centerY, time) {
    const pixelSize = 8;
    const gridSize = 20;
    
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            const pixelX = centerX - (gridSize * pixelSize) / 2 + x * pixelSize;
            const pixelY = centerY - (gridSize * pixelSize) / 2 + y * pixelSize;
            
            const color = Math.sin(time + x * 0.5 + y * 0.5) > 0 ? '#ff6b6b' : '#4ecdc4';
            ctx.fillStyle = color;
            ctx.fillRect(pixelX, pixelY, pixelSize - 1, pixelSize - 1);
        }
    }
}

// Draw watercolor style animation
function drawWatercolorStyle(ctx, centerX, centerY, time) {
    // Draw flowing watercolor circles
    for (let i = 0; i < 6; i++) {
        const x = centerX + Math.cos(time * 0.5 + i) * 80;
        const y = centerY + Math.sin(time * 0.5 + i) * 80;
        const size = 30 + Math.sin(time + i) * 15;
        
        // Create gradient for watercolor effect
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        gradient.addColorStop(0, `hsla(${200 + i * 40}, 80%, 70%, 0.8)`);
        gradient.addColorStop(1, `hsla(${200 + i * 40}, 80%, 70%, 0.1)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Show conversion result
function showConversionResult(downloadUrl) {
    hideLoadingState();
    
    // Set video source to the converted video URL from the server
    resultVideo.src = downloadUrl;
    
    // Show result section
    resultSection.style.display = 'block';

    // Update download button
    downloadBtn.onclick = () => {
        window.open(downloadUrl, '_blank');
    };
    
    // Scroll to result
    resultSection.scrollIntoView({ behavior: 'smooth' });
    
    // Add success animation
    resultSection.style.animation = 'fadeInUp 0.5s ease';
}

// Handle download
function handleDownload() {
    // This function is now primarily handled by the new `onclick` handler
    // set in `showConversionResult`. We'll keep it for clarity.
    const downloadUrl = resultVideo.src;
    if (downloadUrl) {
        const a = document.createElement('a');
        a.href = downloadUrl;
        // The 'download' attribute might not work for cross-origin URLs,
        // so opening in a new tab is a more reliable way to let the user save.
        a.target = '_blank';
        // The filename is now set by the server.
        // a.download = `animated_${selectedFile.name.replace(/\.[^/.]+$/, '')}_${selectedStyle}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        showSuccess('Your download will start shortly!');
    } else {
        showError('No video to download.');
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