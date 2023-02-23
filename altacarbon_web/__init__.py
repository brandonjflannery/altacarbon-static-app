from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import sqlalchemy
from flask_login import LoginManager
from oauthlib.oauth2 import WebApplicationClient
import requests


# init SQLAlchemy so we can use it later in our models
db = SQLAlchemy()

def create_app():
    app = Flask(__name__, static_folder='static', static_url_path='')



    db.init_app(app)

    with app.app_context():
        db.create_all() # creates neccessary tabels if they dont exist


    # blueprint for non-auth parts of app
    from .blueprint_main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    return app