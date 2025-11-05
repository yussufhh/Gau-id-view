# Admin Routes for GAU-ID-View
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required
from models import User, StudentProfile, Announcement, AdminActivity, SystemSettings, db
from utils.helpers import (
    success_response, error_response, role_required, get_current_user,
    log_admin_activity, paginate_query, filter_students, generate_csv_export
)
from utils.analytics import AnalyticsManager
from utils.security import secure_endpoint, audit_sensitive_action
from schemas import (
    AnnouncementSchema, ApplicationActionSchema, BulkActionSchema,
    SystemSettingsSchema, StudentSearchSchema, validate_json, validate_args
)
from datetime import datetime, timedelta, date
from sqlalchemy import func, and_, or_

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

@admin_bp.route('/dashboard', methods=['GET'])
@role_required('admin', 'staff')
def get_dashboard():
    """Get admin dashboard statistics"""
    try:
        # Basic counts
        total_students = User.query.filter_by(role='student').count()
        total_applications = StudentProfile.query.count()
        
        # Status counts
        pending_apps = StudentProfile.query.filter_by(status='pending').count()
        reviewing_apps = StudentProfile.query.filter_by(status='reviewing').count()
        approved_apps = StudentProfile.query.filter_by(status='approved').count()
        rejected_apps = StudentProfile.query.filter_by(status='rejected').count()
        printed_cards = StudentProfile.query.filter_by(status='printed').count()
        issued_cards = StudentProfile.query.filter_by(status='issued').count()
        
        # Today's statistics
        today = datetime.utcnow().date()
        today_start = datetime.combine(today, datetime.min.time())
        today_end = datetime.combine(today, datetime.max.time())
        
        today_registrations = User.query.filter(
            and_(User.role == 'student', User.created_at.between(today_start, today_end))
        ).count()
        
        today_approvals = StudentProfile.query.filter(
            and_(StudentProfile.approved_at.between(today_start, today_end))
        ).count()
        
        # Weekly growth
        week_ago = datetime.utcnow() - timedelta(days=7)
        weekly_registrations = User.query.filter(
            and_(User.role == 'student', User.created_at >= week_ago)
        ).count()
        
        # Department breakdown
        dept_stats = db.session.query(
            User.department,
            func.count(User.id).label('count')
        ).filter_by(role='student').group_by(User.department).all()
        
        # Monthly registrations (last 12 months)
        monthly_stats = []
        for i in range(11, -1, -1):
            month_date = datetime.utcnow() - timedelta(days=i*30)
            month_start = month_date.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            next_month = month_start + timedelta(days=32)
            month_end = next_month.replace(day=1) - timedelta(seconds=1)
            
            count = User.query.filter(
                and_(
                    User.role == 'student',
                    User.created_at.between(month_start, month_end)
                )
            ).count()
            
            monthly_stats.append({
                'month': month_start.strftime('%b %Y'),
                'registrations': count
            })
        
        # Recent activities
        recent_activities = AdminActivity.query.order_by(
            AdminActivity.timestamp.desc()
        ).limit(10).all()
        
        dashboard_data = {
            'summary': {
                'total_students': total_students,
                'total_applications': total_applications,
                'pending_applications': pending_apps,
                'today_registrations': today_registrations,
                'today_approvals': today_approvals,
                'weekly_growth': weekly_registrations
            },
            'status_breakdown': {
                'pending': pending_apps,
                'reviewing': reviewing_apps,
                'approved': approved_apps,
                'rejected': rejected_apps,
                'printed': printed_cards,
                'issued': issued_cards
            },
            'department_stats': [
                {'department': dept, 'count': count} for dept, count in dept_stats
            ],
            'monthly_registrations': monthly_stats,
            'recent_activities': [activity.to_dict() for activity in recent_activities]
        }
        
        return success_response("Dashboard data retrieved successfully", data=dashboard_data)
        
    except Exception as e:
        current_app.logger.error(f"Admin dashboard error: {str(e)}")
        return error_response("Failed to retrieve dashboard data", status_code=500)

