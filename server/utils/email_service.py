# Professional Email Service for GAU-ID-View
import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from flask import current_app, render_template_string
from flask_mail import Mail, Message
from datetime import datetime, timedelta
from threading import Thread
import uuid

class EmailService:
    """Professional email service for GAU-ID-View notifications"""
    
    def __init__(self, app=None):
        self.mail = None
        if app:
            self.init_app(app)
    
    def init_app(self, app):
        """Initialize email service with Flask app"""
        self.mail = Mail(app)
        
        # Configure email settings
        app.config.setdefault('MAIL_SERVER', os.environ.get('MAIL_SERVER', 'smtp.gmail.com'))
        app.config.setdefault('MAIL_PORT', int(os.environ.get('MAIL_PORT', 587)))
        app.config.setdefault('MAIL_USE_TLS', True)
        app.config.setdefault('MAIL_USE_SSL', False)
        app.config.setdefault('MAIL_USERNAME', os.environ.get('MAIL_USERNAME'))
        app.config.setdefault('MAIL_PASSWORD', os.environ.get('MAIL_PASSWORD'))
        app.config.setdefault('MAIL_DEFAULT_SENDER', os.environ.get('MAIL_DEFAULT_SENDER', 'admin@gau.ac.ke'))
    
    def send_async_email(self, app, msg):
        """Send email asynchronously"""
        with app.app_context():
            try:
                self.mail.send(msg)
                current_app.logger.info(f"Email sent successfully to {msg.recipients}")
            except Exception as e:
                current_app.logger.error(f"Failed to send email to {msg.recipients}: {str(e)}")

    def _log_email_for_development(self, subject, recipients, html_body):
        """Log email details for development/testing"""
        try:
            print("\n" + "="*60)
            print("📧 EMAIL NOTIFICATION (Development Mode)")
            print("="*60)
            print(f"📮 To: {', '.join(recipients)}")
            print(f"📋 Subject: {subject}")
            print(f"📅 Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
            print("💌 Email would be sent with professional GAU-ID-View template")
            print("🎯 Status: Logged for development (SMTP not configured)")
            print("="*60)
            
            # Also log to file if possible
            log_file = "email_log.txt"
            with open(log_file, 'a', encoding='utf-8') as f:
                f.write(f"\n[{datetime.now()}] Email to {recipients}: {subject}\n")
            
            current_app.logger.info(f"Development email logged: {subject} to {recipients}")
            
        except Exception as e:
            print(f"Email logging error: {e}")
            current_app.logger.warning(f"Email logging failed: {e}")

    def send_email(self, subject, recipients, html_body, text_body=None, attachments=None):
        """Send email with professional formatting"""
        try:
            # Check if mail is configured
            if not self.mail:
                # Development mode - log email instead of sending
                self._log_email_for_development(subject, recipients, html_body)
                return True
                
            # Check if SMTP credentials are configured
            if not current_app.config.get('MAIL_USERNAME') or current_app.config.get('MAIL_USERNAME') == 'gauviewsystem@gmail.com':
                # Development mode - log email instead of sending
                self._log_email_for_development(subject, recipients, html_body)
                return True
                
            msg = Message(
                subject=subject,
                recipients=recipients,
                html=html_body,
                body=text_body or self._strip_html(html_body),
                sender=current_app.config['MAIL_DEFAULT_SENDER']
            )
            
            # Add attachments if provided
            if attachments:
                for attachment in attachments:
                    msg.attach(
                        attachment['filename'],
                        attachment['content_type'],
                        attachment['data']
                    )
            
            # Send email asynchronously
            thread = Thread(
                target=self.send_async_email,
                args=(current_app._get_current_object(), msg)
            )
            thread.daemon = True
            thread.start()
            
            return True
            
        except Exception as e:
            current_app.logger.error(f"Email sending error: {str(e)}")
            return False
    
    def _strip_html(self, html_content):
        """Convert HTML to plain text for fallback"""
        import re
        clean = re.compile('<.*?>')
        return re.sub(clean, '', html_content)

# Email template generator
class EmailTemplateGenerator:
    """Generate professional email templates for GAU-ID-View"""
    
    @staticmethod
    def get_base_template():
        """Base email template with GAU-ID-View branding"""
        return """
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>{{ subject }}</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333333;
                    background-color: #f8fafc;
                }
                
                .email-container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                    border-radius: 12px;
                    overflow: hidden;
                }
                
                .email-header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 40px 30px;
                    text-align: center;
                    position: relative;
                }
                
                .email-header::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
                    opacity: 0.3;
                }
                
                .logo-container {
                    position: relative;
                    z-index: 1;
                }
                
                .university-logo {
                    width: 80px;
                    height: 80px;
                    background-color: rgba(255, 255, 255, 0.15);
                    border-radius: 50%;
                    margin: 0 auto 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    font-weight: bold;
                    border: 3px solid rgba(255, 255, 255, 0.3);
                }
                
                .university-name {
                    font-size: 28px;
                    font-weight: 700;
                    margin-bottom: 8px;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }
                
                .system-name {
                    font-size: 16px;
                    opacity: 0.95;
                    font-weight: 300;
                    letter-spacing: 1px;
                }
                
                .email-body {
                    padding: 40px 30px;
                }
                
                .welcome-message {
                    font-size: 20px;
                    font-weight: 600;
                    color: #2d3748;
                    margin-bottom: 20px;
                }
                
                .content-section {
                    margin-bottom: 30px;
                }
                
                .info-card {
                    background-color: #f7fafc;
                    border-left: 4px solid #667eea;
                    padding: 20px;
                    border-radius: 0 8px 8px 0;
                    margin: 20px 0;
                }
                
                .info-item {
                    display: flex;
                    align-items: center;
                    margin-bottom: 12px;
                    font-size: 15px;
                }
                
                .info-item:last-child {
                    margin-bottom: 0;
                }
                
                .info-label {
                    font-weight: 600;
                    color: #4a5568;
                    min-width: 120px;
                    display: inline-block;
                }
                
                .info-value {
                    color: #2d3748;
                    font-weight: 500;
                }
                
                .highlight-box {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 25px;
                    border-radius: 12px;
                    text-align: center;
                    margin: 25px 0;
                }
                
                .action-button {
                    display: inline-block;
                    background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
                    color: white;
                    padding: 14px 30px;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 16px;
                    margin: 15px 0;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(72, 187, 120, 0.3);
                }
                
                .action-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(72, 187, 120, 0.4);
                }
                
                .steps-container {
                    background-color: #f7fafc;
                    padding: 25px;
                    border-radius: 12px;
                    margin: 25px 0;
                }
                
                .step-item {
                    display: flex;
                    align-items: flex-start;
                    margin-bottom: 20px;
                    padding-bottom: 20px;
                    border-bottom: 1px solid #e2e8f0;
                }
                
                .step-item:last-child {
                    margin-bottom: 0;
                    padding-bottom: 0;
                    border-bottom: none;
                }
                
                .step-number {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    font-size: 14px;
                    margin-right: 15px;
                    flex-shrink: 0;
                }
                
                .step-content {
                    flex: 1;
                }
                
                .step-title {
                    font-weight: 600;
                    color: #2d3748;
                    margin-bottom: 5px;
                }
                
                .step-description {
                    color: #718096;
                    font-size: 14px;
                    line-height: 1.5;
                }
                
                .email-footer {
                    background-color: #2d3748;
                    color: #a0aec0;
                    padding: 30px;
                    text-align: center;
                }
                
                .footer-logo {
                    width: 50px;
                    height: 50px;
                    background-color: rgba(255, 255, 255, 0.1);
                    border-radius: 50%;
                    margin: 0 auto 15px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                    font-weight: bold;
                }
                
                .footer-content {
                    font-size: 14px;
                    line-height: 1.6;
                }
                
                .contact-info {
                    margin-top: 20px;
                    padding-top: 20px;
                    border-top: 1px solid #4a5568;
                }
                
                .social-links {
                    margin-top: 15px;
                }
                
                .social-link {
                    display: inline-block;
                    margin: 0 10px;
                    color: #a0aec0;
                    text-decoration: none;
                    font-size: 14px;
                }
                
                .divider {
                    height: 2px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: none;
                    margin: 30px 0;
                    border-radius: 2px;
                }
                
                @media (max-width: 600px) {
                    .email-container {
                        margin: 10px;
                        border-radius: 8px;
                    }
                    
                    .email-header, .email-body, .email-footer {
                        padding: 25px 20px;
                    }
                    
                    .university-name {
                        font-size: 24px;
                    }
                    
                    .welcome-message {
                        font-size: 18px;
                    }
                    
                    .info-item {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    
                    .info-label {
                        margin-bottom: 5px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                {{ content }}
            </div>
        </body>
        </html>
        """
    
    @staticmethod
    def generate_welcome_email(user_data):
        """Generate professional welcome email for new students"""
        
        content = """
        <div class="email-header">
            <div class="logo-container">
                <div class="university-logo">GAU</div>
                <div class="university-name">Garissa University</div>
                <div class="system-name">Student ID Management System</div>
            </div>
        </div>
        
        <div class="email-body">
            <div class="welcome-message">
                Welcome to GAU-ID-View, {{ user_data.name }}! 🎉
            </div>
            
            <div class="content-section">
                <p style="font-size: 16px; color: #4a5568; line-height: 1.6; margin-bottom: 20px;">
                    Congratulations! Your student account has been successfully created. We're excited to have you join the 
                    Garissa University community and look forward to supporting your academic journey.
                </p>
            </div>
            
            <div class="info-card">
                <h3 style="color: #2d3748; margin-bottom: 15px; font-size: 18px;">📋 Your Account Details</h3>
                <div class="info-item">
                    <span class="info-label">👤 Full Name:</span>
                    <span class="info-value">{{ user_data.name }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">🎓 Registration No:</span>
                    <span class="info-value">{{ user_data.reg_number }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">✉️ Email Address:</span>
                    <span class="info-value">{{ user_data.email }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">🏫 Department:</span>
                    <span class="info-value">{{ user_data.department }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">📅 Registration Date:</span>
                    <span class="info-value">{{ registration_date }}</span>
                </div>
            </div>
            
            <div class="highlight-box">
                <h3 style="margin-bottom: 10px; font-size: 20px;">🚀 Ready to Get Your Student ID?</h3>
                <p style="margin-bottom: 20px; opacity: 0.95;">
                    Complete your profile and apply for your official student ID card through our secure portal.
                </p>
                <a href="{{ login_url }}" class="action-button">Access Your Portal</a>
            </div>
            
            <div class="content-section">
                <h3 style="color: #2d3748; margin-bottom: 20px; font-size: 18px;">📝 Next Steps to Complete Your Profile</h3>
                <div class="steps-container">
                    <div class="step-item">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <div class="step-title">Log into Your Account</div>
                            <div class="step-description">Use your email address and the password you created during registration to access your student portal.</div>
                        </div>
                    </div>
                    
                    <div class="step-item">
                        <div class="step-number">2</div>
                        <div class="step-content">
                            <div class="step-title">Complete Your Profile</div>
                            <div class="step-description">Add your personal information including phone number, address, course details, and next of kin information.</div>
                        </div>
                    </div>
                    
                    <div class="step-item">
                        <div class="step-number">3</div>
                        <div class="step-content">
                            <div class="step-title">Upload Required Documents</div>
                            <div class="step-description">Upload a passport-style photograph and any required supporting documents for verification.</div>
                        </div>
                    </div>
                    
                    <div class="step-item">
                        <div class="step-number">4</div>
                        <div class="step-content">
                            <div class="step-title">Submit ID Application</div>
                            <div class="step-description">Review your information and submit your student ID card application for administrative approval.</div>
                        </div>
                    </div>
                    
                    <div class="step-item">
                        <div class="step-number">5</div>
                        <div class="step-content">
                            <div class="step-title">Receive Your ID Card</div>
                            <div class="step-description">Once approved and printed, collect your official student ID card from the designated office.</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <hr class="divider">
            
            <div class="content-section">
                <h3 style="color: #2d3748; margin-bottom: 15px; font-size: 18px;">📚 Important Information</h3>
                <ul style="color: #4a5568; font-size: 15px; line-height: 1.7; padding-left: 20px;">
                    <li style="margin-bottom: 8px;">Your student ID card is required for access to university facilities and services</li>
                    <li style="margin-bottom: 8px;">Keep your login credentials secure and do not share them with others</li>
                    <li style="margin-bottom: 8px;">You will receive email notifications about your application status updates</li>
                    <li style="margin-bottom: 8px;">Contact the Student Services office if you need any assistance</li>
                </ul>
            </div>
            
            <div class="info-card" style="border-left-color: #ed8936;">
                <h3 style="color: #2d3748; margin-bottom: 15px; font-size: 18px;">🔒 Security & Privacy</h3>
                <p style="color: #4a5568; font-size: 15px; line-height: 1.6;">
                    Your personal information is protected using industry-standard security measures. We never share your data 
                    with third parties without your consent. If you suspect any unauthorized access to your account, please 
                    contact us immediately.
                </p>
            </div>
        </div>
        
        <div class="email-footer">
            <div class="footer-logo">GAU</div>
            <div class="footer-content">
                <strong>Garissa University</strong><br>
                Student ID Management System<br>
                P.O. Box 1234, Garissa, Kenya
            </div>
            <div class="contact-info">
                <div style="margin-bottom: 10px;">
                    📧 <a href="mailto:support@gau.ac.ke" style="color: #a0aec0;">support@gau.ac.ke</a> | 
                    📞 +254 123 456 789
                </div>
                <div style="font-size: 13px; opacity: 0.8; margin-top: 15px;">
                    © {{ current_year }} Garissa University. All rights reserved.
                </div>
            </div>
            <div class="social-links">
                <a href="#" class="social-link">Website</a>
                <a href="#" class="social-link">Student Portal</a>
                <a href="#" class="social-link">Help Center</a>
            </div>
        </div>
        """
        
        base_template = EmailTemplateGenerator.get_base_template()
        
        # Prepare template variables
        template_vars = {
            'subject': 'Welcome to GAU-ID-View - Your Account is Ready!',
            'content': content,
            'user_data': user_data,
            'registration_date': datetime.now().strftime('%B %d, %Y'),
            'login_url': 'http://localhost:5173/login',  # Update with actual frontend URL
            'current_year': datetime.now().year
        }
        
        return render_template_string(base_template, **template_vars)
    
    @staticmethod
    def generate_application_status_email(user_data, status, details=None):
        """Generate email for application status updates"""
        
        status_messages = {
            'approved': {
                'title': 'Application Approved! 🎉',
                'message': 'Great news! Your student ID card application has been approved.',
                'color': '#48bb78',
                'icon': '✅'
            },
            'rejected': {
                'title': 'Application Update Required 📝',
                'message': 'Your application needs some updates before we can proceed.',
                'color': '#f56565',
                'icon': '❌'
            },
            'printed': {
                'title': 'ID Card Printed 🖨️',
                'message': 'Your student ID card has been printed and is ready for collection.',
                'color': '#667eea',
                'icon': '🆔'
            },
            'issued': {
                'title': 'ID Card Issued 🎊',
                'message': 'Congratulations! Your student ID card has been issued.',
                'color': '#38a169',
                'icon': '🎯'
            }
        }
        
        status_info = status_messages.get(status, status_messages['approved'])
        login_url = 'http://localhost:5173/login'
        
        content = f"""
        <div class="email-header">
            <div class="logo-container">
                <div class="university-logo">GAU</div>
                <div class="university-name">Garissa University</div>
                <div class="system-name">Student ID Management System</div>
            </div>
        </div>
        
        <div class="email-body">
            <div class="welcome-message">
                {status_info['icon']} {status_info['title']}
            </div>
            
            <div class="content-section">
                <p style="font-size: 16px; color: #4a5568; line-height: 1.6; margin-bottom: 20px;">
                    Hello {user_data.name}, {status_info['message']}
                </p>
            </div>
            
            <div class="highlight-box" style="background: linear-gradient(135deg, {status_info['color']} 0%, {status_info['color']}dd 100%);">
                <h3 style="margin-bottom: 15px; font-size: 20px;">Application Status: {status.title()}</h3>
                <p style="margin-bottom: 20px; opacity: 0.95;">
                    {details if details else 'Your application has been processed successfully.'}
                </p>
                <a href="{login_url}" class="action-button">View Details</a>
            </div>
        </div>
        
        <div class="email-footer">
            <div class="footer-logo">GAU</div>
            <div class="footer-content">
                <strong>Garissa University</strong><br>
                Student ID Management System
            </div>
        </div>
        """
        
        base_template = EmailTemplateGenerator.get_base_template()
        
        template_vars = {
            'subject': f'GAU-ID-View: {status_info["title"]}',
            'content': content,
            'login_url': login_url
        }
        
        return render_template_string(base_template, **template_vars)

# Email notification functions
def send_welcome_email(user_data):
    """Send welcome email to new student"""
    try:
        email_service = EmailService()
        
        html_content = EmailTemplateGenerator.generate_welcome_email(user_data)
        
        return email_service.send_email(
            subject='🎉 Welcome to GAU-ID-View - Your Account is Ready!',
            recipients=[user_data.email],
            html_body=html_content
        )
        
    except Exception as e:
        current_app.logger.error(f"Failed to send welcome email: {str(e)}")
        return False

def send_status_update_email(user_data, status, details=None):
    """Send application status update email"""
    try:
        email_service = EmailService()
        
        html_content = EmailTemplateGenerator.generate_application_status_email(
            user_data, status, details
        )
        
        status_titles = {
            'approved': 'Application Approved! 🎉',
            'rejected': 'Application Update Required 📝',
            'printed': 'ID Card Printed 🖨️',
            'issued': 'ID Card Issued 🎊'
        }
        
        subject = f"GAU-ID-View: {status_titles.get(status, 'Status Update')}"
        
        return email_service.send_email(
            subject=subject,
            recipients=[user_data.email],
            html_body=html_content
        )
        
    except Exception as e:
        current_app.logger.error(f"Failed to send status update email: {str(e)}")
        return False

# Export main functions
__all__ = [
    'EmailService', 'EmailTemplateGenerator', 
    'send_welcome_email', 'send_status_update_email'
]