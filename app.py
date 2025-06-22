import os
from flask import Flask, request, send_from_directory, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from moviepy.editor import VideoFileClip

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
CONVERTED_FOLDER = 'converted'
ALLOWED_EXTENSIONS = {'mp4', 'mov', 'avi', 'mkv'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['CONVERTED_FOLDER'] = CONVERTED_FOLDER

# Create directories if they don't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(CONVERTED_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/convert', methods=['POST'])
def convert_video():
    if 'video' not in request.files:
        return jsonify({'error': 'No video file found'}), 400
    
    file = request.files['video']
    style = request.form.get('style', 'grayscale')

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        input_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(input_path)

        output_filename = f"converted_{os.path.splitext(filename)[0]}.mp4"
        output_path = os.path.join(app.config['CONVERTED_FOLDER'], output_filename)

        try:
            # --- Video Processing with MoviePy ---
            video_clip = VideoFileClip(input_path)
            
            # Apply effect based on style
            if style == 'pixel':
                # A simple pixelation effect
                final_clip = video_clip.resize(width=160).resize(video_clip.size)
            elif style == 'cartoon':
                 # NOTE: A true cartoon effect is very complex. This is a placeholder.
                 # Using a grayscale effect to demonstrate functionality.
                final_clip = video_clip.fx(vfx.blackwhite)
            else: # Default to grayscale
                final_clip = video_clip.fx(vfx.blackwhite)

            final_clip.write_videofile(output_path, codec='libx264')
            video_clip.close()

            # Clean up uploaded file
            os.remove(input_path)

            download_url = request.host_url + f'converted/{output_filename}'
            return jsonify({'success': True, 'downloadUrl': download_url})

        except Exception as e:
            # Clean up if conversion fails
            if os.path.exists(input_path):
                os.remove(input_path)
            print(f"Error: {e}")
            return jsonify({'error': 'Failed to convert video.'}), 500

    return jsonify({'error': 'Invalid file type'}), 400

@app.route('/converted/<filename>')
def get_converted_file(filename):
    return send_from_directory(app.config['CONVERTED_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True, port=5000) 