@admin_bp.route('/students', methods=['GET'])
@role_required('admin', 'staff')
def get_students():
    """Get paginated list of students with filters"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        # Build query
        query = User.query.filter_by(role='student')
        
        # Apply filters
        filters = {
            'department': request.args.get('department'),
            'status': request.args.get('status'),
            'year_of_study': request.args.get('year_of_study'),
            'search': request.args.get('search')
        }
        
        query = filter_students(query, filters)
        
        # Add sorting
        sort_by = request.args.get('sort_by', 'created_at')
        sort_order = request.args.get('sort_order', 'desc')
        
        if hasattr(User, sort_by):
            if sort_order == 'desc':
                query = query.order_by(getattr(User, sort_by).desc())
            else:
                query = query.order_by(getattr(User, sort_by))
        else:
            query = query.order_by(User.created_at.desc())
        
        # Paginate
        pagination_result = paginate_query(query, page, per_page)
        if not pagination_result:
            return error_response("Invalid pagination parameters", status_code=400)
        
        # Format student data with profiles
        students_data = []
        for student in pagination_result['items']:
            student_data = student.to_dict()
            if student.profile:
                student_data['profile'] = student.profile.to_dict()
            students_data.append(student_data)
        
        result = pagination_result.copy()
        result['items'] = students_data
        
        return success_response("Students retrieved successfully", data=result)
        
    except Exception as e:
        current_app.logger.error(f"Get students error: {str(e)}")
        return error_response("Failed to retrieve students", status_code=500)

@admin_bp.route('/students/<int:student_id>', methods=['GET'])
@role_required('admin', 'staff')
def get_student_details(student_id):
    """Get detailed information about a specific student"""
    try:
        student = User.query.filter_by(id=student_id, role='student').first()
        if not student:
            return error_response("Student not found", status_code=404)
        
        student_data = student.to_dict()
        if student.profile:
            student_data['profile'] = student.profile.to_dict()
        
        # Get admin activities for this student
        activities = AdminActivity.query.filter_by(target_user_id=student_id).order_by(
            AdminActivity.timestamp.desc()
        ).limit(20).all()
        
        student_data['admin_activities'] = [activity.to_dict() for activity in activities]
        
        return success_response("Student details retrieved successfully", data=student_data)
        
    except Exception as e:
        current_app.logger.error(f"Get student details error: {str(e)}")
        return error_response("Failed to retrieve student details", status_code=500)

@admin_bp.route('/approve/<int:student_id>', methods=['PUT'])
@role_required('admin', 'staff')
def approve_student(student_id):
    """Approve student ID application"""
    try:
        admin_user = get_current_user()
        student = User.query.filter_by(id=student_id, role='student').first()
        
        if not student or not student.profile:
            return error_response("Student or profile not found", status_code=404)
        
        profile = student.profile
        if profile.status not in ['pending', 'reviewing']:
            return error_response("Only pending or reviewing applications can be approved", status_code=400)
        
        data = request.get_json() or {}
        
        # Update profile status
        profile.status = 'approved'
        profile.approved_at = datetime.utcnow()
        profile.expiry_date = date.today() + timedelta(days=365)  # 1 year validity
        profile.admin_notes = data.get('notes', '')
        profile.last_updated = datetime.utcnow()
        
        db.session.commit()
        
        # Log admin activity
        log_admin_activity(
            admin_id=admin_user.id,
            action='approve_application',
            target_user_id=student_id,
            details=f"Approved ID application for {student.name} ({student.reg_number})"
        )
        
        current_app.logger.info(f"ID application approved for student {student_id} by admin {admin_user.id}")
        
        return success_response(
            "Student ID application approved successfully",
            data=profile.to_dict()
        )
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Approve student error: {str(e)}")
        return error_response("Failed to approve student application", status_code=500)

@admin_bp.route('/reject/<int:student_id>', methods=['PUT'])
@role_required('admin', 'staff')
def reject_student(student_id):
    """Reject student ID application"""
    try:
        admin_user = get_current_user()
        student = User.query.filter_by(id=student_id, role='student').first()
        
        if not student or not student.profile:
            return error_response("Student or profile not found", status_code=404)
        
        data = request.get_json()
        if not data or not data.get('reason'):
            return error_response("Rejection reason is required", status_code=400)
        
        profile = student.profile
        if profile.status not in ['pending', 'reviewing']:
            return error_response("Only pending or reviewing applications can be rejected", status_code=400)
        
        # Update profile status
        profile.status = 'rejected'
        profile.rejection_reason = data['reason'].strip()
        profile.admin_notes = data.get('notes', '')
        profile.last_updated = datetime.utcnow()
        
        db.session.commit()
        
        # Log admin activity
        log_admin_activity(
            admin_id=admin_user.id,
            action='reject_application',
            target_user_id=student_id,
            details=f"Rejected ID application for {student.name}: {data['reason']}"
        )
        
        current_app.logger.info(f"ID application rejected for student {student_id} by admin {admin_user.id}")
        
        return success_response(
            "Student ID application rejected",
            data=profile.to_dict()
        )
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Reject student error: {str(e)}")
        return error_response("Failed to reject student application", status_code=500)

@admin_bp.route('/bulk-approve', methods=['POST'])
@role_required('admin')
def bulk_approve_students():
    """Bulk approve multiple student applications"""
    try:
        admin_user = get_current_user()
        data = request.get_json()
        
        if not data or not data.get('student_ids'):
            return error_response("Student IDs are required", status_code=400)
        
        student_ids = data['student_ids']
        if not isinstance(student_ids, list):
            return error_response("Student IDs must be a list", status_code=400)
        
        # Get students with pending/reviewing profiles
        students = User.query.join(StudentProfile).filter(
            and_(
                User.id.in_(student_ids),
                User.role == 'student',
                StudentProfile.status.in_(['pending', 'reviewing'])
            )
        ).all()
        
        if not students:
            return error_response("No eligible students found for approval", status_code=404)
        
        approved_count = 0
        approved_students = []
        
        for student in students:
            profile = student.profile
            profile.status = 'approved'
            profile.approved_at = datetime.utcnow()
            profile.expiry_date = date.today() + timedelta(days=365)
            profile.admin_notes = data.get('notes', 'Bulk approved')
            profile.last_updated = datetime.utcnow()
            
            approved_students.append({
                'id': student.id,
                'name': student.name,
                'reg_number': student.reg_number
            })
            approved_count += 1
        
        db.session.commit()
        
        # Log admin activity
        log_admin_activity(
            admin_id=admin_user.id,
            action='bulk_approve_applications',
            details=f"Bulk approved {approved_count} applications"
        )
        
        current_app.logger.info(f"Bulk approved {approved_count} applications by admin {admin_user.id}")
        
        return success_response(
            f"Successfully approved {approved_count} student applications",
            data={
                'approved_count': approved_count,
                'approved_students': approved_students
            }
        )
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Bulk approve error: {str(e)}")
        return error_response("Failed to bulk approve applications", status_code=500)

@admin_bp.route('/remove/<int:student_id>', methods=['DELETE'])
@role_required('admin')
def remove_student(student_id):
    """Deactivate or delete student account"""
    try:
        admin_user = get_current_user()
        student = User.query.filter_by(id=student_id, role='student').first()
        
        if not student:
            return error_response("Student not found", status_code=404)
        
        data = request.get_json() or {}
        permanent_delete = data.get('permanent', False)
        
        if permanent_delete:
            # Permanent deletion (use with caution)
            db.session.delete(student)
            action = 'delete_student'
            message = "Student account permanently deleted"
        else:
            # Soft delete - deactivate account
            student.is_active = False
            student.updated_at = datetime.utcnow()
            action = 'deactivate_student'
            message = "Student account deactivated"
        
        db.session.commit()
        
        # Log admin activity
        log_admin_activity(
            admin_id=admin_user.id,
            action=action,
            target_user_id=student_id if not permanent_delete else None,
            details=f"{action.replace('_', ' ').title()}: {student.name} ({student.reg_number})"
        )
        
        current_app.logger.info(f"Student {student_id} {action} by admin {admin_user.id}")
        
        return success_response(message)
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Remove student error: {str(e)}")
        return error_response("Failed to remove student", status_code=500)

@admin_bp.route('/announcements', methods=['GET'])
@role_required('admin', 'staff')
def get_announcements():
    """Get all announcements"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        query = Announcement.query.order_by(Announcement.created_at.desc())
        
        # Filter by active status
        if request.args.get('active_only') == 'true':
            query = query.filter_by(is_active=True)
        
        pagination_result = paginate_query(query, page, per_page)
        if not pagination_result:
            return error_response("Invalid pagination parameters", status_code=400)
        
        # Format announcements data
        announcements_data = []
        for announcement in pagination_result['items']:
            ann_data = announcement.to_dict()
            if announcement.creator:
                ann_data['creator_name'] = announcement.creator.name
            announcements_data.append(ann_data)
        
        result = pagination_result.copy()
        result['items'] = announcements_data
        
        return success_response("Announcements retrieved successfully", data=result)
        
    except Exception as e:
        current_app.logger.error(f"Get announcements error: {str(e)}")
        return error_response("Failed to retrieve announcements", status_code=500)

