from flask import Flask
from backend.config import LocalDevelopmentConfig
from backend.models import db, User, Role
from flask_security import Security, SQLAlchemyUserDatastore
from backend.resources import api
from flask_caching import Cache
from backend.celery.celery_sarita import celery_init_app
import flask_excel

def create_app():
    app = Flask(__name__, template_folder='frontend', static_folder='frontend', static_url_path='/static')
    app.config.from_object(LocalDevelopmentConfig)

    db.init_app(app)
    cache = Cache(app)
    api.init_app(app)
    flask_excel.init_excel(app)

    datastore = SQLAlchemyUserDatastore(db, User, Role)
    app.cache = cache
    app.security = Security(app, datastore=datastore, register_blueprint=False)

    celery_app = celery_init_app(app)
    app.celery_app = celery_app

    with app.app_context():
        import backend.routes
        import backend.create_initial_data
        import backend.celery.celery_schedule  # Yahan celery_schedule ko import kiya gaya hai
        celery_app.autodiscover_tasks(['backend.celery'])

    return app, celery_app

if __name__ == '__main__':
    app, _ = create_app()
    app.run()
