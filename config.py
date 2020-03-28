class ProductionConfig():
    DEBUG = False
    TESTING = False
    ENV = 'production'
    TEMPLATES_AUTO_RELOAD = False

class DevelopmentConfig():
    DEBUG = True
    TESTING = True
    ENV = 'development'
    TEMPLATES_AUTO_RELOAD = True