@admin_bp.route('/announcement', methods=['POST'])
@role_required('admin', 'staff')
def create_announcement():
    """Create new announcement"""
    try:
        admin_user = get_current_user()
        data = request.get_json()
        
        if not data or not data.get('title') or not data.get('message'):
            return error_response("Title and message are required", status_code=400)
        
        # Parse expires_at if provided
        expires_at = None
        if data.get('expires_at'):
            try:
                expires_at = datetime.fromisoformat(data['expires_at'].replace('Z', '+00:00'))
            except ValueError:
                return error_response("Invalid expiry date format", status_code=400)
        
        announcement = Announcement(
            title=data['title'].strip(),
            message=data['message'].strip(),
            priority=data.get('priority', 'medium'),
            target_role=data.get('target_role', 'all'),
            created_by=admin_user.id,
            expires_at=expires_at
        )
        
        db.session.add(announcement)
        db.session.commit()
        
        # Log admin activity
        log_admin_activity(
            admin_id=admin_user.id,
            action='create_announcement',
            details=f"Created announcement: {announcement.title}"
        )
        
        current_app.logger.info(f"Announcement created by admin {admin_user.id}: {announcement.title}")
        
        return success_response(
            "Announcement created successfully",
            data=announcement.to_dict(),
            status_code=201
        )
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Create announcement error: {str(e)}")
        return error_response("Failed to create announcement", status_code=500)

