# Simplified app for testing without complex logging
import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import config
from models import db, bcrypt
from utils.helpers import error_response
from utils.email_service import EmailService

def create_simple_app(config_name=None):
    """Simplified application factory for testing"""
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'development')
    
    app = Flask(__name__)
    app.config.from_object(config.get(config_name, config['default']))
    
    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    jwt = JWTManager(app)
    email_service = EmailService(app)
    
    # Configure CORS
    CORS(app, 
         origins=['http://localhost:5173', 'http://localhost:3000'],
         supports_credentials=True,
         allow_headers=['Content-Type', 'Authorization'],
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
    
    # Basic JWT error handlers
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return error_response("Token has expired", status_code=401)
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return error_response("Invalid token", status_code=401)
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return error_response("Authorization token is required", status_code=401)
    
    # Global error handlers
    @app.errorhandler(404)
    def not_found(error):
        return error_response("Resource not found", status_code=404)
    
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return error_response("Internal server error", status_code=500)
    
    # Register blueprints
    from routes.auth import auth_bp
    from routes.student import student_bp
    from routes.admin import admin_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(student_bp)
    app.register_blueprint(admin_bp)
    
    # Health check endpoint
    @app.route('/health')
    def health_check():
        from datetime import datetime
        return jsonify({
            'status': 'healthy',
            'message': 'GAU-ID-View Backend API is running',
            'version': '1.0.0',
            'timestamp': datetime.utcnow().isoformat()
        })
    
    # API info endpoint
    @app.route('/api/info')
    def api_info():
        return jsonify({
            'name': 'GAU-ID-View Backend API',
            'version': '1.0.0',
            'description': 'Backend API for Garissa University Student ID Management System',
            'university': app.config.get('UNIVERSITY_NAME', 'Garissa University'),
            'endpoints': {
                'auth': '/auth/*',
                'student': '/student/*',
                'admin': '/admin/*',
                'health': '/health'
            }
        })
    
    # Create database tables
    with app.app_context():
        # Initialize database
        db.create_all()
        
        # Ensure upload directory exists
        upload_dir = app.config.get('UPLOAD_FOLDER', 'uploads')
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)
            os.makedirs(os.path.join(upload_dir, 'photos'))
            os.makedirs(os.path.join(upload_dir, 'documents'))
    
    return app

# Create the application instance
app = create_simple_app()

if __name__ == '__main__':
    # Development server
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV', 'development') == 'development'
    
    print("🚀 Starting GAU-ID-View Backend (Simplified)")
    print(f"🔗 Server will run on http://localhost:{port}")
    print("📚 API Documentation: http://localhost:5000/api/info")
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug
    )