# Analytics System for GAU-ID-View Admin Dashboard
from sqlalchemy import func, extract, text
from models import db, User, StudentProfile, AdminActivity, Announcement
from datetime import datetime, timedelta
from flask import current_app
import calendar

class AnalyticsManager:
    """Manages analytics and reporting for the admin dashboard"""
    
    @staticmethod
    def get_overview_stats():
        """Get high-level overview statistics"""
        try:
            stats = {}
            
            # Basic counts
            stats['total_students'] = User.query.filter_by(role='student').count()
            stats['total_staff'] = User.query.filter_by(role='staff').count()
            stats['total_admins'] = User.query.filter_by(role='admin').count()
            
            # Application status counts
            stats['pending_applications'] = StudentProfile.query.filter_by(status='pending').count()
            stats['reviewing_applications'] = StudentProfile.query.filter_by(status='reviewing').count()
            stats['approved_applications'] = StudentProfile.query.filter_by(status='approved').count()
            stats['rejected_applications'] = StudentProfile.query.filter_by(status='rejected').count()
            stats['printed_cards'] = StudentProfile.query.filter_by(status='printed').count()
            stats['issued_cards'] = StudentProfile.query.filter_by(status='issued').count()
            
            # Active users (logged in last 30 days)
            thirty_days_ago = datetime.utcnow() - timedelta(days=30)
            stats['active_users'] = User.query.filter(
                User.updated_at >= thirty_days_ago,
                User.is_active == True
            ).count()
            
            # Recent activity (last 7 days)
            week_ago = datetime.utcnow() - timedelta(days=7)
            stats['new_registrations_week'] = User.query.filter(
                User.created_at >= week_ago,
                User.role == 'student'
            ).count()
            
            stats['new_applications_week'] = StudentProfile.query.filter(
                StudentProfile.submitted_at >= week_ago
            ).count()
            
            # Calculate completion rates
            total_applications = StudentProfile.query.count()
            if total_applications > 0:
                stats['approval_rate'] = round((stats['approved_applications'] / total_applications) * 100, 1)
                stats['rejection_rate'] = round((stats['rejected_applications'] / total_applications) * 100, 1)
                stats['completion_rate'] = round(((stats['issued_cards'] + stats['printed_cards']) / total_applications) * 100, 1)
            else:
                stats['approval_rate'] = 0
                stats['rejection_rate'] = 0
                stats['completion_rate'] = 0
            
            return stats
            
        except Exception as e:
            current_app.logger.error(f"Analytics overview error: {str(e)}")
            return {}
    
    @staticmethod
    def get_monthly_trends(months=12):
        """Get monthly trends for the past N months"""
        try:
            trends = []
            end_date = datetime.utcnow()
            
            for i in range(months):
                month_start = end_date.replace(day=1) - timedelta(days=i*30)
                month_end = month_start + timedelta(days=31)
                month_start = month_start.replace(day=1)
                
                # Get month data
                month_data = {
                    'month': month_start.strftime('%Y-%m'),
                    'month_name': calendar.month_name[month_start.month],
                    'year': month_start.year
                }
                
                # New registrations
                month_data['new_registrations'] = User.query.filter(
                    User.created_at >= month_start,
                    User.created_at < month_end,
                    User.role == 'student'
                ).count()
                
                # New applications
                month_data['new_applications'] = StudentProfile.query.filter(
                    StudentProfile.submitted_at >= month_start,
                    StudentProfile.submitted_at < month_end
                ).count()
                
                # Approvals
                month_data['approvals'] = StudentProfile.query.filter(
                    StudentProfile.approved_at >= month_start,
                    StudentProfile.approved_at < month_end
                ).count()
                
                # Cards issued
                month_data['cards_issued'] = StudentProfile.query.filter(
                    StudentProfile.issued_at >= month_start,
                    StudentProfile.issued_at < month_end
                ).count()
                
                trends.append(month_data)
            
            # Reverse to get chronological order
            trends.reverse()
            return trends
            
        except Exception as e:
            current_app.logger.error(f"Monthly trends error: {str(e)}")
            return []
    
    @staticmethod
    def get_department_statistics():
        """Get statistics by department"""
        try:
            dept_stats = []
            
            # Get department counts using raw SQL for better performance
            query = text("""
                SELECT 
                    u.department,
                    COUNT(*) as total_students,
                    SUM(CASE WHEN sp.status = 'pending' THEN 1 ELSE 0 END) as pending,
                    SUM(CASE WHEN sp.status = 'approved' THEN 1 ELSE 0 END) as approved,
                    SUM(CASE WHEN sp.status = 'rejected' THEN 1 ELSE 0 END) as rejected,
                    SUM(CASE WHEN sp.status = 'issued' THEN 1 ELSE 0 END) as issued
                FROM users u
                LEFT JOIN student_profiles sp ON u.id = sp.user_id
                WHERE u.role = 'student'
                GROUP BY u.department
                ORDER BY total_students DESC
            """)
            
            result = db.session.execute(query)
            
            for row in result:
                dept_data = {
                    'department': row.department,
                    'total_students': row.total_students or 0,
                    'pending': row.pending or 0,
                    'approved': row.approved or 0,
                    'rejected': row.rejected or 0,
                    'issued': row.issued or 0
                }
                
                # Calculate completion rate
                if dept_data['total_students'] > 0:
                    dept_data['completion_rate'] = round(
                        (dept_data['issued'] / dept_data['total_students']) * 100, 1
                    )
                else:
                    dept_data['completion_rate'] = 0
                
                dept_stats.append(dept_data)
            
            return dept_stats
            
        except Exception as e:
            current_app.logger.error(f"Department statistics error: {str(e)}")
            return []
    
    @staticmethod
    def get_status_distribution():
        """Get application status distribution"""
        try:
            status_counts = db.session.query(
                StudentProfile.status,
                func.count(StudentProfile.id).label('count')
            ).group_by(StudentProfile.status).all()
            
            distribution = {}
            total = 0
            
            for status, count in status_counts:
                distribution[status] = count
                total += count
            
            # Calculate percentages
            if total > 0:
                for status in distribution:
                    distribution[status] = {
                        'count': distribution[status],
                        'percentage': round((distribution[status] / total) * 100, 1)
                    }
            
            return distribution
            
        except Exception as e:
            current_app.logger.error(f"Status distribution error: {str(e)}")
            return {}
    
    @staticmethod
    def get_processing_times():
        """Calculate average processing times"""
        try:
            processing_times = {}
            
            # Average time from submission to approval
            approved_apps = StudentProfile.query.filter(
                StudentProfile.approved_at.isnot(None),
                StudentProfile.submitted_at.isnot(None)
            ).all()
            
            if approved_apps:
                approval_times = []
                for app in approved_apps:
                    time_diff = (app.approved_at - app.submitted_at).total_seconds() / 3600  # hours
                    approval_times.append(time_diff)
                
                processing_times['avg_approval_time_hours'] = round(sum(approval_times) / len(approval_times), 1)
                processing_times['avg_approval_time_days'] = round(processing_times['avg_approval_time_hours'] / 24, 1)
            else:
                processing_times['avg_approval_time_hours'] = 0
                processing_times['avg_approval_time_days'] = 0
            
            # Average time from approval to printing
            printed_apps = StudentProfile.query.filter(
                StudentProfile.printed_at.isnot(None),
                StudentProfile.approved_at.isnot(None)
            ).all()
            
            if printed_apps:
                printing_times = []
                for app in printed_apps:
                    time_diff = (app.printed_at - app.approved_at).total_seconds() / 3600
                    printing_times.append(time_diff)
                
                processing_times['avg_printing_time_hours'] = round(sum(printing_times) / len(printing_times), 1)
            else:
                processing_times['avg_printing_time_hours'] = 0
            
            # Average time from printing to issuance
            issued_apps = StudentProfile.query.filter(
                StudentProfile.issued_at.isnot(None),
                StudentProfile.printed_at.isnot(None)
            ).all()
            
            if issued_apps:
                issuance_times = []
                for app in issued_apps:
                    time_diff = (app.issued_at - app.printed_at).total_seconds() / 3600
                    issuance_times.append(time_diff)
                
                processing_times['avg_issuance_time_hours'] = round(sum(issuance_times) / len(issuance_times), 1)
            else:
                processing_times['avg_issuance_time_hours'] = 0
            
            return processing_times
            
        except Exception as e:
            current_app.logger.error(f"Processing times error: {str(e)}")
            return {}
    
    @staticmethod
    def get_recent_activities(limit=10):
        """Get recent admin activities"""
        try:
            activities = AdminActivity.query.order_by(
                AdminActivity.created_at.desc()
            ).limit(limit).all()
            
            activity_list = []
            for activity in activities:
                activity_data = activity.to_dict()
                
                # Add admin user info
                if activity.admin:
                    activity_data['admin_name'] = activity.admin.name
                    activity_data['admin_email'] = activity.admin.email
                
                # Add target user info if applicable
                if activity.target_user:
                    activity_data['target_user_name'] = activity.target_user.name
                    activity_data['target_user_email'] = activity.target_user.email
                
                activity_list.append(activity_data)
            
            return activity_list
            
        except Exception as e:
            current_app.logger.error(f"Recent activities error: {str(e)}")
            return []
    
    @staticmethod
    def get_system_health():
        """Get system health metrics"""
        try:
            health = {}
            
            # Database health
            try:
                db.session.execute(text('SELECT 1'))
                health['database'] = 'healthy'
            except Exception:
                health['database'] = 'unhealthy'
            
            # Recent error counts
            # This would typically check log files or error tracking system
            health['recent_errors'] = 0  # Placeholder
            
            # Active sessions (simplified)
            health['active_sessions'] = User.query.filter(
                User.updated_at >= datetime.utcnow() - timedelta(hours=1)
            ).count()
            
            # Disk usage (placeholder - would check actual disk usage)
            health['disk_usage_percent'] = 45  # Placeholder
            
            # Memory usage (placeholder - would check actual memory)
            health['memory_usage_percent'] = 32  # Placeholder
            
            return health
            
        except Exception as e:
            current_app.logger.error(f"System health error: {str(e)}")
            return {'status': 'error', 'message': str(e)}
    
    @staticmethod
    def generate_report(report_type='monthly', start_date=None, end_date=None):
        """Generate comprehensive reports"""
        try:
            report = {
                'generated_at': datetime.utcnow().isoformat(),
                'report_type': report_type,
                'period': {
                    'start_date': start_date.isoformat() if start_date else None,
                    'end_date': end_date.isoformat() if end_date else None
                }
            }
            
            if report_type == 'monthly':
                # Monthly report
                report['overview'] = AnalyticsManager.get_overview_stats()
                report['monthly_trends'] = AnalyticsManager.get_monthly_trends(12)
                report['department_stats'] = AnalyticsManager.get_department_statistics()
                report['processing_times'] = AnalyticsManager.get_processing_times()
                
            elif report_type == 'department':
                # Department-specific report
                report['department_stats'] = AnalyticsManager.get_department_statistics()
                report['status_distribution'] = AnalyticsManager.get_status_distribution()
                
            elif report_type == 'performance':
                # Performance report
                report['processing_times'] = AnalyticsManager.get_processing_times()
                report['system_health'] = AnalyticsManager.get_system_health()
                report['recent_activities'] = AnalyticsManager.get_recent_activities(50)
            
            return report
            
        except Exception as e:
            current_app.logger.error(f"Report generation error: {str(e)}")
            return {'error': str(e)}

# Export the analytics manager
__all__ = ['AnalyticsManager']