@admin_bp.route('/analytics', methods=['GET'])
@role_required('admin', 'staff')
def get_analytics():
    """Get detailed analytics and statistics"""
    try:
        # Date range for analytics
        days = request.args.get('days', 30, type=int)
        start_date = datetime.utcnow() - timedelta(days=days)
        
        # Registration trends
        registrations_by_day = db.session.query(
            func.date(User.created_at).label('date'),
            func.count(User.id).label('count')
        ).filter(
            and_(User.role == 'student', User.created_at >= start_date)
        ).group_by(func.date(User.created_at)).all()
        
        # Status distribution
        status_counts = db.session.query(
            StudentProfile.status,
            func.count(StudentProfile.id).label('count')
        ).group_by(StudentProfile.status).all()
        
        # Department distribution
        dept_counts = db.session.query(
            User.department,
            func.count(User.id).label('count')
        ).filter_by(role='student').group_by(User.department).all()
        
        # Processing time analytics
        avg_processing_time = db.session.query(
            func.avg(
                func.julianday(StudentProfile.approved_at) - func.julianday(StudentProfile.submitted_at)
            )
        ).filter(StudentProfile.approved_at.isnot(None)).scalar()
        
        # Monthly growth
        monthly_growth = []
        for i in range(6):  # Last 6 months
            month_start = (datetime.utcnow().replace(day=1) - timedelta(days=30*i)).replace(day=1)
            next_month = (month_start + timedelta(days=32)).replace(day=1)
            
            count = User.query.filter(
                and_(
                    User.role == 'student',
                    User.created_at >= month_start,
                    User.created_at < next_month
                )
            ).count()
            
            monthly_growth.append({
                'month': month_start.strftime('%Y-%m'),
                'registrations': count
            })
        
        analytics_data = {
            'summary': {
                'total_students': User.query.filter_by(role='student').count(),
                'total_applications': StudentProfile.query.count(),
                'approval_rate': calculate_approval_rate(),
                'avg_processing_days': round(avg_processing_time or 0, 1)
            },
            'registrations_trend': [
                {
                    'date': reg_date.isoformat() if reg_date else None,
                    'count': count
                } for reg_date, count in registrations_by_day
            ],
            'status_distribution': [
                {'status': status, 'count': count} for status, count in status_counts
            ],
            'department_distribution': [
                {'department': dept, 'count': count} for dept, count in dept_counts
            ],
            'monthly_growth': monthly_growth
        }
        
        return success_response("Analytics retrieved successfully", data=analytics_data)
        
    except Exception as e:
        current_app.logger.error(f"Get analytics error: {str(e)}")
        return error_response("Failed to retrieve analytics", status_code=500)

