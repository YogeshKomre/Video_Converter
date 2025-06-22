# Video Animator - Convert Videos to Animation

A modern, responsive web application that allows users to convert normal videos into animated videos with different artistic styles.

## Features

### 🎨 **Modern UI Design**
- Beautiful gradient background with animated floating shapes
- Neon text effects with glowing animations
- Smooth hover effects and transitions
- Responsive design for all devices

### 📁 **Video Upload**
- Drag and drop functionality
- Click to browse file option
- Support for all video formats
- Real-time video preview
- File information display

### 🎭 **Animation Styles**
- **Cartoon**: Classic cartoon-style animation with outlined shapes
- **Anime**: Japanese anime style with sakura petals
- **Pixel Art**: Retro pixel art animation
- **Watercolor**: Flowing watercolor paint effects

### ⚡ **Conversion Process**
- Simulated video processing with loading animations
- Progress indication based on file size
- Real-time status updates
- Error handling and success notifications

### 💾 **Download Functionality**
- Automatic download after conversion
- Custom filename with style information
- WebM format output
- Success confirmation

## How to Use

1. **Open the Website**
   - Open `index.html` in your web browser
   - The website will load with the animated background

2. **Upload Your Video**
   - Drag and drop a video file onto the upload area
   - Or click "Choose File" to browse and select a video
   - Supported formats: MP4, AVI, MOV, WebM, etc.

3. **Preview Your Video**
   - After upload, you'll see a preview of your video
   - File information will be displayed (name, size, type)

4. **Select Animation Style**
   - Choose from 4 different animation styles:
     - 🎨 Cartoon
     - 🌸 Anime
     - 👾 Pixel Art
     - 🎨 Watercolor
   - Click on any style to select it

5. **Convert to Animation**
   - Click the "Convert to Animation" button
   - Watch the loading animation during processing
   - Processing time depends on file size

6. **Download Your Animation**
   - Once conversion is complete, the result will be displayed
   - Click "Download Animated Video" to save your file
   - The file will be saved with the format: `animated_[filename]_[style].webm`

## Technical Details

### Frontend Technologies
- **HTML5**: Semantic structure and video elements
- **CSS3**: Modern styling with gradients, animations, and responsive design
- **JavaScript (ES6+)**: Interactive functionality and video processing

### Key Features
- **Canvas API**: Used for creating animated video frames
- **File API**: Handles file uploads and drag-and-drop
- **Blob API**: Manages video data and downloads
- **Web Animations**: Smooth transitions and loading states

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## File Structure

```
video_converter/
├── index.html          # Main HTML file
├── styles.css          # CSS styling and animations
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## Customization

### Adding New Animation Styles
1. Add a new option card in `index.html`
2. Create a new drawing function in `script.js`
3. Add the case in the `drawAnimatedFrame` function
4. Update the style selection logic

### Modifying Colors
- Edit the CSS variables in `styles.css`
- Main colors: `#ff6b6b` (coral), `#4ecdc4` (turquoise), `#45b7d1` (blue)

### Changing Background Animation
- Modify the `.shape` classes in `styles.css`
- Adjust the `@keyframes float` animation

## Notes

- This is a demonstration application with simulated video conversion
- In a production environment, you would integrate with actual video processing APIs
- The canvas-based animation is for demonstration purposes
- Real video conversion would require server-side processing

## Future Enhancements

- [ ] Real video processing integration
- [ ] More animation styles
- [ ] Video quality settings
- [ ] Batch processing
- [ ] Social media sharing
- [ ] User accounts and history

## License

This project is open source and available under the MIT License.

---

**Enjoy creating amazing animated videos! 🎬✨** 