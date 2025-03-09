from fastapi import APIRouter, Depends, HTTPException, status, Response, Cookie
from sqlalchemy.orm import Session
from database import get_db
from pydantic import BaseModel, EmailStr
from utils.auth import verify_password, send_email, generate_otp, hash_password, is_strong_password,generate_reset_token,hash_token,verify_hash_token
from utils.jwt import create_access_token, decode_access_token
from utils.logger import logger
import time
from models.models import User
from datetime import datetime, timedelta

router = APIRouter()
otp_store = {}  # Use Redis in production for better performance and persistence.

MAX_RETRIES = 3


# Pydantic Models
class UserLogin(BaseModel):
    email: EmailStr
    password: str


class VerifyOTP(BaseModel):
    email: str
    otp: str


class ResendOTP(BaseModel):
    email: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str
    id:str
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    phone_number: str


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def validate_user_credentials(db: Session, email: str, password: str):
    db_user = get_user_by_email(db, email)
    if not db_user:
        logger.warning(f"Login attempt for non-existent user: {email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    if db_user.is_blocked:
        logger.warning(f"Login attempt for blocked user: {email}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been blocked. Please contact support."
        )

    if not verify_password(password, db_user.hashed_password):
        logger.warning(f"Invalid credentials for: {db_user.username} ({db_user.email})")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    return db_user


def generate_and_send_otp(email: str, user_id: int, username: str):
    if email in otp_store and time.time() < otp_store[email]["expires_at"]:
        logger.info(f"OTP already sent to user: {username} ({email})")
        return {"message": "An OTP has already been sent. Please check your email."}

    otp = generate_otp(6)
    expiration_time = time.time() + 60

    otp_store[email] = {
        "otp": otp,
        "expires_at": expiration_time,
        "retry_count": 0,
        "user_id": user_id,
        "username": username
    }

    html_body = f"""
    <html>
      <body>
        <h1>Welcome to Our password manager</h1>
        <p>Here is your OTP code:</p>
        <p style="font-size: 24px; color: #007BFF;"><strong>{otp}</strong></p>
        <p>This OTP will expire in 60 seconds.</p>
        <p>If you did not request this, please ignore this email.</p>
      </body>
    </html>
    """
    send_email(email, "Your OTP Code", html_body, is_html=True)
    logger.info(f"OTP sent to user: {username} ({email})")
    return {"message": "OTP sent successfully!"}


# Endpoints
@router.post("/login", status_code=status.HTTP_200_OK)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = validate_user_credentials(db, user.email, user.password)
    return generate_and_send_otp(db_user.email, db_user.id, db_user.username)


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: Session = Depends(get_db)):
    if not is_strong_password(user.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 12 characters long, include uppercase, lowercase, a number, and a special character.",
        )

    db_user = db.query(User).filter(
        (User.username == user.username.lower()) | (User.email == user.email) | (User.phone_number == user.phone_number)
    ).first()

    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username, email, or phone number already registered",
        )

    hashed_password = hash_password(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        phone_number=user.phone_number
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    logger.info(f"User registered successfully: {user.username} ({user.email})")

    return {"message": "User registered successfully"}


@router.post("/resend-otp", status_code=status.HTTP_200_OK)
def resend_otp(resend_data: ResendOTP, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, resend_data.email)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return generate_and_send_otp(db_user.email, db_user.id, db_user.username)


@router.post("/verify-otp", status_code=status.HTTP_200_OK)
def verify_otp(otp_data: VerifyOTP, response: Response):
    email = otp_data.email
    otp = otp_data.otp

    if email not in otp_store:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP not found or expired"
        )

    stored_otp = otp_store[email]["otp"]
    expires_at = otp_store[email]["expires_at"]

    if time.time() > expires_at:
        del otp_store[email]
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP expired"
        )

    if "retry_count" in otp_store[email] and otp_store[email]["retry_count"] >= MAX_RETRIES:
        logger.warning(f"Too many failed attempts. Please request a new OTP: {otp_store[email]})")
        del otp_store[email]
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many failed attempts. Please request a new OTP."
        )

    if otp != stored_otp:
        otp_store[email]["retry_count"] += 1
        logger.warning(f"Invalid OTP. You have {MAX_RETRIES - otp_store[email]['retry_count']} attempts remaining.")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid OTP. You have {MAX_RETRIES - otp_store[email]['retry_count']} attempts remaining."
        )

    logger.warning(f"OTP verified successfully! {otp_store[email]}")

    access_token = create_access_token(
        data={
            "sub": str(otp_store[email]["user_id"]),
            "email": email,
            "username": otp_store[email]["username"]
        }
    )

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,
        samesite="Lax",
        max_age=1300,
        path="/"
    )

    del otp_store[email]
    return {"message": "OTP verified successfully!", "access_token": access_token}


@router.post("/verify-token", status_code=status.HTTP_200_OK)
def verify_token(access_token: str = Cookie(None, alias="access_token")):
    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token not found in cookies",
        )

    try:
        payload = decode_access_token(access_token)
        return {"message": "Token is valid", "payload": payload}
    except HTTPException as e:
        raise e


@router.post("/logout", status_code=status.HTTP_200_OK)
def logout(response: Response):
    response.delete_cookie(
        key="access_token",
        path="/",
    )
    return {"message": "Logged out successfully"}






@router.post("/forgot-password", status_code=status.HTTP_200_OK)
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, request.email)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="If the email exists, a reset link has been sent"
        )
    reset_token = generate_reset_token()
    hashed_token = hash_token(reset_token)
    reset_token_expires_at = datetime.now()  + timedelta(minutes=15) 
    db_user.reset_token = hashed_token
    db_user.reset_token_expires_at = reset_token_expires_at
    db.commit()

    reset_link = f"http://localhost:5173/reset-password?token={reset_token}&id={db_user.id}"
    html_body = f"""
    <html>
      <body>
        <h1>Password Reset Request</h1>
        <p>Click the link below to reset your password:</p>
        <p><a href="{reset_link}">Reset Password</a></p>
        <p>This link will expire in 15 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      </body>
    </html>
    """
    send_email(request.email, "Password Reset Request", html_body, is_html=True)

    return {"message": "If the email exists, a reset link has been sent"}




@router.post("/reset-password", status_code=status.HTTP_200_OK)
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == request.id).first()    
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired token"
        )

    if not verify_hash_token(request.token, db_user.reset_token):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired token"
        )

    if datetime.now() > db_user.reset_token_expires_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token has expired"
        )

    if not is_strong_password(request.new_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 12 characters long, include uppercase, lowercase, a number, and a special character."
        )

    db_user.hashed_password = hash_password(request.new_password)
    db_user.reset_token = None
    db_user.reset_token_expires_at = None
    db.commit()

    return {"message": "Password reset successfully"}