@admin_bp.route('/export/students', methods=['GET'])
@role_required('admin')
def export_students():
    """Export students data as CSV"""
    try:
        # Get filters from query parameters
        filters = {
            'department': request.args.get('department'),
            'status': request.args.get('status'),
            'year_of_study': request.args.get('year_of_study'),
            'search': request.args.get('search')
        }
        
        # Build query
        query = User.query.filter_by(role='student')
        query = filter_students(query, filters)
        
        students = query.all()
        
        # Prepare data for CSV
        csv_data = []
        for student in students:
            profile = student.profile
            row = {
                'Name': student.name,
                'Registration Number': student.reg_number,
                'Email': student.email,
                'Department': student.department,
                'Phone': profile.phone if profile else '',
                'Course': profile.course if profile else '',
                'Year of Study': profile.year_of_study if profile else '',
                'ID Number': profile.id_number if profile else '',
                'Status': profile.status if profile else '',
                'Submitted Date': profile.submitted_at.strftime('%Y-%m-%d') if profile and profile.submitted_at else '',
                'Approved Date': profile.approved_at.strftime('%Y-%m-%d') if profile and profile.approved_at else '',
                'Card Printed': 'Yes' if profile and profile.card_printed else 'No',
                'Card Issued': 'Yes' if profile and profile.card_issued else 'No',
                'Created Date': student.created_at.strftime('%Y-%m-%d'),
                'Is Active': 'Yes' if student.is_active else 'No'
            }
            csv_data.append(row)
        
        csv_content = generate_csv_export(csv_data, 'students_export.csv')
        if not csv_content:
            return error_response("Failed to generate CSV export", status_code=500)
        
        # Log admin activity
        admin_user = get_current_user()
        log_admin_activity(
            admin_id=admin_user.id,
            action='export_students_data',
            details=f"Exported {len(csv_data)} student records"
        )
        
        return success_response(
            "Students data exported successfully",
            data={
                'csv_content': csv_content,
                'record_count': len(csv_data),
                'filename': f'gau_students_export_{datetime.now().strftime("%Y%m%d")}.csv'
            }
        )
        
    except Exception as e:
        current_app.logger.error(f"Export students error: {str(e)}")
        return error_response("Failed to export students data", status_code=500)

# Analytics endpoints
@admin_bp.route('/analytics/overview', methods=['GET'])
@role_required('admin', 'staff')
@secure_endpoint()
def get_analytics_overview():
    """Get comprehensive analytics overview"""
    try:
        analytics_data = AnalyticsManager.get_overview_stats()
        
        return success_response(
            "Analytics overview retrieved successfully",
            data=analytics_data
        )
        
    except Exception as e:
        current_app.logger.error(f"Analytics overview error: {str(e)}")
        return error_response("Failed to fetch analytics data", status_code=500)

@admin_bp.route('/analytics/trends', methods=['GET'])
@role_required('admin', 'staff')
@secure_endpoint()
def get_monthly_trends():
    """Get monthly trends analysis"""
    try:
        months = request.args.get('months', 12, type=int)
        if months > 24:  # Limit to 24 months
            months = 24
        
        trends_data = AnalyticsManager.get_monthly_trends(months)
        
        return success_response(
            "Monthly trends retrieved successfully",
            data={
                'trends': trends_data,
                'period_months': months
            }
        )
        
    except Exception as e:
        current_app.logger.error(f"Monthly trends error: {str(e)}")
        return error_response("Failed to fetch trends data", status_code=500)

