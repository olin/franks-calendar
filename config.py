import os

class ProductionConfig():
    DEBUG = False
    TESTING = False
    ENV = 'production'
    TEMPLATES_AUTO_RELOAD = False
    ADMIN_CODE=os.getenv("ADMIN_CODE")

class DevelopmentConfig():
    DEBUG = True
    TESTING = True
    ENV = 'development'
    TEMPLATES_AUTO_RELOAD = True
    SECRET_KEY="ahhhimasecret"
    ADMIN_CODE="test"
