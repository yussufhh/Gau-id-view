# Advanced Security Features for GAU-ID-View
import hashlib
import time
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify, current_app, g
from flask_jwt_extended import get_jwt, verify_jwt_in_request, get_jwt_identity
from models import db, User
from utils.helpers import error_response
from utils.logging_config import log_security_event
import re

# In-memory store for blacklisted tokens (use Redis in production)
BLACKLISTED_TOKENS = set()
LOGIN_ATTEMPTS = {}  # IP -> {attempts, last_attempt, locked_until}
FAILED_LOGIN_ATTEMPTS = {}  # user_id -> {attempts, last_attempt, locked_until}

# Security configuration
MAX_LOGIN_ATTEMPTS = 5
LOCKOUT_DURATION = 15 * 60  # 15 minutes
IP_LOCKOUT_DURATION = 30 * 60  # 30 minutes
TOKEN_BLACKLIST_CLEANUP_INTERVAL = 3600  # 1 hour

class SecurityManager:
    """Manages advanced security features"""
    
    def __init__(self, app=None):
        self.app = app
        if app:
            self.init_app(app)
    
    def init_app(self, app):
        """Initialize security features"""
        
        from flask_jwt_extended import JWTManager
        
        # Get JWT manager instance
        jwt = app.extensions.get('flask-jwt-extended')
        
        if jwt:
            # JWT token blacklist callbacks
            @jwt.token_in_blocklist_loader
            def check_if_token_revoked(jwt_header, jwt_payload):
                jti = jwt_payload['jti']
                return jti in BLACKLISTED_TOKENS
            
            # Custom JWT error handlers with security logging
            @jwt.revoked_token_loader
            def revoked_token_callback(jwt_header, jwt_payload):
                log_security_event(
                    'REVOKED_TOKEN_ACCESS_ATTEMPT',
                    {'jti': jwt_payload.get('jti'), 'sub': jwt_payload.get('sub')},
                    'WARNING'
                )
                return error_response('Token has been revoked', status_code=401)
        
        # Cleanup blacklisted tokens periodically
        @app.before_request
        def cleanup_expired_tokens():
            if hasattr(g, '_token_cleanup_done'):
                return
            g._token_cleanup_done = True
            self.cleanup_expired_blacklisted_tokens()

    def cleanup_expired_blacklisted_tokens(self):
        """Remove expired tokens from blacklist"""
        current_time = time.time()
        # Simple cleanup - in production use Redis with TTL
        # This is a placeholder for the cleanup logic
        pass

def is_ip_locked(ip_address):
    """Check if IP address is locked due to too many failed attempts"""
    if ip_address in LOGIN_ATTEMPTS:
        attempt_data = LOGIN_ATTEMPTS[ip_address]
        if 'locked_until' in attempt_data and time.time() < attempt_data['locked_until']:
            return True
    return False

def is_user_locked(user_id):
    """Check if user account is locked due to too many failed attempts"""
    if user_id in FAILED_LOGIN_ATTEMPTS:
        attempt_data = FAILED_LOGIN_ATTEMPTS[user_id]
        if 'locked_until' in attempt_data and time.time() < attempt_data['locked_until']:
            return True
    return False

def record_failed_login_attempt(ip_address, user_id=None):
    """Record failed login attempt for IP and optionally user"""
    current_time = time.time()
    
    # Record IP-based attempt
    if ip_address not in LOGIN_ATTEMPTS:
        LOGIN_ATTEMPTS[ip_address] = {'attempts': 0, 'last_attempt': current_time}
    
    LOGIN_ATTEMPTS[ip_address]['attempts'] += 1
    LOGIN_ATTEMPTS[ip_address]['last_attempt'] = current_time
    
    # Lock IP if too many attempts
    if LOGIN_ATTEMPTS[ip_address]['attempts'] >= MAX_LOGIN_ATTEMPTS:
        LOGIN_ATTEMPTS[ip_address]['locked_until'] = current_time + IP_LOCKOUT_DURATION
        log_security_event(
            'IP_LOCKOUT',
            {'ip_address': ip_address, 'attempts': LOGIN_ATTEMPTS[ip_address]['attempts']},
            'WARNING'
        )
    
    # Record user-based attempt if user_id provided
    if user_id:
        if user_id not in FAILED_LOGIN_ATTEMPTS:
            FAILED_LOGIN_ATTEMPTS[user_id] = {'attempts': 0, 'last_attempt': current_time}
        
        FAILED_LOGIN_ATTEMPTS[user_id]['attempts'] += 1
        FAILED_LOGIN_ATTEMPTS[user_id]['last_attempt'] = current_time
        
        # Lock user if too many attempts
        if FAILED_LOGIN_ATTEMPTS[user_id]['attempts'] >= MAX_LOGIN_ATTEMPTS:
            FAILED_LOGIN_ATTEMPTS[user_id]['locked_until'] = current_time + LOCKOUT_DURATION
            log_security_event(
                'USER_ACCOUNT_LOCKOUT',
                {'user_id': user_id, 'attempts': FAILED_LOGIN_ATTEMPTS[user_id]['attempts']},
                'WARNING'
            )

