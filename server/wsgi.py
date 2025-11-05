# Production WSGI Configuration for GAU-ID-View Backend
import os
from app import create_app

# Create the application
app = create_app('production')

if __name__ == "__main__":
    # This won't be called in production, but useful for testing
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))