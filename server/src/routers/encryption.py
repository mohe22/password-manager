from fastapi import APIRouter, Depends, HTTPException, Response, File, UploadFile,Form
from sqlalchemy.orm import Session
from database import get_db
from utils.auth import encrypt_password, decrypt_password,password_generator
from models.models import  PasswordEntry
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.backends import default_backend
from cryptography.fernet import Fernet
import json
import base64
import os
from pydantic import BaseModel


router = APIRouter()


def derive_key(passphrase: str, salt: bytes) -> bytes:
    """
    Derives a key from a passphrase using PBKDF2.

    PBKDF2 Formula:
        DK = PBKDF2(Password, Salt, PRF, c, dkLen)

    - Password: The user-provided passphrase.
    - Salt: A random cryptographic salt (unique per encryption).
    - PRF: A Pseudo-Random Function (SHA-256 in this case).
    - c (iterations): 100,000 iterations for added security.
    - dkLen: Output key length (32 bytes for AES-256 encryption).

    Returns:
        A base64-encoded encryption key.
    """
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),    # Pseudo-random function (PRF)
        length=32,                    # Output key length (32 bytes for AES-256)
        salt=salt,                    # Unique cryptographic salt
        iterations=100000,             # Number of iterations (100k for security)
        backend=default_backend(),     # Uses the default cryptographic backend
    )
    return base64.urlsafe_b64encode(kdf.derive(passphrase.encode()))

# Encrypt function with passphrase
def encrypt_password(encrypted_file: str, passphrase: str) -> str:
    """Encrypt a password using a user-provided passphrase."""
    salt = os.urandom(16)  # Step1:Generate a random salt
    key = derive_key(passphrase, salt) # Step 2: Derive a strong encryption key from the passphrase using PBKDF2.
    cipher_suite = Fernet(key) # Encrypt the password using AES-based encryption (Fernet).
    # Store salt with encrypted data (as base64 for easy storage)
    return base64.b64encode(salt + cipher_suite.encrypt(encrypted_file.encode()) ).decode()

# Decrypt function with passphrase
def decrypt_password(encrypted_file: str, passphrase: str) -> str:
    """Decrypt a password using the same passphrase."""
    decoded_data = base64.b64decode(encrypted_file) # Decode the Base64-encoded data to extract the salt and encrypted password.
    salt = decoded_data[:16]  # Extract salt
    encrypted_data = decoded_data[16:]  # Extract encrypted data

    key = derive_key(passphrase, salt)
    cipher_suite = Fernet(key)

    return cipher_suite.decrypt(encrypted_data).decode()



@router.get("/export-passwords", response_class=Response)
async def export_passwords(
    user_id: int,
    passphrase: str, 
    db: Session = Depends(get_db)
):
    password_entries = db.query(PasswordEntry).filter(PasswordEntry.user_id == user_id, PasswordEntry.is_deleted == False).all()
    
    if not password_entries:
        raise HTTPException(status_code=404, detail="No password entries found for this user.")

    entries_data = [
        {
            "id": entry.id,
            "title": entry.title,
            "url": entry.url,
            "username": entry.username,
            "encrypted_password": entry.encrypted_password,
            "notes": entry.notes,
            "is_deleted": entry.is_deleted,
            "is_Favrout": entry.is_Favrout,
            "created_at": entry.created_at.isoformat(),
            "updated_at": entry.updated_at.isoformat(),
        }
        for entry in password_entries
    ]

    json_data = json.dumps(entries_data, indent=2)
    encrypted_data = encrypt_password(json_data, passphrase)  

    return Response(
        content=encrypted_data,
        media_type="application/json",
        headers={"Content-Disposition": "attachment; filename=passwords_export.json"},
    )




@router.post("/import-passwords")
async def import_passwords(
    user_id: int,
    passphrase: str = Form(...),  
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    file_content = await file.read()

    try:
        decrypted_data = decrypt_password(file_content.decode(), passphrase)  # Decrypt using passphrase
        entries_data = json.loads(decrypted_data)

        for entry_data in entries_data:
            new_entry = PasswordEntry(
                user_id=user_id,
                title=entry_data["title"],
                url=entry_data["url"],
                username=entry_data["username"],
                encrypted_password=entry_data["encrypted_password"],
                notes=entry_data["notes"],
                is_deleted=entry_data["is_deleted"],
                is_Favrout=entry_data["is_Favrout"],
                created_at=entry_data["created_at"],
                updated_at=entry_data["updated_at"],
            )

            db.add(new_entry)

        db.commit()
        return {"message": "Passwords imported successfully."}

    except Exception as e:
        db.rollback()
        print(e)
        raise HTTPException(status_code=400, detail=f"Failed to import passwords: {str(e)}")






class PasswordGenerationRequest(BaseModel):
    length: int = 16
    include_uppercase: bool = True
    include_lowercase: bool = True
    include_digits: bool = True
    include_special: bool = True


@router.post("/generate-secure-password")
def generate_secure_password(
    settings:PasswordGenerationRequest
):
    """
    Generates a secure password based on user-defined parameters.

    Args:
        length: Length of the password (default: 16, min: 8, max: 64).
        include_uppercase: Include uppercase letters (default: True).
        include_lowercase: Include lowercase letters (default: True).
        include_digits: Include digits (default: True).
        include_special: Include special characters (default: True).

    Returns:
        Generated password.
    """
    try:
        if not any([settings.include_uppercase, settings.include_lowercase, settings.include_digits, settings.include_special]):
            raise HTTPException(
                status_code=400,
                detail="At least one character type must be selected (uppercase, lowercase, digits, or special)."
            )

        password = password_generator(
            length=settings.length,
            include_uppercase=settings.include_uppercase,
            include_lowercase=settings.include_lowercase,
            include_digits=settings.include_digits,
            include_special=settings.include_special,
        )

        return {"password": password}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))