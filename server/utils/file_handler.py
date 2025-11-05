# File upload handling for GAU-ID-View
import os
import uuid
from datetime import datetime
from werkzeug.utils import secure_filename
from PIL import Image
import mimetypes
from flask import current_app, request
from utils.helpers import error_response, success_response

# Allowed file extensions
ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
ALLOWED_DOCUMENT_EXTENSIONS = {'pdf', 'doc', 'docx'}
ALL_ALLOWED_EXTENSIONS = ALLOWED_IMAGE_EXTENSIONS | ALLOWED_DOCUMENT_EXTENSIONS

# File size limits (in bytes)
MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5MB
MAX_DOCUMENT_SIZE = 10 * 1024 * 1024  # 10MB

def allowed_file(filename, file_type='image'):
    """Check if file extension is allowed"""
    if '.' not in filename:
        return False
    
    extension = filename.rsplit('.', 1)[1].lower()
    
    if file_type == 'image':
        return extension in ALLOWED_IMAGE_EXTENSIONS
    elif file_type == 'document':
        return extension in ALLOWED_DOCUMENT_EXTENSIONS
    else:
        return extension in ALL_ALLOWED_EXTENSIONS

def validate_image_file(file):
    """Validate uploaded image file"""
    try:
        # Check if it's a valid image
        img = Image.open(file)
        img.verify()
        file.seek(0)  # Reset file pointer
        
        # Check image dimensions (optional constraints)
        img = Image.open(file)
        width, height = img.size
        
        # Passport photo constraints
        if width < 300 or height < 400:
            return False, "Image too small. Minimum size: 300x400 pixels"
        
        if width > 2000 or height > 2000:
            return False, "Image too large. Maximum size: 2000x2000 pixels"
        
        # Check aspect ratio for passport photos (roughly 3:4)
        aspect_ratio = width / height
        if aspect_ratio < 0.6 or aspect_ratio > 0.9:
            return False, "Invalid aspect ratio. Please use a passport-style photo"
        
        file.seek(0)  # Reset file pointer again
        return True, "Valid image"
        
    except Exception as e:
        return False, f"Invalid image file: {str(e)}"

def generate_unique_filename(original_filename, user_id, file_type):
    """Generate unique filename for uploaded file"""
    extension = original_filename.rsplit('.', 1)[1].lower()
    timestamp = int(datetime.utcnow().timestamp())
    unique_id = str(uuid.uuid4())[:8]
    
    return f"{file_type}_{user_id}_{timestamp}_{unique_id}.{extension}"

def save_uploaded_file(file, user_id, file_type='photo', subfolder=None):
    """
    Save uploaded file to the appropriate directory
    
    Args:
        file: The uploaded file object
        user_id: User ID for file organization
        file_type: 'photo' or 'document'
        subfolder: Optional subfolder (e.g., 'profiles', 'documents')
    
    Returns:
        tuple: (success, message, file_path)
    """
    try:
        if not file or file.filename == '':
            return False, "No file selected", None
        
        # Validate file type
        if not allowed_file(file.filename, 'image' if file_type == 'photo' else 'document'):
            return False, f"File type not allowed. Allowed types: {ALLOWED_IMAGE_EXTENSIONS if file_type == 'photo' else ALLOWED_DOCUMENT_EXTENSIONS}", None
        
        # Check file size
        file.seek(0, 2)  # Go to end of file
        file_size = file.tell()
        file.seek(0)  # Reset to beginning
        
        max_size = MAX_IMAGE_SIZE if file_type == 'photo' else MAX_DOCUMENT_SIZE
        if file_size > max_size:
            return False, f"File too large. Maximum size: {max_size // (1024*1024)}MB", None
        
        # Validate image files
        if file_type == 'photo':
            is_valid, message = validate_image_file(file)
            if not is_valid:
                return False, message, None
        
        # Generate secure filename
        filename = generate_unique_filename(file.filename, user_id, file_type)
        
        # Create directory structure
        upload_dir = current_app.config.get('UPLOAD_FOLDER', 'uploads')
        if subfolder:
            save_dir = os.path.join(upload_dir, file_type + 's', subfolder)
        else:
            save_dir = os.path.join(upload_dir, file_type + 's')
        
        os.makedirs(save_dir, exist_ok=True)
        
        # Save file
        file_path = os.path.join(save_dir, filename)
        file.save(file_path)
        
        # Generate relative path for database storage
        relative_path = os.path.relpath(file_path, upload_dir)
        
        # Optimize image if it's a photo
        if file_type == 'photo':
            optimize_image(file_path)
        
        current_app.logger.info(f"File uploaded successfully: {relative_path}")
        return True, "File uploaded successfully", relative_path
        
    except Exception as e:
        current_app.logger.error(f"File upload error: {str(e)}")
        return False, f"Upload failed: {str(e)}", None

def optimize_image(file_path, max_width=800, quality=85):
    """Optimize uploaded image for web use"""
    try:
        with Image.open(file_path) as img:
            # Convert to RGB if necessary
            if img.mode in ('RGBA', 'P'):
                img = img.convert('RGB')
            
            # Resize if too large
            if img.width > max_width:
                ratio = max_width / img.width
                new_height = int(img.height * ratio)
                img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
            
            # Save with optimization
            img.save(file_path, 'JPEG', quality=quality, optimize=True)
            
    except Exception as e:
        current_app.logger.error(f"Image optimization error: {str(e)}")

def delete_file(file_path):
    """Delete a file from the upload directory"""
    try:
        upload_dir = current_app.config.get('UPLOAD_FOLDER', 'uploads')
        full_path = os.path.join(upload_dir, file_path)
        
        if os.path.exists(full_path):
            os.remove(full_path)
            current_app.logger.info(f"File deleted: {file_path}")
            return True, "File deleted successfully"
        else:
            return False, "File not found"
            
    except Exception as e:
        current_app.logger.error(f"File deletion error: {str(e)}")
        return False, f"Delete failed: {str(e)}"

def get_file_url(file_path):
    """Generate URL for accessing uploaded file"""
    if not file_path:
        return None
    
    # In production, this would be served by nginx or CDN
    return f"/uploads/{file_path}"

def validate_file_type(file):
    """Validate file type using multiple methods"""
    try:
        # Check MIME type
        mime_type, _ = mimetypes.guess_type(file.filename)
        
        # Read file header to verify actual type
        file.seek(0)
        header = file.read(512)
        file.seek(0)
        
        # Common file signatures
        image_signatures = {
            b'\xFF\xD8\xFF': 'jpeg',
            b'\x89PNG': 'png',
            b'GIF8': 'gif',
        }
        
        pdf_signature = b'%PDF'
        
        # Check for image files
        for signature, file_type in image_signatures.items():
            if header.startswith(signature):
                return True, file_type
        
        # Check for PDF
        if header.startswith(pdf_signature):
            return True, 'pdf'
        
        return False, 'unknown'
        
    except Exception as e:
        return False, f'validation_error: {str(e)}'