def reset_login_attempts(ip_address, user_id=None):
    """Reset login attempts on successful login"""
    if ip_address in LOGIN_ATTEMPTS:
        del LOGIN_ATTEMPTS[ip_address]
    
    if user_id and user_id in FAILED_LOGIN_ATTEMPTS:
        del FAILED_LOGIN_ATTEMPTS[user_id]

def blacklist_token(jti):
    """Add token to blacklist"""
    BLACKLISTED_TOKENS.add(jti)
    log_security_event(
        'TOKEN_BLACKLISTED',
        {'jti': jti},
        'INFO'
    )

def validate_password_strength(password):
    """Validate password meets security requirements"""
    errors = []
    
    if len(password) < 8:
        errors.append("Password must be at least 8 characters long")
    
    if len(password) > 128:
        errors.append("Password must be less than 128 characters long")
    
    if not re.search(r'[A-Z]', password):
        errors.append("Password must contain at least one uppercase letter")
    
    if not re.search(r'[a-z]', password):
        errors.append("Password must contain at least one lowercase letter")
    
    if not re.search(r'\d', password):
        errors.append("Password must contain at least one number")
    
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        errors.append("Password must contain at least one special character")
    
    # Check for common patterns
    common_patterns = [
        r'123456', r'password', r'qwerty', r'abc123', r'admin', r'letmein'
    ]
    
    for pattern in common_patterns:
        if re.search(pattern, password, re.IGNORECASE):
            errors.append("Password contains common patterns and is not secure")
            break
    
    # Check for repeated characters
    if re.search(r'(.)\1{2,}', password):
        errors.append("Password cannot contain more than 2 consecutive identical characters")
    
    return errors

def check_password_history(user, new_password):
    """Check if password was used recently (placeholder - implement with password history table)"""
    # In production, implement password history checking
    # This prevents users from reusing recent passwords
    return True

def generate_security_headers():
    """Generate security headers for responses"""
    return {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
        'Referrer-Policy': 'strict-origin-when-cross-origin'
    }

def security_headers(func):
    """Decorator to add security headers to responses"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        response = func(*args, **kwargs)
        
        # Add security headers
        if hasattr(response, 'headers'):
            for header, value in generate_security_headers().items():
                response.headers[header] = value
        
        return response
    
    return wrapper

def rate_limit_check(func):
    """Decorator for additional rate limiting checks"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        ip_address = request.remote_addr
        
        # Check if IP is locked
        if is_ip_locked(ip_address):
            log_security_event(
                'BLOCKED_REQUEST_FROM_LOCKED_IP',
                {'ip_address': ip_address},
                'WARNING'
            )
            return error_response('Too many failed attempts. Try again later.', status_code=429)
        
        return func(*args, **kwargs)
    
    return wrapper

