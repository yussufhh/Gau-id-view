#!/usr/bin/env python3
"""
Minimal Registration Test - Debug the 500 error
"""

import sys
import os

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

print("🔍 Testing registration components...")

try:
    print("1. Testing imports...")
    from simple_app import create_simple_app
    from models import User, StudentProfile, db
    from schemas import RegisterSchema
    print("✅ All imports successful")
    
    print("\n2. Testing app creation...")
    app = create_simple_app()
    print("✅ App created successfully")
    
    print("\n3. Testing schema validation...")
    schema = RegisterSchema()
    test_data = {
        "name": "Test User",
        "reg_number": "S999/2024/99",
        "email": "test@student.gau.ac.ke",
        "department": "Test Dept",
        "password": "TestPass123!"
    }
    
    try:
        validated_data = schema.load(test_data)
        print("✅ Schema validation successful")
        print(f"   Validated data: {validated_data}")
    except Exception as schema_err:
        print(f"❌ Schema validation failed: {schema_err}")
    
    print("\n4. Testing database operations...")
    with app.app_context():
        try:
            # Check if user exists
            existing_user = User.query.filter_by(email="test@student.gau.ac.ke").first()
            if existing_user:
                print(f"⚠️  User already exists: {existing_user.email}")
                db.session.delete(existing_user)
                db.session.commit()
                print("🗑️  Removed existing user")
            
            # Try to create a new user
            user = User(
                name="Test User",
                reg_number="S999/2024/99",
                email="test@student.gau.ac.ke",
                department="Test Dept",
                role="student"
            )
            user.set_password("TestPass123!")
            
            db.session.add(user)
            db.session.flush()
            
            print(f"✅ User created successfully with ID: {user.id}")
            
            # Try to create profile
            profile = StudentProfile(
                user_id=user.id,
                phone=None,
                course=None,
                year_of_study=None,
                status='active'
            )
            
            db.session.add(profile)
            db.session.commit()
            
            print("✅ Student profile created successfully")
            print(f"   User: {user.to_dict()}")
            print(f"   Profile: {profile.to_dict()}")
            
        except Exception as db_err:
            db.session.rollback()
            print(f"❌ Database operation failed: {type(db_err).__name__}: {db_err}")
            import traceback
            traceback.print_exc()
    
    print("\n🎯 Component test completed!")
    
except Exception as e:
    print(f"❌ Test failed: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()