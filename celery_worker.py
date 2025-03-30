from app import create_app

flask_app, celery_app = create_app()
flask_app.app_context().push()
