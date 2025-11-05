# Production Logging Configuration for GAU-ID-View
import os
import logging
import logging.handlers
from datetime import datetime
from flask import request, g, current_app
import json
import traceback
from functools import wraps

class JSONFormatter(logging.Formatter):
    """Custom JSON formatter for structured logging"""
    
    def format(self, record):
        log_entry = {
            'timestamp': datetime.utcfromtimestamp(record.created).isoformat() + 'Z',
            'level': record.levelname,
            'logger': record.name,
            'message': record.getMessage(),
            'module': record.module,
            'function': record.funcName,
            'line': record.lineno
        }
        
        # Add request context if available
        from flask import has_request_context
        
        try:
            if has_request_context():
                if hasattr(g, 'request_id'):
                    log_entry['request_id'] = g.request_id
                
                if request:
                    log_entry['request'] = {
                        'method': request.method,
                        'path': request.path,
                        'ip': request.remote_addr,
                        'user_agent': request.headers.get('User-Agent', ''),
                        'content_type': request.content_type
                    }
                    
                    # Add user info if authenticated
                    if hasattr(g, 'current_user') and g.current_user:
                        log_entry['user'] = {
                            'id': g.current_user.id,
                            'email': g.current_user.email,
                            'role': g.current_user.role
                        }
        except RuntimeError:
            # Outside request context
            pass
        
        # Add exception info if present
        if record.exc_info:
            log_entry['exception'] = {
                'type': record.exc_info[0].__name__,
                'message': str(record.exc_info[1]),
                'traceback': traceback.format_exception(*record.exc_info)
            }
        
        # Add extra fields
        if hasattr(record, 'extra_data'):
            log_entry['extra'] = record.extra_data
        
        return json.dumps(log_entry, default=str)

class RequestIdFilter(logging.Filter):
    """Add request ID to log records"""
    
    def filter(self, record):
        from flask import has_request_context
        
        try:
            if has_request_context() and hasattr(g, 'request_id'):
                record.request_id = g.request_id
            else:
                record.request_id = None
        except RuntimeError:
            record.request_id = None
        return True

def setup_logging(app):
    """Setup comprehensive logging for the application"""
    
    # Create logs directory
    log_dir = os.path.join(app.root_path, 'logs')
    os.makedirs(log_dir, exist_ok=True)
    
    # Configure root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.INFO)
    
    # Remove default handlers
    for handler in root_logger.handlers[:]:
        root_logger.removeHandler(handler)
    
    # Create formatters
    json_formatter = JSONFormatter()
    console_formatter = logging.Formatter(
        '%(asctime)s [%(levelname)s] %(name)s: %(message)s'
    )
    
    # Console handler for development
    if app.config.get('FLASK_ENV') == 'development':
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.DEBUG)
        console_handler.setFormatter(console_formatter)
        root_logger.addHandler(console_handler)
    
    # File handler for all logs with rotation
    file_handler = logging.handlers.RotatingFileHandler(
        os.path.join(log_dir, 'app.log'),
        maxBytes=10485760,  # 10MB
        backupCount=10
    )
    file_handler.setLevel(logging.INFO)
    file_handler.setFormatter(json_formatter)
    file_handler.addFilter(RequestIdFilter())
    root_logger.addHandler(file_handler)
    
    # Error log handler
    error_handler = logging.handlers.RotatingFileHandler(
        os.path.join(log_dir, 'error.log'),
        maxBytes=10485760,
        backupCount=5
    )
    error_handler.setLevel(logging.ERROR)
    error_handler.setFormatter(json_formatter)
    error_handler.addFilter(RequestIdFilter())
    root_logger.addHandler(error_handler)
    
    # Security log handler
    security_logger = logging.getLogger('security')
    security_handler = logging.handlers.RotatingFileHandler(
        os.path.join(log_dir, 'security.log'),
        maxBytes=5242880,  # 5MB
        backupCount=10
    )
    security_handler.setLevel(logging.INFO)
    security_handler.setFormatter(json_formatter)
    security_handler.addFilter(RequestIdFilter())
    security_logger.addHandler(security_handler)
    security_logger.setLevel(logging.INFO)
    
    # Performance log handler
    perf_logger = logging.getLogger('performance')
    perf_handler = logging.handlers.RotatingFileHandler(
        os.path.join(log_dir, 'performance.log'),
        maxBytes=5242880,
        backupCount=5
    )
    perf_handler.setLevel(logging.INFO)
    perf_handler.setFormatter(json_formatter)
    perf_logger.addHandler(perf_handler)
    perf_logger.setLevel(logging.INFO)
    
    # Set specific logger levels
    logging.getLogger('werkzeug').setLevel(logging.WARNING)
    logging.getLogger('sqlalchemy.engine').setLevel(logging.WARNING)
    
    app.logger.info('Logging system initialized')

def log_request_start():
    """Log request start with timing"""
    g.start_time = datetime.utcnow()
    g.request_id = generate_request_id()
    
    current_app.logger.info('Request started', extra={
        'extra_data': {
            'method': request.method,
            'path': request.path,
            'query_string': request.query_string.decode(),
            'content_length': request.content_length,
            'request_id': g.request_id
        }
    })

