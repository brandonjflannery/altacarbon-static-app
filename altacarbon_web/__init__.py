from flask import Flask
import requests


# init SQLAlchemy so we can use it later in our models

def create_app():
    app = Flask(__name__, static_folder='static', static_url_path='')



    # blueprint for non-auth parts of app
    from .blueprint_main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    return app