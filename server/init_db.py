#!/usr/bin/env python3
"""Simple database initialization script"""
import sqlite3
import os

# Create database file and tables manually
db_path = 'gauidview.db'

print(f"Creating database at: {os.path.abspath(db_path)}")

# Delete existing database if it exists
if os.path.exists(db_path):
    os.remove(db_path)

# Create database and tables
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print("Creating tables...")

# Create users table
cursor.execute('''
CREATE TABLE user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'student',
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
''')

# Create student_profile table
cursor.execute('''
CREATE TABLE student_profile (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    student_id VARCHAR(20) UNIQUE NOT NULL,
    date_of_birth DATE,
    department VARCHAR(100),
    year_of_study INTEGER,
    phone_number VARCHAR(20),
    address TEXT,
    emergency_contact VARCHAR(100),
    emergency_phone VARCHAR(20),
    photo_path VARCHAR(255),
    id_status VARCHAR(20) DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE
)
''')

# Create admin_activity table
cursor.execute('''
CREATE TABLE admin_activity (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id INTEGER NOT NULL,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50),
    target_id INTEGER,
    details TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    FOREIGN KEY (admin_id) REFERENCES user (id) ON DELETE CASCADE
)
''')

# Create announcement table
cursor.execute('''
CREATE TABLE announcement (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    author_id INTEGER NOT NULL,
    target_audience VARCHAR(20) DEFAULT 'all',
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES user (id) ON DELETE CASCADE
)
''')

# Create system_settings table
cursor.execute('''
CREATE TABLE system_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    updated_by INTEGER,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (updated_by) REFERENCES user (id)
)
''')

conn.commit()
conn.close()

print("✅ Database created successfully!")
print(f"Database file: {os.path.abspath(db_path)}")