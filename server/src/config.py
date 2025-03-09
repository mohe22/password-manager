from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

class Config:
    # General settings
    FRONTEND_URL = os.getenv("FRONTEND_URL")
    DEBUG = os.getenv("DEBUG", "False").lower() == "true"

    # Database settings
    DATABASE_URL = os.getenv("DATABASE_URL")

    # JWT and encryption settings
    PRIVATE_KEY_PATH = os.getenv("PRIVATE_KEY_PATH")
    PUBLIC_KEY_PATH = os.getenv("PUBLIC_KEY_PATH")
    ACCESS_TOKEN_EXPIRE_HOURS = int(os.getenv("ACCESS_TOKEN_EXPIRE_HOURS", 24))  # Default to 24 hours
    ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY")
    SECRET_KEY = os.getenv("SECRET_KEY")

    # SMTP settings for email
    SMTP_SERVER = os.getenv("SMTP_SERVER")
    SMTP_PORT = int(os.getenv("SMTP_PORT", 587))  # Default to 587
    SMTP_USERNAME = os.getenv("SMTP_USERNAME")
    SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")