@admin_bp.route('/analytics/departments', methods=['GET'])
@role_required('admin', 'staff')
@secure_endpoint()
def get_department_analytics():
    """Get department-wise analytics"""
    try:
        dept_stats = AnalyticsManager.get_department_statistics()
        
        return success_response(
            "Department analytics retrieved successfully",
            data=dept_stats
        )
        
    except Exception as e:
        current_app.logger.error(f"Department analytics error: {str(e)}")
        return error_response("Failed to fetch department analytics", status_code=500)

@admin_bp.route('/analytics/status-distribution', methods=['GET'])
@role_required('admin', 'staff')
@secure_endpoint()
def get_status_distribution():
    """Get application status distribution"""
    try:
        distribution = AnalyticsManager.get_status_distribution()
        
        return success_response(
            "Status distribution retrieved successfully",
            data=distribution
        )
        
    except Exception as e:
        current_app.logger.error(f"Status distribution error: {str(e)}")
        return error_response("Failed to fetch status distribution", status_code=500)

@admin_bp.route('/analytics/processing-times', methods=['GET'])
@role_required('admin', 'staff')
@secure_endpoint()
def get_processing_times():
    """Get average processing times"""
    try:
        processing_times = AnalyticsManager.get_processing_times()
        
        return success_response(
            "Processing times retrieved successfully",
            data=processing_times
        )
        
    except Exception as e:
        current_app.logger.error(f"Processing times error: {str(e)}")
        return error_response("Failed to fetch processing times", status_code=500)

@admin_bp.route('/analytics/system-health', methods=['GET'])
@role_required('admin')
@secure_endpoint()
def get_system_health():
    """Get system health metrics (admin only)"""
    try:
        health_data = AnalyticsManager.get_system_health()
        
        return success_response(
            "System health retrieved successfully",
            data=health_data
        )
        
    except Exception as e:
        current_app.logger.error(f"System health error: {str(e)}")
        return error_response("Failed to fetch system health", status_code=500)

@admin_bp.route('/analytics/recent-activities', methods=['GET'])
@role_required('admin', 'staff')
@secure_endpoint()
def get_recent_activities():
    """Get recent admin activities"""
    try:
        limit = request.args.get('limit', 20, type=int)
        if limit > 100:  # Limit to 100 records
            limit = 100
        
        activities = AnalyticsManager.get_recent_activities(limit)
        
        return success_response(
            "Recent activities retrieved successfully",
            data={
                'activities': activities,
                'limit': limit
            }
        )
        
    except Exception as e:
        current_app.logger.error(f"Recent activities error: {str(e)}")
        return error_response("Failed to fetch recent activities", status_code=500)

@admin_bp.route('/analytics/generate-report', methods=['POST'])
@role_required('admin')
@secure_endpoint()
@audit_sensitive_action('GENERATE_ANALYTICS_REPORT')
def generate_analytics_report():
    """Generate comprehensive analytics report"""
    try:
        data = request.get_json() or {}
        report_type = data.get('report_type', 'monthly')
        
        # Validate report type
        valid_types = ['monthly', 'department', 'performance']
        if report_type not in valid_types:
            return error_response("Invalid report type", status_code=400)
        
        # Parse date parameters
        start_date = None
        end_date = None
        
        if data.get('start_date'):
            try:
                start_date = datetime.fromisoformat(data['start_date'])
            except ValueError:
                return error_response("Invalid start_date format", status_code=400)
        
        if data.get('end_date'):
            try:
                end_date = datetime.fromisoformat(data['end_date'])
            except ValueError:
                return error_response("Invalid end_date format", status_code=400)
        
        # Generate report
        report = AnalyticsManager.generate_report(report_type, start_date, end_date)
        
        # Log the report generation
        log_admin_activity(
            admin_id=get_current_user().id,
            action='generate_report',
            details={'report_type': report_type}
        )
        
        return success_response(
            "Analytics report generated successfully",
            data=report
        )
        
    except Exception as e:
        current_app.logger.error(f"Report generation error: {str(e)}")
        return error_response("Failed to generate report", status_code=500)

def calculate_approval_rate():
    """Calculate approval rate percentage"""
    try:
        total_apps = StudentProfile.query.count()
        if total_apps == 0:
            return 0
        
        approved_apps = StudentProfile.query.filter(
            StudentProfile.status.in_(['approved', 'printed', 'issued'])
        ).count()
        
        return round((approved_apps / total_apps) * 100, 1)
    except:
        return 0