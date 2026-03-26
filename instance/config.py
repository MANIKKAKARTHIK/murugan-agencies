import os

SECRET_KEY = "murugan_secret_key"

MAIL_SERVER = "smtp.gmail.com"
MAIL_PORT = 587
MAIL_USE_TLS = True

MAIL_USERNAME = os.getenv("MAIL_USER")
MAIL_PASSWORD = os.getenv("MAIL_PASS")

MAIL_DEFAULT_SENDER = MAIL_USERNAME