def validate_session_integrity():
    """Validate session integrity and detect hijacking attempts"""
    try:
        from flask import has_request_context
        
        if not has_request_context():
            return True
        
        verify_jwt_in_request()
        jwt_data = get_jwt()
        
        # Check token age
        iat = jwt_data.get('iat', 0)
        current_time = time.time()
        token_age = current_time - iat
        
        # Token is too old (longer than expected)
        max_token_age = 24 * 3600  # 24 hours
        if token_age > max_token_age:
            log_security_event(
                'EXPIRED_TOKEN_USAGE_ATTEMPT',
                {'token_age': token_age, 'iat': iat},
                'WARNING'
            )
            return False
        
        # Check for user agent consistency (basic session hijacking detection)
        user_agent = request.headers.get('User-Agent', '')
        stored_user_agent = jwt_data.get('user_agent', '')
        
        if stored_user_agent and user_agent != stored_user_agent:
            log_security_event(
                'USER_AGENT_MISMATCH',
                {'current_ua': user_agent, 'stored_ua': stored_user_agent},
                'CRITICAL'
            )
            return False
        
        return True
        
    except Exception as e:
        if has_request_context():
            log_security_event(
                'SESSION_VALIDATION_ERROR',
                {'error': str(e)},
                'ERROR'
            )
        return False

def detect_suspicious_activity():
    """Detect and log suspicious activities"""
    suspicious_patterns = [
        # SQL injection attempts
        (r'(union|select|insert|delete|drop|create|alter|exec|script)', 'SQL_INJECTION_ATTEMPT'),
        
        # XSS attempts  
        (r'(<script|javascript:|onerror|onload)', 'XSS_ATTEMPT'),
        
        # Path traversal
        (r'(\.\./|\.\.\\|%2e%2e%2f)', 'PATH_TRAVERSAL_ATTEMPT'),
        
        # Command injection
        (r'(;|&&|\|\||`|\$\()', 'COMMAND_INJECTION_ATTEMPT')
    ]
    
    # Check request data
    request_data = ''
    if request.is_json:
        request_data = str(request.get_json())
    elif request.form:
        request_data = str(dict(request.form))
    
    request_data += request.path + request.query_string.decode()
    
    for pattern, event_type in suspicious_patterns:
        if re.search(pattern, request_data, re.IGNORECASE):
            log_security_event(
                event_type,
                {
                    'pattern': pattern,
                    'request_data': request_data[:500],  # Limit data size
                    'path': request.path
                },
                'CRITICAL'
            )
            return True
    
    return False

def secure_endpoint(require_fresh=False):
    """Enhanced security decorator for sensitive endpoints"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Basic rate limiting check
            ip_address = request.remote_addr
            if is_ip_locked(ip_address):
                return error_response('Too many failed attempts. Try again later.', status_code=429)
            
            # Detect suspicious activity
            if detect_suspicious_activity():
                return error_response('Suspicious activity detected', status_code=403)
            
            # Validate session integrity
            if not validate_session_integrity():
                return error_response('Session validation failed', status_code=401)
            
            # Check for fresh token if required
            if require_fresh:
                jwt_data = get_jwt()
                if not jwt_data.get('fresh', False):
                    log_security_event(
                        'FRESH_TOKEN_REQUIRED',
                        {'endpoint': request.endpoint},
                        'INFO'
                    )
                    return error_response('Fresh token required for this action', status_code=401)
            
            # Add security headers
            response = func(*args, **kwargs)
            if hasattr(response, 'headers'):
                for header, value in generate_security_headers().items():
                    response.headers[header] = value
            
            return response
        
        return wrapper
    return decorator

def audit_sensitive_action(action_type):
    """Decorator to audit sensitive actions"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Log before action
            log_security_event(
                'SENSITIVE_ACTION_STARTED',
                {
                    'action_type': action_type,
                    'function': func.__name__,
                    'endpoint': request.endpoint
                },
                'INFO'
            )
            
            try:
                result = func(*args, **kwargs)
                
                # Log successful completion
                log_security_event(
                    'SENSITIVE_ACTION_COMPLETED',
                    {
                        'action_type': action_type,
                        'function': func.__name__,
                        'success': True
                    },
                    'INFO'
                )
                
                return result
                
            except Exception as e:
                # Log failure
                log_security_event(
                    'SENSITIVE_ACTION_FAILED',
                    {
                        'action_type': action_type,
                        'function': func.__name__,
                        'error': str(e),
                        'success': False
                    },
                    'ERROR'
                )
                raise
        
        return wrapper
    return decorator

# Export security functions
__all__ = [
    'SecurityManager', 'is_ip_locked', 'is_user_locked', 
    'record_failed_login_attempt', 'reset_login_attempts',
    'blacklist_token', 'validate_password_strength',
    'security_headers', 'rate_limit_check', 'secure_endpoint',
    'audit_sensitive_action'
]