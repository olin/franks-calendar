from flask import Flask
from config import DevelopmentConfig, ProductionConfig

def create_app(config):
    app = Flask(__name__)
    app.config.from_object(config)

    from blueprints.public import public
    app.register_blueprint(public)

    return app

app = create_app(DevelopmentConfig)

if __name__ == '__main__':
    app.run(host="0.0.0.0")