def log_request_end(response):
    """Log request completion with metrics"""
    if hasattr(g, 'start_time'):
        duration = (datetime.utcnow() - g.start_time).total_seconds()
        
        # Log to performance logger for slow requests
        if duration > 1.0:  # Slow requests > 1 second
            perf_logger = logging.getLogger('performance')
            perf_logger.warning('Slow request detected', extra={
                'extra_data': {
                    'duration': duration,
                    'path': request.path,
                    'method': request.method,
                    'status_code': response.status_code,
                    'request_id': g.request_id
                }
            })
        
        current_app.logger.info('Request completed', extra={
            'extra_data': {
                'duration': duration,
                'status_code': response.status_code,
                'response_size': len(response.get_data()),
                'request_id': g.request_id
            }
        })
    
    return response

def log_security_event(event_type, details=None, severity='INFO'):
    """Log security-related events"""
    from flask import has_request_context
    
    security_logger = logging.getLogger('security')
    
    log_data = {
        'event_type': event_type,
        'timestamp': datetime.utcnow().isoformat(),
        'details': details or {}
    }
    
    # Only access request context if available
    if has_request_context():
        try:
            log_data['ip_address'] = request.remote_addr
            log_data['user_agent'] = request.headers.get('User-Agent')
            
            if hasattr(g, 'current_user') and g.current_user:
                log_data['user_id'] = g.current_user.id
                log_data['user_email'] = g.current_user.email
        except RuntimeError:
            pass
    
    if severity == 'CRITICAL':
        security_logger.critical(f'Security event: {event_type}', extra={'extra_data': log_data})
    elif severity == 'ERROR':
        security_logger.error(f'Security event: {event_type}', extra={'extra_data': log_data})
    elif severity == 'WARNING':
        security_logger.warning(f'Security event: {event_type}', extra={'extra_data': log_data})
    else:
        security_logger.info(f'Security event: {event_type}', extra={'extra_data': log_data})

def generate_request_id():
    """Generate unique request ID"""
    import uuid
    return str(uuid.uuid4())[:8]

def log_database_query(query, duration=None):
    """Log slow database queries"""
    if duration and duration > 0.5:  # Log queries > 500ms
        current_app.logger.warning('Slow database query', extra={
            'extra_data': {
                'query': str(query),
                'duration': duration,
                'type': 'database_performance'
            }
        })

def log_user_activity(action, details=None):
    """Log user activities for audit trail"""
    if hasattr(g, 'current_user') and g.current_user:
        current_app.logger.info(f'User activity: {action}', extra={
            'extra_data': {
                'user_id': g.current_user.id,
                'user_email': g.current_user.email,
                'user_role': g.current_user.role,
                'action': action,
                'details': details or {},
                'ip_address': request.remote_addr if request else None,
                'type': 'user_activity'
            }
        })

def log_api_usage(endpoint, method, status_code, duration):
    """Log API usage statistics"""
    api_logger = logging.getLogger('api_usage')
    api_logger.info('API call', extra={
        'extra_data': {
            'endpoint': endpoint,
            'method': method,
            'status_code': status_code,
            'duration': duration,
            'timestamp': datetime.utcnow().isoformat(),
            'type': 'api_usage'
        }
    })

def audit_log(func):
    """Decorator to audit function calls"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = datetime.utcnow()
        
        try:
            result = func(*args, **kwargs)
            
            # Log successful execution
            log_user_activity(
                f'Function executed: {func.__name__}',
                {
                    'function': func.__name__,
                    'args_count': len(args),
                    'kwargs_count': len(kwargs),
                    'success': True
                }
            )
            
            return result
            
        except Exception as e:
            # Log failed execution
            current_app.logger.error(f'Function failed: {func.__name__}', extra={
                'extra_data': {
                    'function': func.__name__,
                    'error': str(e),
                    'error_type': type(e).__name__,
                    'args_count': len(args),
                    'kwargs_count': len(kwargs)
                }
            }, exc_info=True)
            
            raise
        
        finally:
            duration = (datetime.utcnow() - start_time).total_seconds()
            if duration > 2.0:  # Log slow functions
                current_app.logger.warning(f'Slow function: {func.__name__}', extra={
                    'extra_data': {
                        'function': func.__name__,
                        'duration': duration,
                        'type': 'performance_issue'
                    }
                })
    
    return wrapper

class LogManager:
    """Centralized log management"""
    
    def __init__(self, app=None):
        self.app = app
        if app:
            self.init_app(app)
    
    def init_app(self, app):
        """Initialize logging for Flask app"""
        setup_logging(app)
        
        # Add request logging middleware
        @app.before_request
        def before_request():
            log_request_start()
        
        @app.after_request
        def after_request(response):
            return log_request_end(response)
        
        # Add error logging
        @app.errorhandler(Exception)
        def log_exception(error):
            current_app.logger.error('Unhandled exception', exc_info=True, extra={
                'extra_data': {
                    'error_type': type(error).__name__,
                    'error_message': str(error),
                    'path': request.path if request else None,
                    'method': request.method if request else None
                }
            })
            
            # Log security events for certain errors
            if isinstance(error, (PermissionError, ValueError)):
                log_security_event(
                    'SUSPICIOUS_ACTIVITY',
                    {'error': str(error), 'path': request.path},
                    'WARNING'
                )
            
            # Re-raise the error
            raise error

# Export commonly used functions
__all__ = [
    'setup_logging', 'log_security_event', 'log_user_activity',
    'log_database_query', 'audit_log', 'LogManager'
]