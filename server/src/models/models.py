from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, func
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    phone_number = Column(String(255), unique=True, index=True, nullable=True) 
    is_blocked = Column(Boolean, default=False, nullable=False)  
    is_verified = Column(Boolean, default=False, nullable=False)  
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    reset_token = Column(String(900), nullable=True)
    reset_token_expires_at = Column(DateTime, nullable=True)
    # Define relationship to PasswordEntry
    password_entries = relationship("PasswordEntry", back_populates="owner")
class PasswordEntry(Base):
    __tablename__ = 'password_entries'
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    title = Column(String(255), nullable=False)  # Max length: 255
    url = Column(String(2083))  # Max URL length per RFC 3986
    username = Column(String(150), nullable=False)  # Reasonable length for usernames
    encrypted_password = Column(Text, nullable=False)  
    notes = Column(Text)  
    created_at = Column(DateTime, server_default=func.now())  
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())  
    is_deleted = Column(Boolean, default=False, nullable=False)  
    is_Favrout = Column(Boolean, default=False, nullable=False)  

    # Define back reference to User
    owner = relationship("User", back_populates="password_entries")
    