# Main Flask Application for GAU-ID-View Backend
import os
from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from config import config
from models import db, bcrypt
from utils.helpers import setup_logger, error_response
from utils.logging_config import LogManager, log_security_event, log_user_activity
from utils.security import SecurityManager

def create_app(config_name=None):
    """Application factory pattern"""
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'development')
    
    app = Flask(__name__)
    app.config.from_object(config.get(config_name, config['default']))
    
    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    jwt = JWTManager(app)
    app.jwt_manager = jwt  # Store reference for security manager
    
    # Initialize rate limiter
    limiter = Limiter(
        key_func=get_remote_address,
        default_limits=["1000 per day", "100 per hour"],
        storage_uri="memory://"
    )
    limiter.init_app(app)
    
    # Configure CORS
    CORS(app, 
         origins=['http://localhost:5173', 'http://localhost:3000'],  # React dev servers
         supports_credentials=True,
         allow_headers=['Content-Type', 'Authorization'],
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
    
    # JWT error handlers
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
        app.logger.error(f"Internal server error: {str(error)}")
        return error_response("Internal server error", status_code=500)
    
    @app.errorhandler(400)
    def bad_request(error):
        return error_response("Bad request", status_code=400)
    
    @app.errorhandler(403)
    def forbidden(error):
        return error_response("Forbidden", status_code=403)
    
    # Request validation
    @app.before_request
    def before_request():
        # Skip validation for OPTIONS requests (CORS preflight)
        if request.method == 'OPTIONS':
            return
        
        # Validate JSON content type for POST/PUT requests
        if request.method in ['POST', 'PUT'] and request.content_type:
            if 'application/json' not in request.content_type and 'multipart/form-data' not in request.content_type:
                return error_response("Content-Type must be application/json or multipart/form-data", status_code=400)
    
    # Register blueprints
    from routes.auth import auth_bp
    from routes.student import student_bp
    from routes.admin import admin_bp
    from api_docs import api_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(student_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(api_bp)
    
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
            },
            'documentation': '/api/docs'  # Future endpoint for API docs
        })
    
    # Create database tables
    with app.app_context():
        # Ensure upload directory exists
        upload_dir = app.config.get('UPLOAD_FOLDER', 'uploads')
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)
            os.makedirs(os.path.join(upload_dir, 'photos'))
            os.makedirs(os.path.join(upload_dir, 'documents'))
        
        # Setup advanced logging
        log_manager = LogManager(app)
        
        # Setup advanced security (after JWT manager is set)
        security_manager = SecurityManager(app)
        
        app.logger.info('GAU-ID-View Backend API created successfully')
    
    return app

# Initialize the database when this module is run directly
def init_db():
    """Initialize database tables"""
    app = create_app()
    with app.app_context():
        db.create_all()
        print("Database tables created successfully!")

# Create the application instance
app = create_app()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)

if __name__ == '__main__':
    # Development server
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV', 'development') == 'development'
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug
    )