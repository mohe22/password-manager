from passlib.context import CryptContext
import re
import random
import string
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi import HTTPException, status
import secrets
from cryptography.fernet import Fernet
from config import Config
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")



cipher_suite = Fernet(Config.ENCRYPTION_KEY.encode())

def encrypt_password(password: str) -> str:
    """Encrypt a password."""
    return cipher_suite.encrypt(password.encode()).decode()

def decrypt_password(encrypted_password: str) -> str:
    """Decrypt a password."""
    return cipher_suite.decrypt(encrypted_password.encode()).decode()


def hash_password(password: str) -> str:
    """Hash a password."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password."""
    return pwd_context.verify(plain_password, hashed_password)



def is_strong_password(password: str) -> bool:
    """Check if a password is strong based on defined security rules."""
    if len(password) < 12:
        return False
    if not re.search(r'[A-Z]', password):  # At least one uppercase letter
        return False
    if not re.search(r'[a-z]', password):  # At least one lowercase letter
        return False
    if not re.search(r'\d', password):  # At least one digit
        return False
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):  # At least one special character
        return False
    return True





def password_generator(
    length: int = 16,
    include_uppercase: bool = True,
    include_lowercase: bool = True,
    include_digits: bool = True,
    include_special: bool = True,
) -> str:
    """Generate a random secure password based on user-defined parameters.

    Args:
        length: Length of the password (default: 16).
        include_uppercase: Include uppercase letters (default: True).
        include_lowercase: Include lowercase letters (default: True).
        include_digits: Include digits (default: True).
        include_special: Include special characters (default: True).

    Returns:
        A randomly generated password.

    Raises:
        ValueError: If no character types are selected or if the length is too short.
    """
    if length < 12:
        raise ValueError("Password length should be at least 12 characters for security.")

    # Define character sets based on user preferences
    uppercase = string.ascii_uppercase if include_uppercase else ""
    lowercase = string.ascii_lowercase if include_lowercase else ""
    digits = string.digits if include_digits else ""
    special_chars = "!@#$%^&*()-_=+[]{}|;:,.<>?/" if include_special else ""

    # Combine all selected character sets
    all_chars = uppercase + lowercase + digits + special_chars

    # Ensure at least one character type is selected
    if not all_chars:
        raise ValueError("At least one character type must be selected.")

    # Ensure the password contains at least one character from each selected category
    password = []
    if include_uppercase:
        password.append(random.choice(uppercase))
    if include_lowercase:
        password.append(random.choice(lowercase))
    if include_digits:
        password.append(random.choice(digits))
    if include_special:
        password.append(random.choice(special_chars))

    # Fill the rest of the password length with random choices
    remaining_length = length - len(password)
    password += random.choices(all_chars, k=remaining_length)

    # Randomize the order of characters to avoid predictable patterns
    random.shuffle(password)

    return "".join(password)



def generate_otp(digit: int = 6) -> str:
    if not isinstance(digit, int) or digit < 1:
        raise ValueError("The number of digits must be a positive integer.")

    upper_bound = 10 ** digit 
    otp = str(secrets.randbelow(upper_bound)).zfill(digit)
    return otp


def send_email(to_email: str, subject: str, body: str, is_html: bool = False):

    try:
        # Create the email
        msg = MIMEMultipart()
        msg["From"] = Config.SMTP_USERNAME
        msg["To"] = to_email
        msg["Subject"] = subject

        # Attach the body of the email
        if is_html:
            msg.attach(MIMEText(body, "html"))  # Use "html" subtype for HTML content
        else:
            msg.attach(MIMEText(body, "plain"))  # Use "plain" subtype for plain text

        # Connect to the SMTP server
        with smtplib.SMTP(Config.SMTP_SERVER, Config.SMTP_PORT) as server:
            server.starttls()  # Upgrade the connection to secure
            server.login(Config.SMTP_USERNAME, Config.SMTP_PASSWORD)  # Log in to the SMTP server
            server.sendmail(Config.SMTP_USERNAME, to_email, msg.as_string())  # Send the email

        return {"message": "Email sent successfully!"}
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to send email: {str(e)}"
        )



def generate_reset_token() -> str:
    """Generate a secure, random token for password reset."""
    return secrets.token_urlsafe(32)  

def hash_token(token: str) -> str:
    """Hash a token using bcrypt."""
    return pwd_context.hash(token)

def verify_hash_token(plain_token: str, hashed_token: str) -> bool:
    """Verify a token against its hashed version using bcrypt."""
    return pwd_context.verify(plain_token, hashed_token)


